import Link from 'next/link';
import { api } from '@/lib/api';
import type { Category, ProductsResponse } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

async function getData() {
  try {
    const [categories, hits, newItems] = await Promise.allSettled([
      api.get<Category[]>('/categories'),
      api.get<ProductsResponse>('/products?label=hit&limit=8'),
      api.get<ProductsResponse>('/products?label=new&limit=8'),
    ]);
    return {
      categories: categories.status === 'fulfilled' ? categories.value : [],
      hits: hits.status === 'fulfilled' ? hits.value.data : [],
      newItems: newItems.status === 'fulfilled' ? newItems.value.data : [],
    };
  } catch {
    return { categories: [], hits: [], newItems: [] };
  }
}

const W = { maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' };
const CENTER: React.CSSProperties = { textAlign: 'center' };

const MAIN_CATEGORIES = [
  { name: 'Письменный стол', slug: 'письменный-стол' },
  { name: 'Книжный шкаф', slug: 'книжный-шкаф' },
  { name: 'Стеллаж', slug: 'стеллаж' },
  { name: 'Сервант', slug: 'сервант' },
  { name: 'Комод', slug: 'комод' },
  { name: 'Журнальный стол', slug: 'журнальный-стол' },
  { name: 'Брифинг стола', slug: 'брифинг-стола' },
  { name: 'ТВ тумба', slug: 'тв-тумба' },
];

export default async function HomePage() {
  const { categories, hits, newItems } = await getData();

  return (
    <>
      {/* HERO VIDEO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
        >
          <source src="/boston.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.5 }} />
        <div style={{ position: 'relative', width: '100%', ...CENTER }} className="px-4 fade-up">
          <h1 className="serif fade-up-1" style={{ color: 'var(--text)', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '0.02em', textShadow: '0 6px 40px rgba(0,0,0,0.7)' }}>
            Искусство<br />премиальной мебели
          </h1>
          <div className="fade-up-3" style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/catalog" className="btn-gold">Исследовать коллекцию</Link>
            <Link href="/contacts" className="btn-gold">Индивидуальный проект</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span className="section-label" style={{ fontSize: '0.55rem', letterSpacing: '0.3em' }}>Листайте вниз</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...W, padding: '3.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            { num: '20+', label: 'лет мастерства' },
            { num: '100%', label: 'гарантия качества' },
            { icon: (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)' }}>
                <path d="M12 22v-7"/>
                <path d="M12 15l-4-4H5l7-7 7 7h-3l-4 4z"/>
                <path d="M8.5 15H4l8-8 8 8h-4.5"/>
              </svg>
            ), label: 'мотив дерева' },
          ].map(({ num, icon, label }) => (
            <div key={label} style={{ ...CENTER, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#c9a96e', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'clamp(2rem, 4vw, 3rem)' }} className={num ? 'serif' : ''}>
                {num || icon}
              </div>
              <div style={{ marginTop: 4, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted2)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ФИЛОСОФИЯ */}
      <section style={{ position: 'relative', padding: '7rem 1.5rem', overflow: 'hidden', ...CENTER }}>
        {/* Видео фон - улучшенное качество */}
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
          className="hidden md:block"
        >
          <source src="/столрейка.mp4" type="video/mp4" />
        </video>
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          className="md:hidden"
        >
          <source src="/столрейка.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.6 }} />
        
        <div style={{ position: 'relative', maxWidth: '56rem', margin: '0 auto' }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Философия</span></div>
          <h2 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.2, textShadow: '0 6px 35px rgba(0,0,0,0.6)' }}>
            Мебель, которая<br />переживёт время
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.9, maxWidth: 560, margin: '1.5rem auto 0', textShadow: '0 2px 15px rgba(0,0,0,0.4)' }}>
            Мы создаём не просто предметы интерьера. Каждое изделие — это инвестиция в качество, которое будет служить поколениям.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/about" className="nav-link">О компании →</Link>
          </div>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      <section style={{ padding: '0 1.5rem 6rem', ...CENTER }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Коллекции</span></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MAIN_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/catalog?category=${cat.slug}`} className="cat-card">
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>{cat.name}</div>
                <div style={{ marginTop: 12, width: 24, height: 1, background: 'var(--gold)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ХИТЫ */}
      {hits.length > 0 && (
        <section style={{ background: 'var(--bg2)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', ...CENTER }}>
            <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Хиты продаж</span></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hits.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ marginTop: '3.5rem' }}>
              <Link href="/catalog" className="btn-gold">Весь каталог</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 md:py-36" style={{ position: 'relative', padding: '3rem 1.5rem', overflow: 'hidden', background: 'var(--bg3)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center" style={{ position: 'relative', maxWidth: '80rem', margin: '0 auto' }}>
          {/* Фото кабинета */}
          <div style={{ aspectRatio: '4/3', overflow: 'hidden', border: '1px solid var(--border2)' }}>
            <img
              src="/cabinet.jpg"
              alt="Кабинет по индивидуальному проекту"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div className="section-label mb-4 md:mb-8">Индивидуальный подход</div>
            <h2 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.15 }}>
              Мебель по вашему проекту
            </h2>
            <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '1rem 0' }} className="md:my-6" />
            <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.875rem' }}>
              Разработаем и изготовим мебель по индивидуальным размерам и дизайну.
            </p>
            <div className="mt-6 md:mt-12">
              <Link href="/contacts" className="btn-gold-solid">Оставить заявку</Link>
            </div>
          </div>
        </div>
      </section>

      {/* НОВИНКИ */}
      {newItems.length > 0 && (
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', ...CENTER }}>
            <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Новинки</span></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {newItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ПРЕИМУЩЕСТВА */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Почему ValDiLux-mebel</span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Гарантия качества', text: 'Используем только сертифицированные материалы. Гарантия на все изделия — 3 года.' },
              { title: 'Точно в срок', text: 'Соблюдаем договорные сроки. Производство от 14 до 60 календарных дней.' },
              { title: 'Доставка и сборка', text: 'Доставляем по всей России. Самовывоз г. Екатеринбург.' },
            ].map(({ title, text }) => (
              <div key={title} style={{ ...CENTER, padding: '0 1.5rem' }}>
                <div style={{ width: 56, height: 56, border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <div style={{ width: 20, height: 20, border: '1px solid rgba(201,169,110,0.4)' }} />
                </div>
                <h3 style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--muted2)', fontSize: '0.75rem', lineHeight: 1.8 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* МАСТЕРСТВО */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', ...CENTER }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Мастерство</span></div>
          <h2 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, marginBottom: '3rem' }}>
            От эскиза до совершенства
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Отбор материалов', text: 'Только массив премиальных пород дерева' },
              { n: '02', title: 'Производство', text: 'Каждая деталь обрабатывается с вниманием' },
              { n: '03', title: 'Контроль качества', text: 'Многоступенчатая проверка на каждом этапе' },
            ].map(({ n, title, text }) => (
              <div key={n} style={{ borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: '1.5rem' }}>
                <div style={{ color: 'rgba(201,169,110,0.3)', fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>{n}</div>
                <h4 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ color: 'var(--muted2)', fontSize: '0.75rem', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
