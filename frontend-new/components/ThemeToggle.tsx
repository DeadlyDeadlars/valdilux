'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <button onClick={toggle} aria-label="Переключить тему"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1, padding: '0.25rem', transition: 'color 0.3s' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
