'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import AddToCartButton from '@/components/AddToCartButton';
import PriceCalculator from '@/components/PriceCalculator';
import AskQuestion from '@/app/catalog/[slug]/AskQuestion';
import ProductDescriptionOverflow from '@/components/ProductDescriptionOverflow';
import ProductGallery from '@/app/catalog/[slug]/ProductGallery';
import WoodTypeSelector from '@/components/WoodTypeSelector';
import type { WoodType } from '@/components/WoodTypeSelector';

function parseOptions(options: any): any[] {
  if (!options) return [];
  if (Array.isArray(options)) return options;
  if (typeof options === 'string' && options.trim()) {
    try { return JSON.parse(options); } catch { return []; }
  }
  return [];
}

export default function ProductInfo({ product }: { product: Product }) {
  const defaultWood: WoodType = 'бук';
  const [selectedWood, setSelectedWood] = useState<WoodType>(defaultWood);

  const currentPrice = product.woodPrices?.[selectedWood] ?? product.price;
  const productForCart: Product = {
    ...product,
    price: currentPrice,
    name: selectedWood === 'бук' ? product.name : `${product.name} (${selectedWood})`,
  };

  return (
    <div className="product-layout">
      <div className="product-gallery-container">
        <ProductGallery images={product.images} video={(product as any).video} name={product.name} apiBase={''} />
      </div>

      <div className="product-info-container">
        <div className="product-info-content">
          {product.label && (
            <div className="section-label mb-4">{product.label === 'hit' ? 'Хит продаж' : 'Новинка'}</div>
          )}
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1rem' }}>
            {product.name}
          </h1>
          <div style={{ color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Массив {selectedWood === 'бук' ? 'бука' : selectedWood === 'ясень' ? 'ясеня' : 'дуба'}
          </div>
          <div style={{ color: '#c9a96e', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            {currentPrice.toLocaleString('ru-RU')} ₽
          </div>
          {product.woodPrices && Object.keys(product.woodPrices).length > 0 && (
            <WoodTypeSelector
              woodPrices={product.woodPrices}
              selectedWood={selectedWood}
              onSelect={setSelectedWood}
            />
          )}
          <div style={{ color: product.inStock ? '#6a8060' : '#806060', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {product.inStock ? 'В наличии' : 'Под заказ'}
          </div>
        </div>
      </div>

      {product.description && (
        <ProductDescriptionOverflow>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.8 }}>{product.description}</p>
        </ProductDescriptionOverflow>
      )}

      <div className="product-info-footer">
        {parseOptions(product.options).length > 0 && (
          <PriceCalculator basePrice={currentPrice} options={parseOptions(product.options)} />
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <AddToCartButton product={productForCart} />
          <Link href="/contacts" className="btn-gold">Быстрый заказ</Link>
        </div>

        <AskQuestion productName={product.name} />

        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          {['Гарантия 5 лет', 'Бесплатная доставка', 'Профессиональная сборка'].map(t => (
            <div key={t} style={{ color: 'var(--muted2)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
