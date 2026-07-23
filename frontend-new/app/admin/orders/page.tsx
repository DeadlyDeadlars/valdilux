'use client';
import { useEffect, useState } from 'react';
import AdminPagination from '@/components/admin/Pagination';

const PROXY = '/api/admin/proxy';

const STATUSES = ['new', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
  new: 'Новый', processing: 'В обработке', paid: 'Оплачен',
  shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetch(`${PROXY}/orders/all?page=${page}&limit=${limit}`)
      .then(r => r.json()).then(d => { setOrders(d.data || []); setTotal(d.total || 0); }).finally(() => setLoading(false));
  }, [page]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${PROXY}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const td = { padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.78rem', borderBottom: '1px solid var(--border)' };
  const th = { padding: '0.5rem 1rem', color: 'var(--muted2)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, textAlign: 'left' as const };

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Заказы</h1>
      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : orders.length === 0 ? (
        <div style={{ color: 'var(--muted2)', fontSize: '0.8rem' }}>Нет заказов</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                  {['#', 'Клиент', 'Телефон', 'Сумма', 'Дата', 'Статус'].map(h => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={td}>#{o.id}</td>
                    <td style={td}>{o.name}</td>
                    <td style={td}>{o.phone}</td>
                    <td style={{ ...td, color: '#c9a96e' }}>{o.total.toLocaleString('ru-RU')} ₽</td>
                    <td style={{ ...td, color: 'var(--muted)' }}>{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td style={td}>
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        style={{ background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.15)', color: '#c9a96e', padding: '0.3rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} totalPages={Math.ceil(total / limit)} setPage={setPage} />
        </>
      )}
    </div>
  );
}
