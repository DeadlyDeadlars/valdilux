'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { useCompare } from '@/lib/compare';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';

export default function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const { count: compareCount } = useCompare();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201,169,110,0.08)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        <Link href="/" className="serif" style={{ color: '#c9a96e', fontSize: '1.25rem', fontWeight: 300, letterSpacing: '0.1em', textDecoration: 'none' }}>
          ValDiLux
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[['Каталог', '/catalog'], ['О фабрике', '/about'], ['FAQ', '/faq'], ['Контакты', '/contacts']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >{label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/account" style={{ color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >
              {user.name}
            </Link>
          ) : (
            <Link href="/account/login" style={{ color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
            >
              Войти
            </Link>
          )}
          <Link href="/compare" style={{ color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
          >
            Сравнить {compareCount > 0 && <span style={{ color: '#c9a96e' }}>{compareCount}</span>}
          </Link>
          <Link href="/cart" style={{ color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a09080')}
          >
            Корзина {count > 0 && <span style={{ color: '#c9a96e' }}>{count}</span>}
          </Link>
          <ThemeToggle />

          {/* Burger */}
          <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: 22, height: 1, background: '#a09080', transition: 'all 0.3s' }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(201,169,110,0.08)', padding: '1.5rem 1.5rem' }}>
          {[['Каталог', '/catalog'], ['О фабрике', '/about'], ['FAQ', '/faq'], ['Контакты', '/contacts']].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: '#a09080', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', padding: '0.75rem 0', borderBottom: '1px solid rgba(201,169,110,0.06)' }}
            >{label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
