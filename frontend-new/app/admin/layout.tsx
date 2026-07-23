import Link from 'next/link';
import { cookies } from 'next/headers';
import { requireAdmin } from '@/lib/admin-auth';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const nav = [
  { href: '/admin', label: 'Дашборд' },
  { href: '/admin/orders', label: 'Заказы' },
  { href: '/admin/products', label: 'Товары' },
  { href: '/admin/categories', label: 'Категории' },
  { href: '/admin/reviews', label: 'Отзывы' },
  { href: '/admin/posts', label: 'Посты' },
  { href: '/admin/coupons', label: 'Купоны' },
  { href: '/admin/messages', label: 'Заявки' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const store = await cookies();
  const token = store.get('admin_token')?.value;
  const pending = await fetch(`${API}/reviews/pending`, { headers: { 'x-admin-pass': token || '' } })
    .then(r => r.ok ? r.json() : [])
    .then(d => Array.isArray(d) ? d.length : 0)
    .catch(() => 0);

  const navLabel = (label: string, count?: number) => (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span style={{ background: '#c06060', color: '#fff', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '8px' }}>
          {count}
        </span>
      )}
    </span>
  );

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
            {n.href === '/admin/reviews' ? navLabel(n.label, pending) : n.label}
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
