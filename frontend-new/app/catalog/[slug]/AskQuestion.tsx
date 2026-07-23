'use client';
import { useState } from 'react';
import { useContactForm } from '@/lib/useContactForm';

export default function AskQuestion({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', question: '' });
  const { status, error, submit, reset } = useContactForm('/contact/question');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({ ...form, product: productName });
    if (status !== 'error') {
      setTimeout(() => { setOpen(false); reset(); setForm({ name: '', phone: '', question: '' }); }, 2500);
    }
  };

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,110,0.15)', color: 'var(--text)', fontSize: '0.8rem', padding: '0.75rem 1rem', outline: 'none', width: '100%' };

  return (
    <>
      <button type="button"
        onClick={() => setOpen(true)}
        className="gold-border-btn"
        style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.6rem 1.25rem', marginBottom: '1rem', alignSelf: 'flex-start' }}
      >
        Задать вопрос
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{ background: 'var(--bg)', border: '1px solid rgba(201,169,110,0.2)', padding: '2.5rem', width: '100%', maxWidth: 420, position: 'relative' }}>
            <h2 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Задать вопрос</h2>
            <p style={{ color: 'var(--muted2)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>По товару: {productName}</p>
            {status === 'ok' ? (
              <p style={{ color: '#c9a96e', textAlign: 'center', padding: '1rem 0' }}>Вопрос отправлен! Мы ответим в ближайшее время.</p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'name', placeholder: 'Ваше имя', type: 'text', required: true },
                  { key: 'phone', placeholder: 'Телефон или email', type: 'text', required: true },
                ].map(({ key, placeholder, type, required }) => (
                  <input key={key} type={type} placeholder={placeholder} required={required}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                ))}
                <textarea
                  placeholder="Ваш вопрос"
                  required
                  rows={3}
                  value={form.question}
                  onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
                {error && <p style={{ color: '#c06060', fontSize: '0.75rem', textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={status === 'loading'}
                  className="gold-submit-btn"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.85rem', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
                >
                  {status === 'loading' ? 'Отправка...' : 'Отправить'}
                </button>
              </form>
            )}
            <button type="button" onClick={() => setOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
        </div>
      )}
    </>
  );
}
