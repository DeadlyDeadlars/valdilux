import { requireAdmin } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getStats() {
  const [orders, products, reviews] = await Promise.all([
    fetch(`${API}/orders/all`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`${API}/products?limit=1`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ total: 0 })),
    fetch(`${API}/reviews/pending`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
  ]);
  return { orders, productsTotal: products.total ?? 0, reviews };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const { orders, productsTotal, reviews } = await getStats();
  const newOrders = Array.isArray(orders) ? orders.filter((o: any) => o.status === 'new') : [];
  const revenue = Array.isArray(orders) ? orders.reduce((s: number, o: any) => s + o.total, 0) : 0;

  const cards = [
    { label: 'Новых заказов', value: newOrders.length },
    { label: 'Всего заказов', value: Array.isArray(orders) ? orders.length : 0 },
    { label: 'Товаров', value: productsTotal },
    { label: 'Выручка', value: `${revenue.toLocaleString('ru-RU')} ₽` },
  ];

  return (
    <div>
      <h1 className="serif" style={{ color: '#f0ebe3', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Дашборд</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.1)', padding: '1.5rem' }}>
            <div style={{ color: '#4a4540', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.label}</div>
            <div style={{ color: '#c9a96e', fontSize: '1.8rem', fontWeight: 300 }}>{c.value}</div>
          </div>
        ))}
      </div>
      {newOrders.length > 0 && (
        <div>
          <div style={{ color: '#6a6058', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Новые заказы</div>
          {newOrders.slice(0, 5).map((o: any) => (
            <div key={o.id} style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#c8bfb0', fontSize: '0.8rem' }}>#{o.id} — {o.name} ({o.phone})</span>
              <span style={{ color: '#c9a96e', fontSize: '0.8rem' }}>{o.total.toLocaleString('ru-RU')} ₽</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
