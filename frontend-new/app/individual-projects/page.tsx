import Link from 'next/link';

const steps = [
  { n: '01', title: 'Консультация', desc: 'Обсуждаем ваши пожелания, стиль интерьера и бюджет' },
  { n: '02', title: 'Проект', desc: 'Разрабатываем 3D-визуализацию и согласовываем детали' },
  { n: '03', title: 'Производство', desc: 'Изготавливаем мебель из выбранных материалов' },
  { n: '04', title: 'Доставка и сборка', desc: 'Доставляем и профессионально собираем на месте' },
];

const examples = [
  { title: 'Гостиная в стиле минимализм', material: 'Дуб беленый', time: '45 дней' },
  { title: 'Кухня с островом', material: 'Орех американский', time: '60 дней' },
  { title: 'Домашний кабинет', material: 'Ясень натуральный', time: '30 дней' },
  { title: 'Спальня под ключ', material: 'Дуб + металл', time: '50 дней' },
];

export default function IndividualProjectsPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div className="section-label mb-4">Индивидуальный подход</div>
          <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Мебель по вашему<br />проекту
          </h1>
          <p style={{ color: '#6a6058', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '36rem', marginBottom: '2.5rem' }}>
            Создаём уникальные предметы мебели под конкретное пространство и задачу. От эскиза до готового изделия — полное сопровождение.
          </p>
          <Link href="/contacts" className="btn-gold-solid" style={{ textDecoration: 'none' }}>
            Обсудить проект
          </Link>
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div className="section-label mb-8" style={{ textAlign: 'center' }}>Как это работает</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map(s => (
            <div key={s.n}>
              <div style={{ color: 'rgba(201,169,110,0.2)', fontSize: '3rem', fontFamily: 'serif', fontWeight: 300, lineHeight: 1, marginBottom: '1rem' }}>{s.n}</div>
              <div className="serif" style={{ color: '#c8bfb0', fontSize: '1.1rem', fontWeight: 300, marginBottom: '0.5rem' }}>{s.title}</div>
              <p style={{ color: '#4a4540', fontSize: '0.75rem', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(201,169,110,0.06)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div className="section-label mb-8" style={{ textAlign: 'center' }}>Примеры проектов</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map(ex => (
              <div key={ex.title} style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '2rem' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#1a1a1a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 40, height: 40, border: '1px solid rgba(201,169,110,0.1)', borderRadius: '50%' }} />
                </div>
                <div className="serif" style={{ color: '#c8bfb0', fontSize: '1.1rem', fontWeight: 300, marginBottom: '0.75rem' }}>{ex.title}</div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <div style={{ color: '#4a4540', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Материал</div>
                    <div style={{ color: '#6a6058', fontSize: '0.75rem' }}>{ex.material}</div>
                  </div>
                  <div>
                    <div style={{ color: '#4a4540', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Срок</div>
                    <div style={{ color: '#6a6058', fontSize: '0.75rem' }}>{ex.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, marginBottom: '1rem' }}>
          Готовы обсудить ваш проект?
        </h2>
        <p style={{ color: '#6a6058', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Оставьте заявку — мы свяжемся в течение 2 часов
        </p>
        <Link href="/contacts" className="btn-gold" style={{ textDecoration: 'none' }}>
          Оставить заявку
        </Link>
      </div>
    </div>
  );
}
