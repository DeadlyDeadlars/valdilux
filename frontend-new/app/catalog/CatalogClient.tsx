'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Category, ProductsResponse } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { getActiveFilterValues } from '@/lib/filters';

const SORTS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'new', label: 'Новинки' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
];

export default function CatalogClient({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const category = searchParams.get('category') || '';
  const material = searchParams.get('material') || '';
  const sort = searchParams.get('sort') || 'popular';
  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  // Получаем активные материалы из конфигурации
  const MATERIALS = getActiveFilterValues('material');

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    router.push(`/catalog?${params.toString()}`);
  };

  const reset = () => { setPriceMin(''); setPriceMax(''); router.push('/catalog'); };

  const load = useCallback(async () => {
    console.log('[CatalogClient] Loading products with params:', { category, material, sort, page, minPrice, maxPrice });
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (material) params.set('material', material);
      if (sort && sort !== 'popular') params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', String(page));
      params.set('limit', '12');
      console.log('[CatalogClient] Fetching:', `/products?${params}`);
      const data = await api.get<ProductsResponse>(`/products?${params}`);
      console.log('[CatalogClient] Got products:', data);
      setProducts(data);
    } catch (err) { 
      console.error('[CatalogClient] Error loading products:', err);
      setProducts(null); 
    }
    setLoading(false);
  }, [category, material, sort, page, minPrice, maxPrice]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ paddingTop: '5rem' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="section-label mb-4">Коллекция</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Каталог мебели</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>Каждое изделие создано из премиальных материалов</p>
        </div>
      </div>

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1.5rem" }} className="flex gap-10 flex-col md:flex-row">
        {/* Filters */}
        <aside style={{ minWidth: 200 }}>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.15)', padding: '0.75rem 1rem', color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
            <span>Фильтры</span>
            <span style={{ fontSize: '1rem' }}>{filtersOpen ? '−' : '+'}</span>
          </button>
          <div style={{ display: filtersOpen || !isMounted ? 'block' : 'none' }} className="md:block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Фильтры</span>
            <button onClick={reset} style={{ color: 'var(--muted2)', fontSize: '0.6rem', letterSpacing: '0.1em', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Сбросить</button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Категория</div>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setParam('category', category === cat.slug ? '' : cat.slug)}
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0.4rem 0', background: 'none', border: 'none', cursor: 'pointer', color: category === cat.slug ? '#c9a96e' : '#6a6058', fontSize: '0.7rem', textAlign: 'left', transition: 'color 0.3s' }}
              >
                <span>{cat.name}</span>
                <span style={{ color: '#3a3530' }}>{cat._count?.products}</span>
              </button>
            ))}
          </div>

          <div>
            <div style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Материал</div>
            {MATERIALS.map(m => (
              <button key={m} onClick={() => setParam('material', material === m ? '' : m)}
                style={{ display: 'block', width: '100%', padding: '0.4rem 0', background: 'none', border: 'none', cursor: 'pointer', color: material === m ? '#c9a96e' : '#6a6058', fontSize: '0.7rem', textAlign: 'left', transition: 'color 0.3s' }}
              >{m}</button>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Цена, ₽</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="number" placeholder="От" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                style={{ width: '50%', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.12)', color: 'var(--text2)', padding: '0.4rem 0.5rem', fontSize: '0.7rem', outline: 'none' }} />
              <input type="number" placeholder="До" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                style={{ width: '50%', background: 'var(--bg3)', border: '1px solid rgba(201,169,110,0.12)', color: 'var(--text2)', padding: '0.4rem 0.5rem', fontSize: '0.7rem', outline: 'none' }} />
            </div>
            <button onClick={() => { setParam('minPrice', priceMin); setParam('maxPrice', priceMax); }}
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem', background: 'none', border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
            >Применить</button>
          </div>
          </div>
        </aside>

        {/* Products */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
              Найдено <strong style={{ color: '#c9a96e' }}>{products?.total ?? 0}</strong> товаров
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SORTS.map(s => (
                <button key={s.value} onClick={() => setParam('sort', s.value)}
                  style={{ padding: '0.35rem 0.85rem', background: 'none', border: `1px solid ${sort === s.value ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.1)'}`, color: sort === s.value ? '#c9a96e' : '#6a6058', fontSize: '0.6rem', letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.3s' }}
                >{s.label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg3)', aspectRatio: '3/4', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : products?.data.length ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {products.data.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {/* Pagination */}
              {products.total > 12 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '3rem' }}>
                  {Array.from({ length: Math.ceil(products.total / 12) }).map((_, i) => (
                    <button key={i} onClick={() => setParam('page', String(i + 1))}
                      style={{ width: 36, height: 36, background: 'none', border: `1px solid ${page === i + 1 ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.1)'}`, color: page === i + 1 ? '#c9a96e' : '#6a6058', fontSize: '0.7rem', cursor: 'pointer' }}
                    >{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--muted2)', fontSize: '0.8rem' }}>Товары не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
}
