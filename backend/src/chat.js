import { WebSocketServer } from 'ws';

// chatId -> Set of ws connections (посетитель + менеджеры)
const rooms = new Map();
// chatId -> messages[]
const history = new Map();
// менеджерские соединения
const managers = new Set();

export function setupChat(server) {
  const wss = new WebSocketServer({ server, path: '/ws/chat' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const chatId = url.searchParams.get('chatId');
    const isManager = url.searchParams.get('manager') === process.env.ADMIN_PASS;

    if (isManager) {
      managers.add(ws);
      // отправить список активных чатов
      ws.send(JSON.stringify({ type: 'rooms', rooms: [...rooms.keys()] }));

      ws.on('message', (raw) => {
        const msg = JSON.parse(raw);
        // менеджер отвечает в конкретный чат
        if (msg.type === 'message' && msg.chatId) {
          const entry = { from: 'manager', text: msg.text, ts: Date.now() };
          saveAndBroadcast(msg.chatId, entry, ws);
        }
        // менеджер запрашивает историю чата
        if (msg.type === 'history' && msg.chatId) {
          ws.send(JSON.stringify({ type: 'history', chatId: msg.chatId, messages: history.get(msg.chatId) || [] }));
        }
      });

      ws.on('close', () => managers.delete(ws));
      return;
    }

    if (!chatId) { ws.close(); return; }

    if (!rooms.has(chatId)) rooms.set(chatId, new Set());
    rooms.get(chatId).add(ws);

    // отправить историю новому посетителю
    ws.send(JSON.stringify({ type: 'history', messages: history.get(chatId) || [] }));

    // уведомить менеджеров о новом чате
    broadcast(managers, { type: 'rooms', rooms: [...rooms.keys()] });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw);
      if (msg.type === 'message') {
        const entry = { from: 'user', text: msg.text, ts: Date.now() };
        saveAndBroadcast(chatId, entry, ws);
      }
    });

    ws.on('close', () => {
      rooms.get(chatId)?.delete(ws);
      if (rooms.get(chatId)?.size === 0) rooms.delete(chatId);
    });
  });
}

function saveAndBroadcast(chatId, entry, sender) {
  if (!history.has(chatId)) history.set(chatId, []);
  history.get(chatId).push(entry);

  const payload = JSON.stringify({ type: 'message', chatId, ...entry });

  // всем в комнате
  rooms.get(chatId)?.forEach(ws => ws !== sender && ws.readyState === 1 && ws.send(payload));
  // всем менеджерам
  managers.forEach(ws => ws !== sender && ws.readyState === 1 && ws.send(payload));
  // отправителю тоже (эхо)
  sender.readyState === 1 && sender.send(payload);
}

function broadcast(set, data) {
  const payload = JSON.stringify(data);
  set.forEach(ws => ws.readyState === 1 && ws.send(payload));
}
