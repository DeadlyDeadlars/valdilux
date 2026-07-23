import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { prisma } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const rooms = new Map();
const managers = new Set();
const authPending = new WeakSet();
const messageTimestamps = new WeakMap();

const RATE_WINDOW = 60_000;
const RATE_MAX = 20;
const HEARTBEAT_INTERVAL = 30_000;
const HISTORY_LIMIT = 500;

export function setupChat(server) {
  const wss = new WebSocketServer({ server, path: '/ws/chat' });

  const hb = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);
  wss.on('close', () => clearInterval(hb));

  wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    const url = new URL(req.url, 'http://localhost');
    const chatId = url.searchParams.get('chatId');

    if (chatId) {
      handleVisitor(ws, chatId);
    } else {
      authPending.add(ws);
      ws.on('message', (raw) => handleManagerAuth(ws, raw));
      ws.on('close', () => { authPending.delete(ws); managers.delete(ws); });
    }
  });
}

function handleVisitor(ws, chatId) {
  if (!rooms.has(chatId)) rooms.set(chatId, new Set());
  rooms.get(chatId).add(ws);
  ws.chatId = chatId;

  prisma.chatMessage.findMany({
    where: { chatId },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_LIMIT,
  }).then(messages => {
    ws.send(JSON.stringify({
      type: 'history',
      messages: messages.reverse().map(m => ({ from: m.from, text: m.text, ts: m.createdAt.getTime() })),
    }));
  }).catch(() => {
    ws.send(JSON.stringify({ type: 'history', messages: [] }));
  });

  broadcast(managers, { type: 'rooms', rooms: [...rooms.keys()] });

  ws.on('message', (raw) => {
    if (!checkRate(ws)) {
      ws.send(JSON.stringify({ type: 'error', message: 'Слишком много сообщений. Подождите минуту.' }));
      return;
    }
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type !== 'message') return;

    const text = (msg.text || '').trim();
    if (!text || text.length > 2000) return;

    const entry = { from: 'user', text, ts: Date.now() };

    prisma.chatMessage.create({ data: { chatId, from: 'user', text } }).catch(() => {});

    const payload = JSON.stringify({ type: 'message', chatId, ...entry });
    rooms.get(chatId)?.forEach(c => c.readyState === 1 && c.send(payload));
    broadcast(managers, payload);
  });

  ws.on('close', () => {
    rooms.get(chatId)?.delete(ws);
    if (rooms.get(chatId)?.size === 0) {
      rooms.delete(chatId);
      broadcast(managers, { type: 'rooms', rooms: [...rooms.keys()] });
    }
  });
}

function handleManagerAuth(ws, raw) {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }
  if (msg.type !== 'auth') {
    ws.send(JSON.stringify({ type: 'error', message: 'First message must be auth' }));
    return ws.close();
  }

  let authorized = false;
  if (msg.password && msg.password === process.env.ADMIN_PASS) {
    authorized = true;
  }
  if (msg.token) {
    try {
      const decoded = jwt.verify(msg.token, JWT_SECRET);
      if (decoded.role === 'admin') authorized = true;
    } catch {}
  }

  if (!authorized) {
    ws.send(JSON.stringify({ type: 'auth', ok: false }));
    return ws.close();
  }

  authPending.delete(ws);
  managers.add(ws);
  ws.send(JSON.stringify({ type: 'auth', ok: true }));
  ws.send(JSON.stringify({ type: 'rooms', rooms: [...rooms.keys()] }));

  ws.removeAllListeners('message');
  ws.on('message', (raw) => handleManagerMsg(ws, raw));
  ws.on('close', () => managers.delete(ws));
}

function handleManagerMsg(ws, raw) {
  if (!checkRate(ws)) {
    ws.send(JSON.stringify({ type: 'error', message: 'Слишком много сообщений. Подождите минуту.' }));
    return;
  }
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }

  if (msg.type === 'message' && msg.chatId) {
    const text = (msg.text || '').trim();
    if (!text || text.length > 2000) return;

    const entry = { from: 'manager', text, ts: Date.now() };
    prisma.chatMessage.create({ data: { chatId: msg.chatId, from: 'manager', text } }).catch(() => {});

    const payload = JSON.stringify({ type: 'message', chatId: msg.chatId, ...entry });
    rooms.get(msg.chatId)?.forEach(c => c.readyState === 1 && c.send(payload));
    ws.send(payload);
  }

  if (msg.type === 'history' && msg.chatId) {
    prisma.chatMessage.findMany({
      where: { chatId: msg.chatId },
      orderBy: { createdAt: 'desc' },
      take: HISTORY_LIMIT,
    }).then(messages => {
      ws.send(JSON.stringify({
        type: 'history',
        chatId: msg.chatId,
        messages: messages.reverse().map(m => ({ from: m.from, text: m.text, ts: m.createdAt.getTime() })),
      }));
    }).catch(() => {
      ws.send(JSON.stringify({ type: 'history', chatId: msg.chatId, messages: [] }));
    });
  }
}

function checkRate(ws) {
  const now = Date.now();
  let timestamps = messageTimestamps.get(ws);
  if (!timestamps) {
    timestamps = [];
    messageTimestamps.set(ws, timestamps);
  }
  while (timestamps.length && timestamps[0] < now - RATE_WINDOW) timestamps.shift();
  if (timestamps.length >= RATE_MAX) return false;
  timestamps.push(now);
  return true;
}

function broadcast(set, data) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  set.forEach(ws => ws.readyState === 1 && ws.send(payload));
}
