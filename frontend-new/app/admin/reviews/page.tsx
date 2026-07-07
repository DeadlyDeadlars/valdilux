'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || '';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/reviews/all`, { headers: { 'x-admin-pass': PASS } })
      .then(r => r.json()).then(setReviews).finally(() => setLoading(false));
  }, []);

  const approve = async (id: number, approved: boolean) => {
    await fetch(`${API}/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-pass': PASS },
      body: JSON.stringify({ approved }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
  };

  const remove = async (id: number) => {
    await fetch(`${API}/reviews/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': PASS } });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Отзывы</h1>
      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : (
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
                <button onClick={() => approve(r.id, !r.approved)}
                  style={{ padding: '0.3rem 0.75rem', background: 'none', border: `1px solid ${r.approved ? 'rgba(106,128,96,0.4)' : 'rgba(201,169,110,0.3)'}`, color: r.approved ? '#6a8060' : '#c9a96e', fontSize: '0.65rem', cursor: 'pointer' }}>
                  {r.approved ? 'Скрыть' : 'Одобрить'}
                </button>
                <button onClick={() => remove(r.id)}
                  style={{ padding: '0.3rem 0.75rem', background: 'none', border: '1px solid rgba(192,96,96,0.3)', color: '#c06060', fontSize: '0.65rem', cursor: 'pointer' }}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
