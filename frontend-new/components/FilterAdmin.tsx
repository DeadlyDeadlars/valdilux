'use client';
import { useState } from 'react';
import { initialFilters, type FilterConfig } from '@/lib/filters';

export default function FilterAdmin() {
  const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);

  const toggleActive = (id: string) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const moveUp = (id: string) => {
    const idx = filters.findIndex(f => f.id === id);
    if (idx <= 0) return;
    const newFilters = [...filters];
    [newFilters[idx - 1], newFilters[idx]] = [newFilters[idx], newFilters[idx - 1]];
    setFilters(newFilters.map((f, i) => ({ ...f, order: i + 1 })));
  };

  const moveDown = (id: string) => {
    const idx = filters.findIndex(f => f.id === id);
    if (idx < 0 || idx >= filters.length - 1) return;
    const newFilters = [...filters];
    [newFilters[idx], newFilters[idx + 1]] = [newFilters[idx + 1], newFilters[idx]];
    setFilters(newFilters.map((f, i) => ({ ...f, order: i + 1 })));
  };

  const groupedFilters = filters.reduce((acc, filter) => {
    if (!acc[filter.type]) acc[filter.type] = [];
    acc[filter.type].push(filter);
    return acc;
  }, {} as Record<string, FilterConfig[]>);

  const typeLabels: Record<string, string> = {
    material: 'Материалы',
    sort: 'Сортировка',
    category: 'Категории',
    price: 'Цена',
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      {Object.entries(groupedFilters).map(([type, items]) => (
        <div key={type} style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {typeLabels[type] || type}
          </h2>
          <div style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.1)' }}>
            {items.map((filter, idx) => (
              <div
                key={filter.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderBottom: idx < items.length - 1 ? '1px solid rgba(201,169,110,0.06)' : 'none',
                }}
              >
                <button
                  onClick={() => toggleActive(filter.id)}
                  style={{
                    width: 20,
                    height: 20,
                    border: `1px solid ${filter.active ? '#c9a96e' : 'rgba(201,169,110,0.3)'}`,
                    background: filter.active ? 'rgba(201,169,110,0.2)' : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {filter.active && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#c9a96e" strokeWidth="2">
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  )}
                </button>
                <span style={{ flex: 1, color: filter.active ? '#f0ebe3' : '#5a5248', fontSize: '0.8rem' }}>
                  {filter.label}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => moveUp(filter.id)}
                    disabled={idx === 0}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(201,169,110,0.2)',
                      color: idx === 0 ? '#3a3530' : '#c9a96e',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                    }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(filter.id)}
                    disabled={idx === items.length - 1}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(201,169,110,0.2)',
                      color: idx === items.length - 1 ? '#3a3530' : '#c9a96e',
                      cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                    }}
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#c9a96e' }}>Примечание:</strong> Изменения применяются локально. 
          Для сохранения в базе данных требуется интеграция с API.
        </p>
      </div>
    </div>
  );
}
