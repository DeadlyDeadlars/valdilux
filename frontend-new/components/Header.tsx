'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const CATEGORIES = [
  { label: 'Письменный стол', slug: 'pismennye-stoly' },
  { label: 'Книжный шкаф', slug: 'shkafy' },
  { label: 'Стеллажи', slug: 'stellazhi' },
  { label: 'Комоды', slug: 'komody' },
  { label: 'Журнальные столики', slug: 'zhurnalnye-stoliki' },
  { label: 'Тумбы', slug: 'tumby' },
  { label: 'Брифинги', slug: 'brifing' },
  { label: 'Консоли', slug: 'konsoli' },
  { label: 'Сервант', slug: 'servant' },
  { label: 'ТВ тумба', slug: 'tv-tumba' },
];

export default function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; slug: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [callForm, setCallForm] = useState({ name: '', phone: '', time: '' });
  const [callSent, setCallSent] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) setCatalogOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { setShowSuggestions(false); router.push(`/catalog?search=${encodeURIComponent(search.trim())}`); }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    if (val.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    suggestTimer.current = setTimeout(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${apiUrl}/products?search=${encodeURIComponent(val.trim())}&limit=6`);
        const json = await res.json();
        setSuggestions((json.data || []).map((p: { name: string; slug: string }) => ({ name: p.name, slug: p.slug })));
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
    }, 300);
  };

  const handleCall = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      await fetch(`${apiUrl}/contact/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callForm),
      });
    } catch { /* silent */ }
    setCallSent(true);
    setTimeout(() => { setCallOpen(false); setCallSent(false); setCallForm({ name: '', phone: '', time: '' }); }, 2000);
  };

  const navLink: React.CSSProperties = { color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer', background: 'none', border: 'none', padding: 0 };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'var(--bg2)' : 'var(--bg2)',
          borderBottom: '1px solid var(--gold-dim)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: '4.5rem' }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0 }}>
            <Image src="/logo.webp" alt="ValDiLux" width={240} height={82} style={{ objectFit: 'contain', height: 68, width: 'auto' }} priority />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360 }} className="hidden md:block">
            <div ref={searchRef} style={{ position: 'relative' }}>
              <input
                value={search}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Поиск по каталогу..."
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: '0.75rem', padding: '0.5rem 2.5rem 0.5rem 1rem', letterSpacing: '0.05em', outline: 'none' }}
              />
              <button type="submit" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a09080', padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="6" cy="6" r="4" /><line x1="9.5" y1="9.5" x2="13" y2="13" />
                </svg>
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg2)', border: '1px solid var(--gold-dim)', zIndex: 200, marginTop: 2 }}>
                  {suggestions.map(s => (
                    <button key={s.slug} type="button"
                      onClick={() => { setSearch(s.name); setShowSuggestions(false); router.push(`/catalog/${s.slug}`); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', color: '#a09080', fontSize: '0.72rem', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--gold-dim)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
                    >{s.name}</button>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Catalog dropdown */}
          <div ref={catalogRef} style={{ position: 'relative', flexShrink: 0 }} className="hidden md:block">
            <button
              style={{ ...navLink, display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => setCatalogOpen(v => !v)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="1" y="1" width="5" height="5" /><rect x="8" y="1" width="5" height="5" />
                <rect x="1" y="8" width="5" height="5" /><rect x="8" y="8" width="5" height="5" />
              </svg>
              Каталог
            </button>
            {catalogOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: 'var(--bg2)', border: '1px solid var(--gold-dim)', minWidth: 240, zIndex: 100 }}>
                {CATEGORIES.map(cat => (
                  <Link key={cat.slug} href={`/catalog?category=${cat.slug}`}
                    onClick={() => setCatalogOpen(false)}
                    style={{ display: 'block', padding: '0.75rem 1.25rem', color: '#a09080', fontSize: '0.7rem', letterSpacing: '0.1em', textDecoration: 'none', borderBottom: '1px solid var(--gold-dim)', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
                  >{cat.label}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center" style={{ gap: '1.25rem', flexShrink: 0, marginLeft: 'auto' }}>

            {/* Cart */}
            <Link href="/cart"
              style={{ ...navLink, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M1 1h2l2.4 7.4a1 1 0 0 0 .96.6h5.28a1 1 0 0 0 .96-.72L14 5H4" />
                <circle cx="6" cy="13.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="11" cy="13.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              {count > 0 && <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>{count}</span>}
            </Link>

            {/* Payment link */}
            <Link href="/payment" style={navLink}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >Оплата</Link>

            {/* Delivery link */}
            <Link href="/delivery" style={navLink}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >Доставка</Link>

            {/* Phone + callback - обновленная структура */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <a href="tel:+79058052465" style={{ color: 'var(--gold)', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.03em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                +7 905 805 24 65
              </a>
              <button
                onClick={() => setCallOpen(v => !v)}
                style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-dim)', color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.4rem 0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold-dim)'; }}
              >Заказать звонок</button>
            </div>

            {/* Messengers - убрал VK, оставил только Telegram и Max */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ThemeToggle />
              <a href="https://t.me/Valdilux_mebel" target="_blank" rel="noopener noreferrer" title="Написать в Telegram" style={{ color: '#a09080', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.892z" />
                </svg>
              </a>
              <a href="https://max.ru/u/f9LHodD0cOKBmU6imfN_JGcs3nE4xAXE4j3ow9K7QaKrK-zb4W1Yj_N19G4" target="_blank" rel="noopener noreferrer" title="Написать в Max">
                <Image src="/max_icon.jpg" alt="Max" width={18} height={18} style={{ borderRadius: '50%', opacity: 0.7, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.opacity = '1')}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.opacity = '0.7')}
                />
              </a>
            </div>
          </div>

          {/* Mobile: Phone & Messengers */}
          <div className="md:hidden flex flex-col gap-2 ml-auto">
            <a href="tel:+79058052465" style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>+7 905 805 24 65</a>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <a href="https://t.me/Valdilux_mebel" target="_blank" rel="noopener noreferrer" style={{ color: '#a09080' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.892z" />
                </svg>
              </a>
              <a href="https://max.ru/u/f9LHodD0cOKBmU6imfN_JGcs3nE4xAXE4j3ow9K7QaKrK-zb4W1Yj_N19G4" target="_blank" rel="noopener noreferrer">
                <Image src="/max_icon.jpg" alt="Max" width={20} height={20} style={{ borderRadius: '50%', opacity: 0.7 }} />
              </a>
            </div>
          </div>

          {/* Burger + Theme Toggle */}
          <div className="md:hidden flex items-center gap-3 ml-4">
            <ThemeToggle />
            <button className="flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 24, height: 2, background: '#a09080' }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--gold-dim)', padding: '1.5rem' }}>
            <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по каталогу..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--gold-dim)', color: 'var(--text)', fontSize: '0.75rem', padding: '0.5rem 1rem', outline: 'none' }}
              />
            </form>
            {[['Каталог', '/catalog'], ['О компании', '/about'], ['Оплата', '/payment'], ['Доставка', '/delivery'], ['FAQ', '/faq'], ['Контакты', '/contacts'], ['Корзина', '/cart']].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', color: '#a09080', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', padding: '0.75rem 0', borderBottom: '1px solid var(--gold-dim)' }}
              >{label}</Link>
            ))}
          </div>
        )}
      </header>

      {/* Callback modal */}
      {callOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setCallOpen(false); }}
        >
          <div style={{ background: 'var(--bg)', border: '1px solid var(--gold-dim)', padding: '2.5rem', width: '100%', maxWidth: 400 }}>
            <h2 style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Обратный звонок</h2>
            {callSent ? (
              <p style={{ color: 'var(--gold)', textAlign: 'center', padding: '1rem 0' }}>Заявка отправлена. Мы перезвоним!</p>
            ) : (
              <form onSubmit={handleCall} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'name', placeholder: 'Ваше имя', type: 'text' },
                  { key: 'phone', placeholder: 'Телефон', type: 'tel' },
                  { key: 'time', placeholder: 'Удобное время звонка', type: 'text' },
                ].map(({ key, placeholder, type }) => (
                  <input key={key} type={type} placeholder={placeholder} required={key !== 'time'}
                    value={(callForm as any)[key]}
                    onChange={e => setCallForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--gold-dim)', color: 'var(--text)', fontSize: '0.8rem', padding: '0.75rem 1rem', outline: 'none', width: '100%' }}
                  />
                ))}
                <button type="submit" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-dim)', color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.85rem', cursor: 'pointer', marginTop: '0.5rem', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-dim)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold-dim)')}
                >Отправить заявку</button>
              </form>
            )}
            <button onClick={() => setCallOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#5a5248', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
        </div>
      )}
    </>
  );
}
