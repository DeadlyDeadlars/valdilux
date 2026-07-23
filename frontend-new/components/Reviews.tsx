'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function Reviews({ productId }: { productId: number }) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Review[]>(`/reviews/products/${productId}`).then(setReviews).catch(() => {});
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reviews', { productId, name: user?.name || 'Гость', ...form }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      alert('Отзыв отправлен на модерацию');
      setForm({ rating: 5, comment: '' });
      setShowForm(false);
    } catch {
      alert('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#141414', border: '1px solid rgba(201,169,110,0.12)',
    color: 'var(--text2)', padding: '0.875rem 1rem', fontSize: '0.8rem', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{ marginTop: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <h2 className="serif" style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 300 }}>Отзывы</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-gold" style={{ cursor: 'pointer', border: '1px solid rgba(201,169,110,0.4)', background: 'none' }}>
            Оставить отзыв
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Оценка</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, rating: r }))}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: r <= form.rating ? '#c9a96e' : '#3a3530' }}
                >★</button>
              ))}
            </div>
          </div>
          <textarea required placeholder="Ваш отзыв *" rows={4} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" disabled={loading} className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-gold" style={{ cursor: 'pointer', border: '1px solid rgba(201,169,110,0.4)', background: 'none' }}>
              Отмена
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p style={{ color: '#4a4540', fontSize: '0.8rem', textAlign: 'center', padding: '3rem 0' }}>Пока нет отзывов</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.85rem', fontWeight: 400 }}>{r.name}</div>
                  <div style={{ color: '#c9a96e', fontSize: '1rem', marginTop: '0.25rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                <div style={{ color: '#4a4540', fontSize: '0.65rem' }}>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
