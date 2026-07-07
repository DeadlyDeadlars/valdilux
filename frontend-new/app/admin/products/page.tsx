'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || '';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/products?limit=100`, { headers: { 'x-admin-pass': PASS } })
      .then(r => r.json()).then(d => setProducts(d.data || [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': PASS } });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const td = { padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.78rem', borderBottom: '1px solid var(--border)' };
  const th = { padding: '0.5rem 1rem', color: 'var(--muted2)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, textAlign: 'left' as const };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300 }}>Товары</h1>
        <Link href="/admin/products/new" className="btn-gold-solid" style={{ textDecoration: 'none', fontSize: '0.7rem' }}>+ Добавить</Link>
      </div>
      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              {['#', 'Название', 'Категория', 'Цена', 'Статус', ''].map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ ...td, color: 'var(--muted2)' }}>{p.id}</td>
                <td style={td}>{p.name}</td>
                <td style={{ ...td, color: 'var(--muted)' }}>{p.category?.name}</td>
                <td style={{ ...td, color: '#c9a96e' }}>{p.price.toLocaleString('ru-RU')} ₽</td>
                <td style={{ ...td, color: p.inStock ? '#6a8060' : '#806060' }}>{p.inStock ? 'В наличии' : 'Под заказ'}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/products/${p.id}`} style={{ color: '#c9a96e', fontSize: '0.7rem', textDecoration: 'none' }}>Ред.</Link>
                    <button onClick={() => remove(p.id)} style={{ background: 'none', border: 'none', color: '#c06060', fontSize: '0.7rem', cursor: 'pointer' }}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
