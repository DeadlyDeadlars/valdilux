import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';
import Reviews from '@/components/Reviews';
import ProductInfo from '@/components/ProductInfo';

import productsData from '@/public/products.json';

export const dynamicParams = true;

export async function generateStaticParams() {
  return productsData.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await api.get<Product>(`/products/${slug}`);
    return {
      title: `${product.name} — купить в интернет-магазине | ValDiLux`,
      description: `${product.name} из ${product.material || 'массива дерева'}. Цена: ${product.price.toLocaleString('ru-RU')} ₽. ${(product.description || '').slice(0, 120)}`,
      openGraph: {
        title: `${product.name} — ValDiLux`,
        description: `${product.name} из ${product.material || 'массива дерева'}. Цена: ${product.price.toLocaleString('ru-RU')} ₽`,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: 'Товар — ValDiLux' };
  }
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://valdilux-mebel.ru'}/` },
      { "@type": "ListItem", "position": 2, "name": "Каталог", "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://valdilux-mebel.ru'}/catalog` },
      { "@type": "ListItem", "position": 3, "name": product.name }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.name,
    "image": product.images?.[0] ? `${product.images[0]}` : undefined,
    "productID": product.slug,
    "brand": { "@type": "Brand", "name": "ValDiLux" },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "RUB",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://valdilux-mebel.ru'}/catalog/${product.slug}`,
    }
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
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
