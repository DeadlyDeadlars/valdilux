import { Suspense } from 'react';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';
import CatalogClient from './CatalogClient';

export const metadata: Metadata = {
  title: 'Каталог мебели из массива дерева — ValDiLux',
  description: 'Письменные столы, шкафы, стеллажи, комоды из массива бука, дуба и ясеня. Премиальная мебель для кабинета. Доставка по Екатеринбургу и РФ.',
  openGraph: {
    title: 'Каталог премиальной мебели из массива — ValDiLux',
    description: 'Письменные столы, шкафы, стеллажи, комоды из массива бука, дуба и ясеня.',
  },
};

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
