'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './AdminChat.module.css';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws/chat';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type Message = { from: 'user' | 'manager'; text: string; ts: number; chatId: string };

export default function AdminChatPage() {
  const [pass, setPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<string[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [text, setText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reconnectAttempts = useRef(0);
  const mounted = useRef(true);
  const tokenRef = useRef<string | null>(null);

  const connect = useCallback((token: string) => {
    tokenRef.current = token;
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'auth', token }));
    };

    socket.onmessage = (e) => {
      let data: any;
      try { data = JSON.parse(e.data); } catch { return; }

      if (data.type === 'auth') {
        if (data.ok) {
          setAuthed(true);
          setLoading(false);
          reconnectAttempts.current = 0;
        } else {
          setAuthed(false);
          setLoading(false);
          setAuthError('Неверный пароль');
        }
      } else if (data.type === 'rooms') {
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

    socket.onclose = () => {
      if (!mounted.current) return;
      if (tokenRef.current) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectAttempts.current++;
        reconnectTimer.current = setTimeout(() => connect(tokenRef.current!), delay);
      }
    };
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetch('/api/admin/ws-token')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ token }) => connect(token))
      .catch(() => setLoading(false));

    return () => {
      mounted.current = false;
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });

    if (!res.ok) {
      setLoading(false);
      setAuthError('Неверный пароль');
      return;
    }

    fetch('/api/admin/ws-token')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ token }) => connect(token))
      .catch(() => { setLoading(false); setAuthError('Ошибка авторизации'); });
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

  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <div className={`serif ${styles.loginTitle}`}>Чат менеджера</div>
          <div style={{ color: 'var(--muted2)', fontSize: '0.8rem', textAlign: 'center' }}>Подключение...</div>
        </div>
      </div>
    );
  }

  if (!authed) return (
    <div className={styles.loginContainer}>
      <form onSubmit={login} className={styles.loginForm}>
        <div className={`serif ${styles.loginTitle}`}>Чат менеджера</div>
        {authError && <div className={styles.loginError}>{authError}</div>}
        <input type="password" placeholder="Пароль администратора" value={pass} onChange={e => setPass(e.target.value)} className={styles.input} />
        <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer' }}>Войти</button>
      </form>
    </div>
  );

  const roomMessages = activeRoom ? (messages[activeRoom] || []) : [];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Активные чаты ({rooms.length})</div>
        {rooms.length === 0 && (
          <div className={styles.sidebarEmpty}>Нет активных чатов</div>
        )}
        {rooms.map(chatId => {
          const last = messages[chatId]?.at(-1);
          return (
            <button key={chatId} onClick={() => selectRoom(chatId)}
              className={`${styles.roomBtn} ${activeRoom === chatId ? styles.roomBtnActive : ''}`}
            >
              <div className={styles.roomId}>#{chatId.slice(0, 8)}</div>
              {last && <div className={styles.roomLast}>{last.text}</div>}
            </button>
          );
        })}
      </div>

      <div className={styles.chatArea}>
        {!activeRoom ? (
          <div className={styles.chatPlaceholder}>Выберите чат</div>
        ) : (
          <>
            <div className={styles.chatHeader}>Чат #{activeRoom.slice(0, 8)}</div>
            <div className={styles.chatMessages}>
              {roomMessages.map(m => (
                <div key={`${m.chatId}-${m.ts}`} className={`${styles.row} ${m.from === 'manager' ? styles.rowRight : styles.rowLeft}`}>
                  <div className={`${styles.bubble} ${m.from === 'manager' ? styles.bubbleManager : styles.bubbleUser}`}>
                    <div className={styles.bubbleLabel}>{m.from === 'manager' ? 'Вы' : 'Посетитель'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} className={styles.chatForm}>
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Ответить..." className={`${styles.input} ${styles.chatInput}`} />
              <button type="submit" className={`btn-gold-solid ${styles.sendBtn}`}>Отправить</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
