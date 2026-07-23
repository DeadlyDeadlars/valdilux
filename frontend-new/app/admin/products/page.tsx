'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminPagination from '@/components/admin/Pagination';

const PROXY = '/api/admin/proxy';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = () => {
    fetch(`${PROXY}/products?page=${page}&limit=${limit}`)
      .then(r => r.json()).then(d => { setProducts(d.data || []); setTotal(d.total || 0); }).finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const remove = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await fetch(`${PROXY}/products/${id}`, { method: 'DELETE' });
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
      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : products.length === 0 ? (
        <div style={{ color: 'var(--muted2)', fontSize: '0.8rem' }}>Нет товаров</div>
      ) : (
        <>
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
                      <button type="button" onClick={() => remove(p.id)} style={{ background: 'none', border: 'none', color: '#c06060', fontSize: '0.7rem', cursor: 'pointer' }}>Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminPagination page={page} totalPages={Math.ceil(total / limit)} setPage={setPage} />
        </>
      )}
    </div>
  );
}
