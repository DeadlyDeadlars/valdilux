import { Suspense } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';
import CatalogClient from './CatalogClient';

export default async function CatalogPage() {
  let categories: Category[] = [];
  try { categories = await api.get<Category[]>('/categories'); } catch {}

  return (
    <Suspense fallback={<div style={{ paddingTop: '8rem', textAlign: 'center', color: '#6a6058' }}>Загрузка...</div>}>
      <CatalogClient categories={categories} />
    </Suspense>
  );
}
