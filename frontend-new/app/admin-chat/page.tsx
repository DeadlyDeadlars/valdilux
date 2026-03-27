'use client';
import { useEffect, useRef, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws/chat';

type Message = { from: 'user' | 'manager'; text: string; ts: number; chatId: string };

export default function AdminChatPage() {
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const [rooms, setRooms] = useState<string[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [text, setText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const connect = (password: string) => {
    const socket = new WebSocket(`${WS_URL}?manager=${password}`);
    ws.current = socket;

    socket.onopen = () => setAuthed(true);
    socket.onclose = () => setAuthed(false);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'rooms') {
        setRooms(data.rooms);
      } else if (data.type === 'history') {
        setMessages(prev => ({ ...prev, [data.chatId]: data.messages }));
      } else if (data.type === 'message') {
        setMessages(prev => ({
          ...prev,
          [data.chatId]: [...(prev[data.chatId] || []), { from: data.from, text: data.text, ts: data.ts, chatId: data.chatId }],
        }));
      }
    };
  };

  const selectRoom = (chatId: string) => {
    setActiveRoom(chatId);
    ws.current?.send(JSON.stringify({ type: 'history', chatId }));
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeRoom || !ws.current) return;
    ws.current.send(JSON.stringify({ type: 'message', chatId: activeRoom, text: text.trim() }));
    setText('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoom]);

  const inp = { background: '#141414', border: '1px solid rgba(201,169,110,0.15)', color: '#c8bfb0', padding: '0.75rem 1rem', fontSize: '0.8rem', outline: 'none', fontFamily: 'Inter, sans-serif' };

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <form onSubmit={e => { e.preventDefault(); connect(pass); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 280 }}>
        <div className="serif" style={{ color: '#c9a96e', fontSize: '1.5rem', fontWeight: 300, textAlign: 'center' }}>Чат менеджера</div>
        <input type="password" placeholder="Пароль администратора" value={pass} onChange={e => setPass(e.target.value)} style={{ ...inp, width: '100%' }} />
        <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer' }}>Войти</button>
      </form>
    </div>
  );

  const roomMessages = activeRoom ? (messages[activeRoom] || []) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', paddingTop: '4rem' }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid rgba(201,169,110,0.08)', padding: '1.5rem 0' }}>
        <div style={{ color: '#6a6058', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 1rem', marginBottom: '1rem' }}>
          Активные чаты ({rooms.length})
        </div>
        {rooms.length === 0 && (
          <div style={{ color: '#3a3530', fontSize: '0.75rem', padding: '0 1rem' }}>Нет активных чатов</div>
        )}
        {rooms.map(chatId => {
          const last = messages[chatId]?.at(-1);
          const unread = !activeRoom || activeRoom !== chatId;
          return (
            <button key={chatId} onClick={() => selectRoom(chatId)}
              style={{ width: '100%', padding: '0.75rem 1rem', background: activeRoom === chatId ? 'rgba(201,169,110,0.06)' : 'none', border: 'none', borderLeft: activeRoom === chatId ? '2px solid #c9a96e' : '2px solid transparent', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ color: '#c8bfb0', fontSize: '0.7rem' }}>#{chatId.slice(0, 8)}</div>
              {last && <div style={{ color: '#4a4540', fontSize: '0.65rem', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last.text}</div>}
            </button>
          );
        })}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeRoom ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a3530', fontSize: '0.85rem' }}>
            Выберите чат
          </div>
        ) : (
          <>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(201,169,110,0.08)', color: '#6a6058', fontSize: '0.7rem' }}>
              Чат #{activeRoom.slice(0, 8)}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {roomMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'manager' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '70%', padding: '0.5rem 0.875rem', fontSize: '0.8rem', lineHeight: 1.5, background: m.from === 'manager' ? 'rgba(201,169,110,0.12)' : '#1a1a1a', color: m.from === 'manager' ? '#c9a96e' : '#c8bfb0', border: `1px solid ${m.from === 'manager' ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.04)'}` }}>
                    <div style={{ color: '#4a4540', fontSize: '0.55rem', marginBottom: '0.2rem' }}>{m.from === 'manager' ? 'Вы' : 'Посетитель'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} style={{ borderTop: '1px solid rgba(201,169,110,0.08)', display: 'flex', padding: '0.75rem 1.5rem', gap: '0.75rem' }}>
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Ответить..." style={{ ...inp, flex: 1 }} />
              <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer', padding: '0 1.5rem' }}>Отправить</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
