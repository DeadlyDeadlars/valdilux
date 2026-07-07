'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product } from './types';

interface CartCtx {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: number) => void;
  update: (productId: number, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (product: Product) =>
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });

  const remove = (productId: number) =>
    setItems(prev => prev.filter(i => i.product.id !== productId));

  const update = (productId: number, qty: number) =>
    setItems(prev => qty <= 0
      ? prev.filter(i => i.product.id !== productId)
      : prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
