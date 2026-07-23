'use client';
import { useEffect, useState } from 'react';
import AdminPagination from '@/components/admin/Pagination';

const PROXY = '/api/admin/proxy';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetch(`${PROXY}/reviews/all?page=${page}&limit=${limit}`)
      .then(r => r.json()).then(d => { setReviews(d.data || []); setTotal(d.total || 0); }).finally(() => setLoading(false));
  }, [page]);

  const approve = async (id: number, approved: boolean) => {
    await fetch(`${PROXY}/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    await fetch(`${PROXY}/reviews/${id}`, { method: 'DELETE' });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Отзывы</h1>
      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : reviews.length === 0 ? (
        <div style={{ color: 'var(--muted2)', fontSize: '0.8rem' }}>Нет отзывов</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: 'var(--bg3)', border: `1px solid ${r.approved ? 'rgba(106,128,96,0.2)' : 'var(--border)'}`, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{r.name}</span>
                    <span style={{ color: '#c9a96e', fontSize: '0.75rem' }}>{'★'.repeat(r.rating)}</span>
                    <span style={{ color: 'var(--muted2)', fontSize: '0.7rem' }}>{r.product?.name}</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: 0 }}>{r.comment}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button type="button" onClick={() => approve(r.id, !r.approved)}
                    style={{ padding: '0.3rem 0.75rem', background: 'none', border: `1px solid ${r.approved ? 'rgba(106,128,96,0.4)' : 'rgba(201,169,110,0.3)'}`, color: r.approved ? '#6a8060' : '#c9a96e', fontSize: '0.65rem', cursor: 'pointer' }}>
                    {r.approved ? 'Скрыть' : 'Одобрить'}
                  </button>
                  <button type="button" onClick={() => remove(r.id)}
                    style={{ padding: '0.3rem 0.75rem', background: 'none', border: '1px solid rgba(192,96,96,0.3)', color: '#c06060', fontSize: '0.65rem', cursor: 'pointer' }}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
          <AdminPagination page={page} totalPages={Math.ceil(total / limit)} setPage={setPage} />
        </>
      )}
    </div>
  );
}
