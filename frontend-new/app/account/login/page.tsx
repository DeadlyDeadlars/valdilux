'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.name, form.password, form.phone);
      }
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.12)',
    color: 'var(--text2)', padding: '0.875rem 1rem', fontSize: '0.8rem', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '26rem', padding: '1.5rem' }}>
        <div className="section-label mb-4" style={{ textAlign: 'center' }}>Личный кабинет</div>
        <h1 className="serif" style={{ color: 'var(--text)', fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '2rem' }}>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>

        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{ flex: 1, padding: '0.75rem', background: 'none', border: 'none', borderBottom: mode === m ? '2px solid #c9a96e' : '2px solid transparent', color: mode === m ? '#c9a96e' : '#6a6058', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              {m === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && (
            <>
              <input required placeholder="Имя *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
              <input placeholder="Телефон" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inp} />
            </>
          )}
          <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} />
          <input required type="password" placeholder="Пароль *" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inp} />

          {error && <p style={{ color: '#c06060', fontSize: '0.7rem' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-gold-solid"
            style={{ cursor: 'pointer', border: 'none', opacity: loading ? 0.6 : 1, marginTop: '0.5rem' }}
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted2)', fontSize: '0.7rem' }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>← На главную</Link>
        </p>
      </div>
    </div>
  );
}
