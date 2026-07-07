'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useState } from 'react';
import { api } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default function CartPage() {
  const { items, remove, update, total, count, clear } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', comment: '',
    delivery: 'courier', payment: 'cash', isLegal: false, company: '', inn: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const order = await api.post<{ id: number }>('/orders', {
        ...form,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });
      
      // Если есть способ оплаты онлайн
      if (confirm('Оплатить онлайн?')) {
        const payment = await api.post<{ confirmationUrl: string }>('/payment/create', { orderId: order.id });
        window.location.href = payment.confirmationUrl;
      } else {
        setStatus('ok');
        clear();
      }
    } catch {
      setStatus('error');
    }
  };

  const applyCoupon = async () => {
    setCouponError('');
    try {
      const res = await api.post<{ discount: number }>('/coupons/validate', { code: coupon, amount: total });
      setDiscount(res.discount);
    } catch (err: any) {
      setCouponError(err.message || 'Неверный купон');
      setDiscount(0);
    }
  };

  const [oneClick, setOneClick] = useState(false);
  const [oneClickPhone, setOneClickPhone] = useState('');
  const [oneClickStatus, setOneClickStatus] = useState<'idle' | 'loading' | 'ok'>('idle');

  const submitOneClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setOneClickStatus('loading');
    try {
      await api.post('/orders', {
        name: 'Быстрый заказ', phone: oneClickPhone,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });
      setOneClickStatus('ok');
      clear();
    } catch { setOneClickStatus('idle'); }
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.12)',
    color: 'var(--text2)', padding: '0.875rem 1rem', fontSize: '0.8rem', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  if (status === 'ok') return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="section-label mb-4">Заказ оформлен</div>
        <h1 className="serif" style={{ color: 'var(--text)', fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem' }}>Спасибо за заказ!</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Мы свяжемся с вами в ближайшее время</p>
        <Link href="/catalog" className="btn-gold">Продолжить покупки</Link>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300 }}>Корзина</h1>
          {count > 0 && <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{count} товаров</p>}
        </div>
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: 'var(--muted2)', fontSize: '0.85rem', marginBottom: '2rem' }}>Корзина пуста</p>
            <Link href="/catalog" className="btn-gold">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div style={{ gridColumn: 'span 2' }}>
              {items.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, background: 'var(--bg3)', flexShrink: 0, overflow: 'hidden' }}>
                    {product.images?.[0] && <img src={`${API_BASE}${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ color: 'var(--text2)', fontSize: '1rem', fontWeight: 300 }}>{product.name}</div>
                    {product.material && <div style={{ color: 'var(--muted2)', fontSize: '0.65rem', marginTop: '0.25rem' }}>{product.material}</div>}
                    <div style={{ color: '#c9a96e', fontSize: '0.85rem', marginTop: '0.5rem' }}>{product.price.toLocaleString('ru-RU')} ₽</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => update(product.id, quantity - 1)} style={{ width: 28, height: 28, background: 'none', border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                    <span style={{ color: 'var(--text2)', fontSize: '0.85rem', minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                    <button onClick={() => update(product.id, quantity + 1)} style={{ width: 28, height: 28, background: 'none', border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                  </div>
                  <button onClick={() => remove(product.id)} style={{ background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}>×</button>
                </div>
              ))}
            </div>

            <div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem', position: 'sticky', top: '5rem' }}>
                <div className="section-label mb-4">Итого</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Сумма</span>
                  <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Скидка</span>
                    <span style={{ color: '#6a8060', fontSize: '0.85rem' }}>−{discount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Итого</span>
                    <span style={{ color: '#c9a96e', fontSize: '1.1rem' }}>{(total - discount).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
                
                {!checkout ? (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <input placeholder="Промокод" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                      <button onClick={applyCoupon} style={{ width: '100%', padding: '0.5rem', background: 'none', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Применить
                      </button>
                      {couponError && <p style={{ color: '#c06060', fontSize: '0.65rem', marginTop: '0.5rem' }}>{couponError}</p>}
                    </div>
                    <button onClick={() => setCheckout(true)} className="btn-gold-solid" style={{ width: '100%', cursor: 'pointer', border: 'none' }}>
                      Оформить заказ
                    </button>
                    <button onClick={() => setOneClick(true)} style={{ width: '100%', padding: '0.75rem', background: 'none', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '0.25rem' }}>
                      Купить в 1 клик
                    </button>
                    {oneClick && oneClickStatus !== 'ok' && (
                      <form onSubmit={submitOneClick} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input required placeholder="Ваш телефон *" value={oneClickPhone} onChange={e => setOneClickPhone(e.target.value)} style={inputStyle} />
                        <button type="submit" disabled={oneClickStatus === 'loading'} className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none', opacity: oneClickStatus === 'loading' ? 0.6 : 1 }}>
                          {oneClickStatus === 'loading' ? 'Отправка...' : 'Перезвоните мне'}
                        </button>
                      </form>
                    )}
                    {oneClickStatus === 'ok' && <p style={{ color: '#6a8060', fontSize: '0.7rem', textAlign: 'center' }}>Мы перезвоним вам!</p>}
                  </>
                ) : (
                  <form onSubmit={submitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.7rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.isLegal} onChange={e => setForm(f => ({ ...f, isLegal: e.target.checked }))} />
                      Юридическое лицо
                    </label>
                    {form.isLegal && (
                      <>
                        <input placeholder="Название компании" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={inputStyle} />
                        <input placeholder="ИНН" value={form.inn} onChange={e => setForm(f => ({ ...f, inn: e.target.value }))} style={inputStyle} />
                      </>
                    )}
                    <input required placeholder="Имя *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                    <input required placeholder="Телефон *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
                    <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />

                    <div style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Доставка</div>
                    {[['courier', 'Транспортная компания'], ['pickup', 'Самовывоз']].map(([val, label]) => (
                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: form.delivery === val ? '#c9a96e' : '#6a6058', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input type="radio" name="delivery" value={val} checked={form.delivery === val} onChange={() => setForm(f => ({ ...f, delivery: val }))} />
                        {label}
                      </label>
                    ))}
                    {form.delivery === 'courier' && (
                      <input placeholder="Адрес доставки" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={inputStyle} />
                    )}

                    <div style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Оплата</div>
                    {[['cash', 'Наличными при получении'], ['online', 'Онлайн (ЮKassa)'], ['transfer', 'Банковский перевод']].map(([val, label]) => (
                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: form.payment === val ? '#c9a96e' : '#6a6058', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={() => setForm(f => ({ ...f, payment: val }))} />
                        {label}
                      </label>
                    ))}

                    <textarea placeholder="Комментарий" rows={3} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                    {status === 'error' && <p style={{ color: '#c06060', fontSize: '0.7rem' }}>Ошибка. Попробуйте ещё раз.</p>}
                    <button type="submit" disabled={status === 'loading'} className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none', opacity: status === 'loading' ? 0.6 : 1 }}>
                      {status === 'loading' ? 'Отправка...' : 'Подтвердить заказ'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
