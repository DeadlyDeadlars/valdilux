'use client';
import { useState } from 'react';
import { useContactForm } from '@/lib/useContactForm';

const inputStyle = {
  width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.12)',
  color: 'var(--text2)', padding: '0.875rem 1rem', fontSize: '0.8rem', outline: 'none',
  fontFamily: 'Inter, sans-serif', transition: 'border-color 0.3s',
};

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const { status, error, submit } = useContactForm('/contact');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(form);
    if (status !== 'error') setForm({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label mb-6">Связь</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Контакты</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem' }}>Свяжитесь с нами удобным способом</p>
        </div>
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "4rem 1.5rem" }} className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          {[
            {
              title: 'Телефоны',
              content: (
                <>
                  <a href="tel:+79058052465" style={{ display: 'block', color: 'var(--text2)', fontSize: '0.9rem', textDecoration: 'none', marginBottom: '0.4rem' }}>+7 (905) 805-24-65</a>
                  <p style={{ color: 'var(--muted2)', fontSize: '0.7rem', marginTop: '0.5rem' }}>Готовы ответить на любой вопрос</p>
                </>
              ),
            },
            {
              title: 'Email',
              content: (
                <>
                  <a href="mailto:valdilux-mebel@yandex.ru" style={{ color: 'var(--text2)', fontSize: '0.9rem', textDecoration: 'none' }}>valdilux-mebel@yandex.ru</a>
                  <p style={{ color: 'var(--muted2)', fontSize: '0.7rem', marginTop: '0.5rem' }}>Ответим в течение часа</p>
                </>
              ),
            },
            {
              title: 'Производство',
              content: (
                <>
                  <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.7 }}>Свердловская обл., г. Екатеринбург,<br />пос. Октябрьский, ул. Свердлова, 18</p>
                  <p style={{ color: 'var(--muted2)', fontSize: '0.7rem', marginTop: '0.5rem' }}>Возможен визит по предварительной записи</p>
                </>
              ),
            },
            {
              title: 'Мессенджеры',
              content: (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="https://t.me/Valdilux_mebel" target="_blank" rel="noopener" className="btn-gold" style={{ fontSize: '0.6rem' }}>Telegram</a>
                  <a href="https://max.ru/u/f9LHodD0cOKBmU6imfN_JGcs3nE4xAXE4j3ow9K7QaKrK-zb4W1Yj_N19G4" target="_blank" rel="noopener" className="btn-gold" style={{ fontSize: '0.6rem' }}>Max</a>
                  <a href="https://wa.me/79058052465" target="_blank" rel="noopener" className="btn-gold" style={{ fontSize: '0.6rem' }}>WhatsApp</a>
                </div>
              ),
            },
          ].map(({ title, content }) => (
            <div key={title} style={{ marginBottom: '2.5rem', borderLeft: '1px solid rgba(201,169,110,0.15)', paddingLeft: '1.5rem' }}>
              <div className="section-label mb-3">{title}</div>
              {content}
            </div>
          ))}

          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <div className="section-label mb-3">Реквизиты</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', lineHeight: 1.8 }}>
              ИП Минин Дмитрий Витальевич<br />
              ИНН: 661903101020<br />
              ОГРН: 324665800125389
            </p>
          </div>
        </div>

        <div>
          <h2 className="serif" style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '2rem' }}>Задать вопрос</h2>
          {status === 'ok' ? (
            <div style={{ background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.2)', padding: '2rem', textAlign: 'center' }}>
              <div style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Отправлено</div>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required placeholder="Ваше имя *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              <input placeholder="Телефон" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
              <textarea required placeholder="Сообщение *" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
              {error && <p style={{ color: '#c06060', fontSize: '0.75rem' }}>{error}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none', opacity: status === 'loading' ? 0.6 : 1 }}>
                {status === 'loading' ? 'Отправка...' : 'Отправить'}
              </button>
              <p style={{ color: '#3a3530', fontSize: '0.65rem' }}>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
