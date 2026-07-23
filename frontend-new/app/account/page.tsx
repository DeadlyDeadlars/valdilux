'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import Link from 'next/link';
import type { Product } from '@/lib/types';

type Order = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: { id: number; quantity: number; price: number; product: Product }[];
};

export default function AccountPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwOk, setPwOk] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/account/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    
    if (tab === 'orders') {
      api.get<Order[]>('/auth/orders', { headers }).then(setOrders).finally(() => setLoading(false));
    } else if (tab === 'wishlist') {
      api.get<Product[]>('/auth/wishlist', { headers }).then(setWishlist).finally(() => setLoading(false));
    } else if (tab === 'profile' && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile({ name: user.name, phone: user.phone || '' });
      setLoading(false);
    }
  }, [tab, token, user]);

  const saveProfile = async () => {
    if (!token) return;
    try {
      await api.put('/auth/me', profile, { headers: { Authorization: `Bearer ${token}` } });
      alert('Профиль обновлён');
    } catch {
      alert('Ошибка');
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(''); setPwOk(false);
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Пароли не совпадают'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('Минимум 6 символов'); return; }
    try {
      await api.put('/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      setPwOk(true);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      setPwError(err.message || 'Ошибка');
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!token) return;
    try {
      await api.delete(`/auth/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      setWishlist(w => w.filter(p => p.id !== productId));
    } catch {}
  };

  if (authLoading || !user) return null;

  const inputStyle = {
    width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.12)',
    color: 'var(--text2)', padding: '0.875rem 1rem', fontSize: '0.8rem', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 300 }}>Личный кабинет</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{user.email}</p>
          </div>
          <button onClick={logout} className="btn-gold" style={{ cursor: 'pointer', border: '1px solid rgba(201,169,110,0.4)', background: 'none' }}>
            Выйти
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
          {(['orders', 'wishlist', 'profile'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #c9a96e' : '2px solid transparent', color: tab === t ? '#c9a96e' : '#6a6058', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {t === 'orders' ? 'Заказы' : t === 'wishlist' ? 'Избранное' : 'Профиль'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted)', fontSize: '0.8rem' }}>Загрузка...</div>
        ) : tab === 'orders' ? (
          orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ color: 'var(--muted2)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>У вас пока нет заказов</p>
              <Link href="/catalog" className="btn-gold">Перейти в каталог</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map(order => (
                <div key={order.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Заказ #{order.id}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{order.total.toLocaleString('ru-RU')} ₽</div>
                      <div style={{ color: order.status === 'new' ? '#c9a96e' : '#6a8060', fontSize: '0.65rem', marginTop: '0.25rem', textTransform: 'uppercase' }}>
                        {order.status === 'new' ? 'Новый' : order.status}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.75rem' }}>
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === 'wishlist' ? (
          wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ color: 'var(--muted2)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Избранное пусто</p>
              <Link href="/catalog" className="btn-gold">Перейти в каталог</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {wishlist.map(p => (
                <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1rem', position: 'relative' }}>
                  <button onClick={() => removeFromWishlist(p.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(10,10,10,0.8)', border: 'none', color: '#c06060', width: 24, height: 24, cursor: 'pointer', fontSize: '1rem' }}>×</button>
                  <Link href={`/catalog/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="serif" style={{ color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 300, marginBottom: '0.5rem' }}>{p.name}</div>
                    <div style={{ color: '#c9a96e', fontSize: '0.8rem' }}>{p.price.toLocaleString('ru-RU')} ₽</div>
                  </Link>
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{ maxWidth: '28rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <input placeholder="Имя" value={profile.name} onChange={e => setProfile(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              <input placeholder="Телефон" value={profile.phone} onChange={e => setProfile(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
            </div>
            <button onClick={saveProfile} className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none' }}>Сохранить</button>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '2.5rem', paddingTop: '2rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Смена пароля</div>
              <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input required type="password" placeholder="Текущий пароль" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} style={inputStyle} />
                <input required type="password" placeholder="Новый пароль" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} style={inputStyle} />
                <input required type="password" placeholder="Повторите новый пароль" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} style={inputStyle} />
                {pwError && <p style={{ color: '#c06060', fontSize: '0.7rem' }}>{pwError}</p>}
                {pwOk && <p style={{ color: '#6a8060', fontSize: '0.7rem' }}>Пароль изменён</p>}
                <button type="submit" className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none' }}>Изменить пароль</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
