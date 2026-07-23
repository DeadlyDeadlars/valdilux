'use client';
import { useState, useEffect, startTransition } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (!stored) startTransition(() => setVisible(true));
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
    window.dispatchEvent(new Event('cookie-consent-accepted'));
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#0d0d0d',
        borderTop: '1px solid rgba(201,169,110,0.15)',
        padding: '1rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
          textAlign: 'center',
        }}
        className="md:flex-row md:text-left"
      >
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', lineHeight: 1.6, flex: 1 }}>
          Мы используем cookie для аналитики и улучшения работы сайта.{' '}
          <a href="/privacy" style={{ color: '#c9a96e', textDecoration: 'underline' }}>
            Подробнее
          </a>
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={reject}
            style={{
              background: 'none',
              border: '1px solid rgba(201,169,110,0.2)',
              color: 'var(--muted)',
              padding: '0.5rem 1rem',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Отклонить
          </button>
          <button
            onClick={accept}
            style={{
              background: '#c9a96e',
              border: 'none',
              color: '#0a0a0a',
              padding: '0.5rem 1.25rem',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
