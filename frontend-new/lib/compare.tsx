'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from './types';

type CompareContextType = {
  items: Product[];
  add: (product: Product) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try { const stored = localStorage.getItem('compare'); return stored ? JSON.parse(stored) : []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(items));
  }, [items]);

  const add = (product: Product) => {
    if (items.find(i => i.id === product.id)) return;
    if (items.length >= 4) {
      alert('Максимум 4 товара для сравнения');
      return;
    }
    setItems([...items, product]);
  };

  const remove = (id: number) => setItems(items.filter(i => i.id !== id));
  const clear = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, count: items.length }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
