'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'Где находится производство мебели?',
    a: 'Наше производство находится в Екатеринбурге.',
  },
  {
    q: 'Можно ли приехать на фабрику?',
    a: 'Да, можем провести экскурсию по цеху, показать используемые материалы и наши работы. Фото и видео процесса отправляем клиентам по запросу.',
  },
  {
    q: 'Сколько времени занимает изготовление?',
    a: 'Все зависит от сложности заказа и дополнительных пожеланий, обычно стандартные позиции производим до 45 календарных дней.',
  },
  {
    q: 'Как доставляете заказ?',
    a: 'Доставляем заказ транспортными компаниями по России и в страны СНГ. Стоимость доставки — по индивидуальному расчёту.',
  },
  {
    q: 'На каких условиях оформляется заказ?',
    a: 'Заключаем договор, оплату принимаем по счету: 70% предоплата, 30% — по готовности изделия. Работаем с физическими и юридическими лицами. Доступен ЭДО.',
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label mb-6">FAQ</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Часто задаваемые вопросы</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem' }}>Всё, что нужно знать о заказе премиальной мебели</p>
        </div>
      </div>

      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)', marginBottom: '0' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <h2 className="serif" style={{ color: open === i ? '#c9a96e' : '#c8bfb0', fontSize: '1.15rem', fontWeight: 300, lineHeight: 1.3, transition: 'color 0.3s' }}>
                {faq.q}
              </h2>
              <span style={{ color: '#c9a96e', fontSize: '1.2rem', marginLeft: '1rem', flexShrink: 0, transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              <div style={{ paddingBottom: '2rem' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.9 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
