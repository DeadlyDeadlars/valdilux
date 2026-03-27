'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import AddToCartButton from './AddToCartButton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const img = product.images?.[0];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0f0f0f', border: '1px solid rgba(201,169,110,0.15)', maxWidth: '56rem', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(10,10,10,0.9)', border: 'none', color: '#c9a96e', width: 40, height: 40, cursor: 'pointer', fontSize: '1.5rem', zIndex: 1 }}>×</button>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div style={{ background: '#141414', aspectRatio: '4/3', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {img ? (
              <img src={`${API_BASE}${img}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 60, height: 60, border: '1px solid rgba(201,169,110,0.15)', borderRadius: '50%' }} />
            )}
          </div>

          <div style={{ padding: '2rem' }}>
            {product.label && (
              <div className="section-label mb-3">{product.label === 'hit' ? 'Хит продаж' : 'Новинка'}</div>
            )}
            <h2 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {product.name}
            </h2>
            {product.material && (
              <div style={{ color: '#6a6058', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>{product.material}</div>
            )}
            <div style={{ color: '#c9a96e', fontSize: '1.25rem', fontWeight: 300, marginBottom: '0.5rem' }}>
              от {product.price.toLocaleString('ru-RU')} ₽
            </div>
            <div style={{ color: product.inStock ? '#6a8060' : '#806060', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {product.inStock ? 'В наличии' : 'Под заказ'}
            </div>
            {product.description && (
              <p style={{ color: '#6a6058', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '2rem' }}>{product.description}</p>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <AddToCartButton product={product} />
              <Link href={`/catalog/${product.slug}`} className="btn-gold" onClick={onClose}>Подробнее</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
