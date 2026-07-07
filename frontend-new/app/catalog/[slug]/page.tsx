import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import AddToCartButton from '@/components/AddToCartButton';
import Reviews from '@/components/Reviews';
import PriceCalculator from '@/components/PriceCalculator';
import ProductGallery from './ProductGallery';
import AskQuestion from './AskQuestion';
import ProductDescriptionOverflow from '@/components/ProductDescriptionOverflow';

import productsData from '@/public/products.json';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
const USE_STATIC = process.env.NEXT_PUBLIC_USE_STATIC !== 'false';

export const dynamicParams = false;

export async function generateStaticParams() {
  // Генерируем статические параметры из products.json
  return productsData.map((p: any) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log('[ProductPage] Loading product with slug:', slug);
  let product: Product;
  try {
    product = await api.get<Product>(`/products/${slug}`);
    console.log('[ProductPage] Product loaded:', product.name);
  } catch (error) {
    console.error('[ProductPage] Error loading product:', slug, error);
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.name,
    "image": product.images?.[0] ? (USE_STATIC ? `https://valdilux.vercel.app${product.images[0]}` : `${API_BASE}${product.images[0]}`) : undefined,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "RUB",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    }
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <Link href="/catalog" style={{ color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '3rem' }}>
          ← Назад в каталог
        </Link>

        <div className="product-layout">
          {/* Gallery with lightbox */}
          <div className="product-gallery-container">
            <ProductGallery images={product.images} video={(product as any).video} name={product.name} apiBase={USE_STATIC ? '' : API_BASE} />
          </div>

          {/* Info */}
          <div className="product-info-container">
            <div className="product-info-content">
              {product.label && (
                <div className="section-label mb-4">{product.label === 'hit' ? 'Хит продаж' : 'Новинка'}</div>
              )}
              <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1rem' }}>
                {product.name}
              </h1>
              {product.material && (
                <div style={{ color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{product.material}</div>
              )}
              <div style={{ color: '#c9a96e', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.5rem' }}>
                от {product.price.toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ color: product.inStock ? '#6a8060' : '#806060', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                {product.inStock ? 'В наличии' : 'Под заказ'}
              </div>
            </div>

            {product.description && (
              <ProductDescriptionOverflow>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.8 }}>{product.description}</p>
              </ProductDescriptionOverflow>
            )}

            <div className="product-info-content">
              {product.options && JSON.parse(product.options).length > 0 && (
                <PriceCalculator basePrice={product.price} options={JSON.parse(product.options)} />
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <AddToCartButton product={product} />
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
        </div>

        <Reviews productId={product.id} />
      </div>
    </div>
  );
}
