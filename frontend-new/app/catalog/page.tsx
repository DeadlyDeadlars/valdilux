import { Suspense } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';
import CatalogClient from './CatalogClient';

export default async function CatalogPage() {
  let categories: Category[] = [];
  try { categories = await api.get<Category[]>('/categories'); } catch {}

  return (
    <div style={{ paddingTop: '5rem' }}>
      <Suspense fallback={<div style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--muted)' }}>Загрузка...</div>}>
        <CatalogClient categories={categories} />
      </Suspense>
    </div>
  );
}
