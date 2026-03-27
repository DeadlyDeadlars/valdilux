'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'Как рассчитывается стоимость индивидуального проекта?',
    a: 'Стоимость рассчитывается персонально для каждого заказа. На итоговую цену влияет выбор материала, сложность проекта, объём работы и дополнительные элементы. Мы всегда стараемся сделать процесс расчёта максимально прозрачным.',
    subs: [
      { title: 'Выбор материала', text: 'Массив бука, ясеня или дуба имеют разные характеристики и стоимость.' },
      { title: 'Сложность проекта', text: 'Сложные конструктивные элементы, необычная форма, встроенные механизмы.' },
      { title: 'Объём работы', text: 'Эксклюзивная резьба, инкрустация, индивидуальная окраска.' },
      { title: 'Дополнительные элементы', text: 'Особые покрытия, фурнитура, интеграция современных технологий.' },
    ],
  },
  {
    q: 'Как выбрать покрытие столешницы?',
    a: 'По умолчанию используем качественную искусственную кожу. Также доступны натуральная кожа и сукно.',
    subs: [
      { title: 'Натуральная кожа', text: 'Придаёт роскоши и благородства, отличается мягкостью и долговечностью.' },
      { title: 'Сукно', text: 'Классический выбор для игровых столов, создаёт приятную поверхность.' },
    ],
  },
  {
    q: 'Как выбрать цвет мебели?',
    a: 'По умолчанию используем морилку выбранного вами цвета. Также возможно покрытие эмалью по палитре RAL.',
    subs: [
      { title: 'Морилка', text: 'Вариантов много, вы всегда сможете подобрать подходящий оттенок.' },
      { title: 'Эмаль RAL', text: 'Международная шкала позволяет найти точный и уникальный оттенок.' },
    ],
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label mb-6">FAQ</div>
          <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Часто задаваемые вопросы</h1>
          <p style={{ color: '#6a6058', fontSize: '0.85rem', marginTop: '1rem' }}>Всё, что нужно знать о заказе премиальной мебели</p>
        </div>
      </div>

      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(201,169,110,0.08)', marginBottom: '0' }}>
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
                <p style={{ color: '#6a6058', fontSize: '0.875rem', lineHeight: 1.9, marginBottom: '1.5rem' }}>{faq.a}</p>
                {faq.subs && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faq.subs.map(s => (
                      <div key={s.title} style={{ borderLeft: '1px solid rgba(201,169,110,0.2)', paddingLeft: '1rem' }}>
                        <div style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{s.title}</div>
                        <p style={{ color: '#5a5248', fontSize: '0.75rem', lineHeight: 1.7 }}>{s.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
