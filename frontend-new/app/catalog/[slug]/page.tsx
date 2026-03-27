import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import AddToCartButton from '@/components/AddToCartButton';
import Reviews from '@/components/Reviews';
import PriceCalculator from '@/components/PriceCalculator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: Product;
  try {
    product = await api.get<Product>(`/products/${slug}`);
  } catch {
    notFound();
  }

  const img = product.images?.[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.name,
    "image": img ? `${API_BASE}${img}` : undefined,
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
        <Link href="/catalog" style={{ color: '#6a6058', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '3rem' }}>
          ← Назад в каталог
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image */}
          <div style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', aspectRatio: '4/3', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {img ? (
              <img src={`${API_BASE}${img}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 80, height: 80, border: '1px solid rgba(201,169,110,0.15)', borderRadius: '50%' }} />
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {product.label && (
              <div className="section-label mb-4">{product.label === 'hit' ? 'Хит продаж' : 'Новинка'}</div>
            )}
            <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1rem' }}>
              {product.name}
            </h1>
            {product.material && (
              <div style={{ color: '#6a6058', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{product.material}</div>
            )}
            <div style={{ color: '#c9a96e', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.5rem' }}>
              от {product.price.toLocaleString('ru-RU')} ₽
            </div>
            <div style={{ color: product.inStock ? '#6a8060' : '#806060', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              {product.inStock ? 'В наличии' : 'Под заказ'}
            </div>
            {product.description && (
              <p style={{ color: '#6a6058', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>{product.description}</p>
            )}

            {product.options && JSON.parse(product.options).length > 0 && (
              <PriceCalculator basePrice={product.price} options={JSON.parse(product.options)} />
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <AddToCartButton product={product} />
              <Link href="/contacts" className="btn-gold">Индивидуальный заказ</Link>
            </div>

            <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: '1.5rem' }}>
              {['Гарантия 5 лет', 'Бесплатная доставка', 'Профессиональная сборка'].map(t => (
                <div key={t} style={{ color: '#4a4540', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        <Reviews productId={product.id} />
      </div>
    </div>
  );
}
