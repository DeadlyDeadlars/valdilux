'use client';
import Link from 'next/link';
import { useCompare } from '@/lib/compare';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default function ComparePage() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--muted2)', fontSize: '0.85rem', marginBottom: '2rem' }}>Нет товаров для сравнения</p>
          <Link href="/catalog" className="btn-gold">Перейти в каталог</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { key: 'price', label: 'Цена' },
    { key: 'material', label: 'Материал' },
    { key: 'inStock', label: 'Наличие' },
  ];

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300 }}>Сравнение товаров</h1>
          <button onClick={clear} className="btn-gold" style={{ cursor: 'pointer', border: '1px solid rgba(201,169,110,0.4)', background: 'none' }}>
            Очистить
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}></th>
              {items.map(item => (
                <th key={item.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', minWidth: 200 }}>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => remove(item.id)} style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: '#c06060', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                    <Link href={`/catalog/${item.slug}`} style={{ textDecoration: 'none' }}>
                      {item.images?.[0] && (
                        <img src={`${API_BASE}${item.images[0]}`} alt={item.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', marginBottom: '1rem' }} />
                      )}
                      <div className="serif" style={{ color: 'var(--text2)', fontSize: '1rem', fontWeight: 300 }}>{item.name}</div>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map(spec => (
              <tr key={spec.key}>
                <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                  {spec.label}
                </td>
                {items.map(item => (
                  <td key={item.id} style={{ padding: '1rem', color: 'var(--text2)', fontSize: '0.85rem', borderBottom: '1px solid var(--border)' }}>
                    {spec.key === 'price' ? `${item.price.toLocaleString('ru-RU')} ₽` :
                     spec.key === 'inStock' ? (item.inStock ? 'В наличии' : 'Под заказ') :
                     (item as any)[spec.key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
