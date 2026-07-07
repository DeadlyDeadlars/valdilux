import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';

const nav = [
  { href: '/admin', label: 'Дашборд' },
  { href: '/admin/orders', label: 'Заказы' },
  { href: '/admin/products', label: 'Товары' },
  { href: '/admin/reviews', label: 'Отзывы' },
  { href: '/admin/posts', label: 'Посты' },
  { href: '/admin/coupons', label: 'Купоны' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg2)', paddingTop: 0 }}>
      <aside style={{ width: 200, background: '#111', borderRight: '1px solid rgba(201,169,110,0.1)', padding: '2rem 0', flexShrink: 0 }}>
        <div className="serif" style={{ color: '#c9a96e', fontSize: '1.1rem', fontWeight: 300, padding: '0 1.5rem', marginBottom: '2rem' }}>
          ValDiLux Admin
        </div>
        {nav.map(n => (
          <Link key={n.href} href={n.href}
            style={{ display: 'block', padding: '0.6rem 1.5rem', color: 'var(--muted)', fontSize: '0.75rem', textDecoration: 'none' }}
          >
            {n.label}
          </Link>
        ))}
        <form action="/api/admin/logout" method="POST" style={{ marginTop: '2rem', padding: '0 1.5rem' }}>
          <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--muted2)', fontSize: '0.7rem', cursor: 'pointer' }}>
            Выйти
          </button>
        </form>
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
