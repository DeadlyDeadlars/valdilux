'use client';
import { useEffect, useRef, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws/chat';

function getChatId() {
  let id = localStorage.getItem('chat_id');
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem('chat_id', id); }
  return id;
}

type Message = { from: 'user' | 'manager'; text: string; ts: number };

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const [unread, setUnread] = useState(0);
  const ws = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatId = getChatId();
    const socket = new WebSocket(`${WS_URL}?chatId=${chatId}`);
    ws.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'history') {
        setMessages(data.messages || []);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, { from: data.from, text: data.text, ts: data.ts }]);
        if (data.from === 'manager' && !open) setUnread(n => n + 1);
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !ws.current || ws.current.readyState !== 1) return;
    ws.current.send(JSON.stringify({ type: 'message', text: text.trim() }));
    setText('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
      {open && (
        <div style={{ width: 320, height: 420, background: '#141414', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', flexDirection: 'column', marginBottom: '0.75rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(201,169,110,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="serif" style={{ color: '#c8bfb0', fontSize: '0.9rem', fontWeight: 300 }}>ValDiLux</div>
              <div style={{ color: connected ? '#6a8060' : '#6a6058', fontSize: '0.6rem', marginTop: '0.1rem' }}>
                {connected ? '● онлайн' : '○ подключение...'}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#4a4540', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {messages.length === 0 && (
              <div style={{ color: '#4a4540', fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem' }}>
                Здравствуйте! Чем можем помочь?
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.5rem 0.75rem', fontSize: '0.78rem', lineHeight: 1.5,
                  background: m.from === 'user' ? 'rgba(201,169,110,0.15)' : '#1e1e1e',
                  color: m.from === 'user' ? '#c9a96e' : '#c8bfb0',
                  border: `1px solid ${m.from === 'user' ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} style={{ borderTop: '1px solid rgba(201,169,110,0.1)', display: 'flex' }}>
            <input
              value={text} onChange={e => setText(e.target.value)}
              placeholder="Написать сообщение..."
              style={{ flex: 1, background: 'none', border: 'none', color: '#c8bfb0', padding: '0.75rem 1rem', fontSize: '0.78rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            <button type="submit" style={{ padding: '0 1rem', background: 'none', border: 'none', color: '#c9a96e', cursor: 'pointer', fontSize: '1rem' }}>→</button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ width: 52, height: 52, borderRadius: '50%', background: '#c9a96e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(201,169,110,0.3)', position: 'relative' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open
            ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            : <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>
          }
        </svg>
        {unread > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#c06060', color: '#fff', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
