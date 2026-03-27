'use client';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/types';
import { useState } from 'react';

export default function AddToCartButton({ product, iconOnly }: { product: Product; iconOnly?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e?: React.MouseEvent) => {
    e?.preventDefault();
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (iconOnly) {
    return (
      <button onClick={handleAdd} className="add-to-cart-btn" aria-label="Добавить в корзину">
        {added ? '✓' : '+'}
      </button>
    );
  }

  return (
    <button onClick={() => handleAdd()} className="btn-gold-solid" style={{ cursor: 'pointer', border: 'none' }}>
      {added ? 'Добавлено ✓' : 'Добавить в корзину'}
    </button>
  );
}
