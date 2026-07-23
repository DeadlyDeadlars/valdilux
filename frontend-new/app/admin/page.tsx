import { requireAdmin } from '@/lib/admin-auth';
import { cookies } from 'next/headers';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getStats(token: string) {
  const headers = { 'x-admin-pass': token };

  const [ordersRes, productsRes, reviewsRes] = await Promise.all([
    fetch(`${API}/orders/all?page=1&limit=5`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${API}/products?limit=1`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ total: 0 })),
    fetch(`${API}/reviews/pending`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
  ]);

  const orderData = ordersRes?.data ?? [];
  const totalOrders = ordersRes?.total ?? 0;
  const revenue = orderData.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pendingReviews = Array.isArray(reviewsRes) ? reviewsRes.length : 0;
  const newOrders = orderData.filter((o: any) => o.status === 'new');
  const productsTotal = productsRes?.total ?? 0;

  return { newOrders, totalOrders, productsTotal, revenue, pendingReviews };
}

const links = [
  { href: '/admin/products/new', label: '+ Добавить товар' },
  { href: '/admin/orders', label: 'Просмотреть заказы' },
  { href: '/admin/reviews', label: 'Ответить на отзывы' },
];

export default async function AdminDashboard() {
  await requireAdmin();

  const store = await cookies();
  const token = store.get('admin_token')?.value || '';
  const { newOrders, totalOrders, productsTotal, revenue, pendingReviews } = await getStats(token);

  const cards = [
    { label: 'Новых заказов', value: newOrders.length },
    { label: 'Всего заказов', value: totalOrders },
    { label: 'Товаров', value: productsTotal },
    { label: 'Выручка', value: `${revenue.toLocaleString('ru-RU')} ₽` },
    { label: 'Ожидает отзывов', value: pendingReviews, highlight: pendingReviews > 0 },
  ];

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Дашборд</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'var(--bg3)', border: `1px solid ${c.highlight ? 'rgba(192,96,96,0.3)' : 'rgba(201,169,110,0.1)'}`, padding: '1.5rem' }}>
            <div style={{ color: 'var(--muted2)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.label}</div>
            <div style={{ color: c.highlight ? '#c06060' : '#c9a96e', fontSize: '1.8rem', fontWeight: 300 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            style={{ background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.15)', padding: '0.75rem 1.25rem', color: '#c9a96e', fontSize: '0.7rem', textDecoration: 'none' }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div>
        <div style={{ color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Новые заказы</div>
        {newOrders.length === 0 ? (
          <div style={{ color: 'var(--muted2)', fontSize: '0.8rem' }}>Нет новых заказов</div>
        ) : (
          newOrders.slice(0, 5).map((o: any) => (
            <div key={o.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>#{o.id} — {o.name} ({o.phone})</span>
              <span style={{ color: '#c9a96e', fontSize: '0.8rem' }}>{o.total.toLocaleString('ru-RU')} ₽</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
