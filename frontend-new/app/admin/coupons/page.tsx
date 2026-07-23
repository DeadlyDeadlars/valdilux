'use client';
import { useEffect, useState } from 'react';
import AdminPagination from '@/components/admin/Pagination';

const PROXY = '/api/admin/proxy';

const empty = { code: '', discount: '', type: 'percent', minAmount: '', active: true, expiresAt: '' };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = () => {
    fetch(`${PROXY}/coupons/all?page=${page}&limit=${limit}`)
      .then(r => r.ok ? r.json() : { data: [], total: 0 }).then(d => { setCoupons(d.data || []); setTotal(d.total || 0); }).finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${PROXY}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, discount: Number(form.discount), minAmount: Number(form.minAmount), expiresAt: form.expiresAt || null }),
    });
    setForm(empty); load();
  };

  const toggle = async (id: number, active: boolean) => {
    await fetch(`${PROXY}/coupons/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) });
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active } : c));
  };

  const inp = { background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.12)', color: 'var(--text2)', padding: '0.6rem 0.75rem', fontSize: '0.78rem', outline: 'none', width: '100%' };

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Купоны</h1>
      <form onSubmit={save} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <input required placeholder="Код (SALE10)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={inp} />
        <input required type="number" placeholder="Скидка" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} style={inp} />
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
          <option value="percent">Процент %</option>
          <option value="fixed">Фиксированная ₽</option>
        </select>
        <input type="number" placeholder="Мин. сумма заказа" value={form.minAmount} onChange={e => setForm(f => ({ ...f, minAmount: e.target.value }))} style={inp} />
        <input type="datetime-local" placeholder="Истекает" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} style={inp} />
        <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}>Создать</button>
      </form>

      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : coupons.length === 0 ? (
        <div style={{ color: 'var(--muted2)', fontSize: '0.8rem' }}>Нет купонов</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {coupons.map(c => (
              <div key={c.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <span style={{ color: '#c9a96e', fontSize: '0.85rem', fontFamily: 'monospace' }}>{c.code}</span>
                  <span style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>{c.discount}{c.type === 'percent' ? '%' : ' ₽'}</span>
                  {c.minAmount > 0 && <span style={{ color: 'var(--muted2)', fontSize: '0.7rem' }}>от {c.minAmount.toLocaleString('ru-RU')} ₽</span>}
                  {c.expiresAt && <span style={{ color: 'var(--muted2)', fontSize: '0.7rem' }}>до {new Date(c.expiresAt).toLocaleDateString('ru-RU')}</span>}
                </div>
                <button onClick={() => toggle(c.id, !c.active)}
                  style={{ padding: '0.3rem 0.75rem', background: 'none', border: `1px solid ${c.active ? 'rgba(106,128,96,0.4)' : 'rgba(201,169,110,0.2)'}`, color: c.active ? '#6a8060' : '#6a6058', fontSize: '0.65rem', cursor: 'pointer' }}>
                  {c.active ? 'Активен' : 'Отключён'}
                </button>
              </div>
            ))}
          </div>
          <AdminPagination page={page} totalPages={Math.ceil(total / limit)} setPage={setPage} />
        </>
      )}
    </div>
  );
}
