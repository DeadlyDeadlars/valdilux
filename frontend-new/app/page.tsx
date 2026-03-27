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

export default async function HomePage() {
  const { categories, hits, newItems } = await getData();

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1510 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 1px 1px, #c9a96e 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div style={{ width: '100%', ...CENTER }} className="px-4 fade-up">
          <div className="section-label mb-8" style={{ fontSize: '0.75rem' }}>Премиальная мебель</div>
          <h1 className="serif fade-up-1" style={{ color: '#f0ebe3', fontSize: 'clamp(4rem, 9vw, 8rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '0.02em' }}>
            Искусство<br />премиальной<br />мебели
          </h1>
          <p className="fade-up-2" style={{ color: '#6a6058', fontSize: '1rem', marginTop: '2rem', letterSpacing: '0.05em' }}>
            Каждое изделие — воплощение качества
          </p>
          <div className="fade-up-3" style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/catalog" className="btn-gold">Исследовать коллекцию</Link>
            <Link href="/contacts" className="btn-gold">Индивидуальный проект</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span className="section-label" style={{ fontSize: '0.55rem', letterSpacing: '0.3em' }}>Листайте вниз</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0a0a0a', borderTop: '1px solid rgba(201,169,110,0.08)', borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
        <div style={{ ...W, padding: '3.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }} className="md:grid-cols-4">
          {[
            { num: '12+', label: 'лет мастерства' },
            { num: '3 000+', label: 'довольных клиентов' },
            { num: '500+', label: 'моделей в каталоге' },
            { num: '100%', label: 'гарантия качества' },
          ].map(({ num, label }) => (
            <div key={label} style={CENTER}>
              <div className="serif" style={{ color: '#c9a96e', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300 }}>{num}</div>
              <div style={{ marginTop: 4, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a5248' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ФИЛОСОФИЯ */}
      <section style={{ padding: '7rem 1.5rem', ...CENTER }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Философия</span></div>
          <h2 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.2 }}>
            Мебель, которая<br />переживёт время
          </h2>
          <p style={{ color: '#6a6058', fontSize: '1rem', lineHeight: 1.9, maxWidth: 560, margin: '1.5rem auto 0' }}>
            Мы создаём не просто предметы интерьера. Каждое изделие — это инвестиция в качество, которое будет служить поколениям.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/about" className="nav-link">Узнать больше →</Link>
          </div>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      {categories.length > 0 && (
        <section style={{ padding: '0 1.5rem 6rem', ...CENTER }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Коллекции</span></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => (
                <Link key={cat.id} href={`/catalog?category=${cat.slug}`} className="cat-card">
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a09080' }}>{cat.name}</div>
                  {cat._count && <div style={{ marginTop: 8, fontSize: '0.6rem', color: '#4a4540' }}>{cat._count.products} моделей</div>}
                  <div style={{ marginTop: 12, width: 24, height: 1, background: 'rgba(201,169,110,0.3)' }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ХИТЫ */}
      {hits.length > 0 && (
        <section style={{ background: '#0a0a0a', padding: '5rem 1.5rem' }}>
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
      <section style={{ position: 'relative', padding: '9rem 1.5rem', overflow: 'hidden', background: '#0f0f0f' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,18,8,0.9) 0%, rgba(15,15,15,0.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #c9a96e 0, #c9a96e 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto', ...CENTER }}>
          <div className="section-label mb-8">Индивидуальный подход</div>
          <h2 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.15 }}>
            Мебель по вашему проекту
          </h2>
          <div style={{ width: 40, height: 1, background: 'rgba(201,169,110,0.3)', margin: '1.5rem auto' }} />
          <p style={{ color: '#6a6058', lineHeight: 1.9, fontSize: '0.875rem' }}>
            Разработаем и изготовим мебель по индивидуальным размерам и дизайну.
          </p>
          <div style={{ marginTop: '3rem' }}>
            <Link href="/contacts" className="btn-gold-solid">Оставить заявку</Link>
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
      <section style={{ background: '#0a0a0a', borderTop: '1px solid rgba(201,169,110,0.06)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Почему ValDiLux</span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Гарантия качества', text: 'Используем только сертифицированные материалы. Гарантия на все изделия — 2 года.' },
              { title: 'Точно в срок', text: 'Соблюдаем договорные сроки. Производство от 14 дней для стандартных позиций.' },
              { title: 'Доставка и сборка', text: 'Доставляем по всей России. Профессиональная сборка и установка на месте.' },
            ].map(({ title, text }) => (
              <div key={title} style={{ ...CENTER, padding: '0 1.5rem' }}>
                <div style={{ width: 56, height: 56, border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <div style={{ width: 20, height: 20, border: '1px solid rgba(201,169,110,0.4)' }} />
                </div>
                <h3 style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: '#5a5248', fontSize: '0.75rem', lineHeight: 1.8 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* МАСТЕРСТВО */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', ...CENTER }}>
          <div className="gold-divider" style={{ justifyContent: 'center' }}><span className="section-label">Мастерство</span></div>
          <h2 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300, marginBottom: '3rem' }}>
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
                <p style={{ color: '#5a5248', fontSize: '0.75rem', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
