import productsData from '@/public/products.json';
import categoriesData from '@/public/categories.json';
import postsData from '@/public/posts.json';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const USE_STATIC = process.env.NEXT_PUBLIC_USE_STATIC === 'true';

console.log('[API] Using API URL:', API, 'Static mode:', USE_STATIC);

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // Если статичный режим, используем импортированные данные
  if (USE_STATIC) {
    if (path.startsWith('/products/') && !path.includes('?')) {
      const slug = path.split('/products/')[1];
      console.log('[API] Using static product:', slug);
      const product = productsData.find((p: any) => p.slug === slug);
      if (!product) throw new Error('Product not found');
      return product as T;
    }
    if (path.startsWith('/products')) {
      console.log('[API] Using static products with filters');
      const url = new URL(path, 'http://localhost');
      const category = url.searchParams.get('category');
      const material = url.searchParams.get('material');
      const minPrice = url.searchParams.get('minPrice');
      const maxPrice = url.searchParams.get('maxPrice');
      const sort = url.searchParams.get('sort');
      const page = Number(url.searchParams.get('page') || 1);
      const limit = Number(url.searchParams.get('limit') || 12);

      let filtered = [...productsData];

      if (category) {
        filtered = filtered.filter((p: any) => p.category?.slug === category);
      }
      const label = url.searchParams.get('label');
      if (label) {
        filtered = filtered.filter((p: any) => p.label === label);
      }
      if (material) {
        filtered = filtered.filter((p: any) => p.material === material);
      }
      if (minPrice) {
        filtered = filtered.filter((p: any) => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter((p: any) => p.price <= Number(maxPrice));
      }

      // Сортировка
      if (sort === 'price_asc') {
        filtered.sort((a: any, b: any) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filtered.sort((a: any, b: any) => b.price - a.price);
      } else if (sort === 'new') {
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = filtered.length;
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return { data, total, page, limit } as T;
    }
    if (path.startsWith('/categories')) {
      console.log('[API] Using static categories');
      return categoriesData as T;
    }
    if (path.startsWith('/posts/') && !path.includes('?')) {
      const slug = path.split('/posts/')[1];
      console.log('[API] Using static post:', slug);
      const post = (postsData as any[]).find((p: any) => p.slug === slug);
      if (!post) throw new Error('Post not found');
      return post as T;
    }
    if (path.startsWith('/posts')) {
      console.log('[API] Using static posts');
      return postsData as T;
    }
  }
  
  console.log('[API] Fetching:', `${API}${path}`);
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => apiFetch<T>(path, options),
  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: <T>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: 'DELETE', ...options }),
};
