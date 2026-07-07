'use client';
import Link from 'next/link';
import { useState } from 'react';

const steps = [
  { n: '01', title: 'Консультация', desc: 'Обсуждаем ваши пожелания, стиль интерьера и бюджет' },
  { n: '02', title: 'Проект', desc: 'Разрабатываем 3D-визуализацию и согласовываем детали' },
  { n: '03', title: 'Производство', desc: 'Изготавливаем мебель из выбранных материалов' },
  { n: '04', title: 'Доставка и сборка', desc: 'Доставляем и профессионально собираем на месте' },
];

const examples = [
  '/photos/1nATC-gb.jpg',
  '/photos/9GKWoY0k.jpg',
  '/photos/CWw1Dh9b.jpg',
  '/photos/Ce1Den6q.jpg',
  '/photos/DkESoVwv.jpg',
  '/photos/FxLhQYGE.jpg',
  '/photos/dFEP82d5.jpg',
  '/photos/jSVIyafQ.jpg',
  '/photos/jwCq7FQ7.jpg',
  '/photos/of-wRB_L.jpg',
  '/photos/v1YDmbWZ.jpg',
  '/photos/vM6q5wD_.jpg',
];

export default function IndividualProjectsPage() {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      await fetch(`${apiUrl}/contact/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'individual-project' }),
      });
    } catch { /* silent */ }
    setSent(true);
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      {/* Hero с фото кабинета */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Фото кабинета на фоне */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/cabinet.jpg"
            alt="Кабинет по индивидуальному проекту"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '64rem', margin: '0 auto' }}>
          <div className="section-label mb-4">Индивидуальный подход</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Мебель по вашему<br />проекту
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '36rem', marginBottom: '2.5rem' }}>
            Создаём уникальные предметы мебели под конкретное пространство и задачу. От эскиза до готового изделия — полное сопровождение.
          </p>
          <a href="#order-form" className="btn-gold-solid" style={{ textDecoration: 'none' }}>
            Обсудить проект
          </a>
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div className="section-label mb-8" style={{ textAlign: 'center' }}>Как это работает</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map(s => (
            <div key={s.n}>
              <div style={{ color: 'rgba(201,169,110,0.2)', fontSize: '3rem', fontFamily: 'serif', fontWeight: 300, lineHeight: 1, marginBottom: '1rem' }}>{s.n}</div>
              <div className="serif" style={{ color: 'var(--text2)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '0.5rem' }}>{s.title}</div>
              <p style={{ color: 'var(--muted2)', fontSize: '0.75rem', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Примеры проектов */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div className="section-label mb-8" style={{ textAlign: 'center' }}>Реализованные проекты</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {examples.map((img, i) => (
              <div key={i} style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#1a1a1a' }}>
                <img src={img} alt={`Проект ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Форма заявки */}
      <div id="order-form" style={{ maxWidth: '40rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div className="section-label mb-4" style={{ textAlign: 'center' }}>Заявка</div>
        <h2 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, marginBottom: '1rem', textAlign: 'center' }}>
          Обсудим ваш проект
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2.5rem', textAlign: 'center', lineHeight: 1.8 }}>
          Оставьте заявку — мы свяжемся в течение 2 часов
        </p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '3rem', border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.04)' }}>
            <div style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Заявка отправлена</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'name', placeholder: 'Ваше имя', type: 'text', required: true },
              { key: 'phone', placeholder: 'Телефон', type: 'tel', required: true },
            ].map(({ key, placeholder, type, required }) => (
              <input key={key} type={type} placeholder={placeholder} required={required}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,110,0.15)', color: 'var(--text)', fontSize: '0.8rem', padding: '0.85rem 1rem', outline: 'none', width: '100%' }}
              />
            ))}
            <textarea
              placeholder="Расскажите о вашем проекте (размеры, материалы, пожелания)"
              rows={4}
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,110,0.15)', color: 'var(--text)', fontSize: '0.8rem', padding: '0.85rem 1rem', outline: 'none', width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
            />
            <button type="submit"
              style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '1rem', cursor: 'pointer', marginTop: '0.5rem', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.15)')}
            >
              Отправить заявку
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
