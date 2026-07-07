import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Отзывы клиентов — ValDiLux',
  description: 'Реальные отзывы покупателей о мебели ValDiLux. Фото готовых изделий от наших клиентов.',
};

const REVIEWS = [
  {
    name: 'Александр М.',
    rating: 5,
    date: '12 марта 2026',
    text: 'Заказывал письменный стол из массива дуба. Качество превзошло все ожидания — идеальная обработка, ровные углы, приятный запах дерева. Доставили в срок, аккуратно упаковали. Буду заказывать ещё.',
    product: 'Письменный стол из дуба',
  },
  {
    name: 'Елена В.',
    rating: 5,
    date: '28 февраля 2026',
    text: 'Очень довольна шкафом! Сделали по индивидуальным размерам под нашу нишу. Мастера приехали, замерили, через 3 недели привезли готовое изделие. Всё встало идеально. Рекомендую!',
    product: 'Шкаф по индивидуальному проекту',
  },
  {
    name: 'Дмитрий К.',
    rating: 5,
    date: '15 февраля 2026',
    text: 'Брал комод из ясеня. Смотрится дорого и солидно. Ящики ходят плавно, фурнитура качественная. Цвет точно совпал с образцом. Спасибо мастерам за отличную работу!',
    product: 'Комод из ясеня',
  },
  {
    name: 'Ирина С.',
    rating: 5,
    date: '3 февраля 2026',
    text: 'Заказывала журнальный столик. Привезли быстро, упаковка была отличная — ни царапины. Столик красивый, массив ореха смотрится роскошно. Уже советую всем знакомым.',
    product: 'Журнальный столик из ореха',
  },
  {
    name: 'Сергей П.',
    rating: 5,
    date: '20 января 2026',
    text: 'Оформлял кабинет под ключ: стол, стеллаж и тумба. Всё в едином стиле, всё из одного массива. Результат — просто великолепен. Работаю в удовольствие каждый день.',
    product: 'Комплект для кабинета',
  },
  {
    name: 'Наталья Р.',
    rating: 5,
    date: '8 января 2026',
    text: 'Консоль в прихожую — именно то, что искала. Долго не могла найти подходящий размер в магазинах, здесь сделали точно по моим параметрам. Качество дерева отменное.',
    product: 'Консоль в прихожую',
  },
];

export default function ReviewsPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">ОТЗЫВЫ</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>
            Что говорят наши клиенты
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            Реальные отзывы покупателей с Авито и нашего сайта
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', marginBottom: '4rem' }}>
          {[
            { value: '500+', label: 'Довольных клиентов' },
            { value: '4.9', label: 'Средняя оценка' },
            { value: '20+', label: 'Лет мастерства' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0d0d0d', padding: '2rem', textAlign: 'center' }}>
              <div className="serif" style={{ color: '#c9a96e', fontSize: '2.5rem', fontWeight: 300 }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1px', background: 'var(--border)' }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ background: '#0d0d0d', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 400 }}>{r.name}</div>
                  <div style={{ color: '#c9a96e', fontSize: '1rem', marginTop: '0.25rem' }}>{'★'.repeat(r.rating)}</div>
                </div>
                <div style={{ color: 'var(--muted2)', fontSize: '0.65rem' }}>{r.date}</div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1rem' }}>{r.text}</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--muted2)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.product}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <p className="serif" style={{ color: 'var(--text2)', fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.75rem' }}>
            Хотите оставить отзыв?
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            Напишите нам в мессенджерах или оставьте отзыв на Авито
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://t.me/Valdilux_mebel"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2rem',
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#c9a96e',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Telegram
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOKBmU6imfN_JGcs3nE4xAXE4j3ow9K7QaKrK-zb4W1Yj_N19G4"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2rem',
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#c9a96e',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Max
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
