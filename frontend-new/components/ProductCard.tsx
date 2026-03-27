'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCompare } from '@/lib/compare';
import QuickView from './QuickView';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default function ProductCard({ product }: { product: Product }) {
  const [showQuick, setShowQuick] = useState(false);
  const { add } = useCompare();
  const img = product.images?.[0];

  return (
    <>
      <div className="product-card" style={{ position: 'relative' }}>
        <Link href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', aspectRatio: '4/3', background: '#1a1a1a', overflow: 'hidden' }}>
            {img ? (
              <img src={`${API_BASE}${img}`} alt={product.name} className="product-card-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 40, height: 40, border: '1px solid rgba(201,169,110,0.15)', borderRadius: '50%' }} />
              </div>
            )}
            {product.label && (
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(10,10,10,0.85)', padding: '3px 10px' }}>
                <span style={{ color: '#c9a96e', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {product.label === 'hit' ? 'Хит продаж' : 'Новинка'}
                </span>
              </div>
            )}
          </div>
          <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
            {product.material && (
              <div style={{ color: '#4a4540', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{product.material}</div>
            )}
            <h3 className="serif" style={{ color: '#c8bfb0', fontSize: '1rem', fontWeight: 300, marginBottom: '0.75rem', lineHeight: 1.3 }}>{product.name}</h3>
            <div style={{ color: '#c9a96e', fontSize: '0.85rem', fontWeight: 300 }}>
              от {product.price.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </Link>
        <button onClick={() => setShowQuick(true)}
          style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', width: 32, height: 32, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.15)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.9)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; }}
          title="Быстрый просмотр"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button onClick={(e) => { e.preventDefault(); add(product); }}
          style={{ position: 'absolute', top: 12, right: 52, background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', width: 32, height: 32, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.15)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.9)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; }}
          title="Сравнить"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
        </button>
      </div>
      {showQuick && <QuickView product={product} onClose={() => setShowQuick(false)} />}
    </>
  );
}
