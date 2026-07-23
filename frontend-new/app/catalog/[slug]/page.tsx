import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import Reviews from '@/components/Reviews';
import ProductInfo from '@/components/ProductInfo';

import productsData from '@/public/products.json';

export const dynamicParams = true;

export async function generateStaticParams() {
  return productsData.map((p: any) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
    "image": product.images?.[0] ? `${product.images[0]}` : undefined,
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

        <ProductInfo product={product} />

        <Reviews productId={product.id} />
      </div>
    </div>
  );
}
