'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCompare } from '@/lib/compare';
import { getMainProductPhoto } from '@/lib/product-photos';
import QuickView from './QuickView';
import ResponsiveImage from './ResponsiveImage';

export default function ProductCard({ product }: { product: Product }) {
  const [showQuick, setShowQuick] = useState(false);
  const { add } = useCompare();
  
  // Получаем фотографию для товара
  const productImage = getMainProductPhoto(product.name, product.images || []);

  return (
    <>
      <div className="product-card" style={{ position: 'relative' }}>
        <Link href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', aspectRatio: '4/3', background: '#1a1a1a', overflow: 'hidden' }}>
            <ResponsiveImage
              src={productImage}
              alt={product.name}
              priority={product.label === 'hit'}
            />
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
            <h3 className="serif" style={{ color: 'var(--text2)', fontSize: '1rem', fontWeight: 300, marginBottom: '0.75rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
            <div style={{ color: '#c9a96e', fontSize: '0.85rem', fontWeight: 300 }}>
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </Link>
        <button type="button" onClick={() => setShowQuick(true)} className="hidden md:flex gold-icon-btn"
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', padding: 0 }}
          title="Быстрый просмотр"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button type="button" onClick={(e) => { e.preventDefault(); add(product); }} className="hidden md:flex gold-icon-btn"
          style={{ position: 'absolute', top: 12, right: 52, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', padding: 0 }}
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
