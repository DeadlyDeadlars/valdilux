'use client';
import { useEffect, useRef, useState, startTransition } from 'react';
import styles from './LiveChat.module.css';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws/chat';

function getChatId() {
  if (typeof window === 'undefined') return '';
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
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reconnectAttempts = useRef(0);
  const mounted = useRef(true);

  const connect = useRef(() => {
    const chatId = getChatId();
    if (!chatId) return;
    const socket = new WebSocket(`${WS_URL}?chatId=${chatId}`);
    ws.current = socket;

    socket.onopen = () => {
      setConnected(true);
      reconnectAttempts.current = 0;
    };

    socket.onclose = () => {
      setConnected(false);
      if (!mounted.current) return;
      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
      reconnectAttempts.current++;
      reconnectTimer.current = setTimeout(connect.current, delay);
    };

    socket.onmessage = (e) => {
      let data: any;
      try { data = JSON.parse(e.data); } catch { return; }
      if (data.type === 'history') {
        setMessages(data.messages || []);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, { from: data.from, text: data.text, ts: data.ts }]);
        if (data.from === 'manager' && !open) setUnread(n => n + 1);
      }
    };
  });

  useEffect(() => {
    mounted.current = true;
    connect.current();
    return () => {
      mounted.current = false;
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) startTransition(() => setUnread(0));
  }, [open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !ws.current || ws.current.readyState !== 1) return;
    ws.current.send(JSON.stringify({ type: 'message', text: text.trim() }));
    setText('');
  };

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <div className={`serif ${styles.brandName}`}>ValDiLux</div>
              <div className={connected ? styles.statusOnline : styles.statusOffline}>
                {connected ? '● онлайн' : '○ подключение...'}
              </div>
            </div>
            <button onClick={() => setOpen(false)} className={styles.closeBtn}>×</button>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.empty}>Здравствуйте! Чем можем помочь?</div>
            )}
            {messages.map(m => (
              <div key={m.ts} className={`${styles.row} ${m.from === 'user' ? styles.rowRight : styles.rowLeft}`}>
                <div className={`${styles.bubble} ${m.from === 'user' ? styles.bubbleUser : styles.bubbleManager}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className={styles.form}>
            <input
              value={text} onChange={e => setText(e.target.value)}
              placeholder="Написать сообщение..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn}>→</button>
          </form>
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} className={styles.toggleBtn}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open
            ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            : <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>
          }
        </svg>
        {unread > 0 && (
          <span className={styles.badge}>{unread}</span>
        )}
      </button>
    </div>
  );
}
