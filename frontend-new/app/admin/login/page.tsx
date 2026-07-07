'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });
    if (res.ok) router.push('/admin');
    else setError('Неверный пароль');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 280 }}>
        <div className="serif" style={{ color: '#c9a96e', fontSize: '1.5rem', fontWeight: 300, textAlign: 'center' }}>Admin</div>
        <input type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)}
          style={{ background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.15)', color: 'var(--text2)', padding: '0.75rem 1rem', fontSize: '0.8rem', outline: 'none' }} />
        {error && <p style={{ color: '#c06060', fontSize: '0.7rem' }}>{error}</p>}
        <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer' }}>Войти</button>
      </form>
    </div>
  );
}
