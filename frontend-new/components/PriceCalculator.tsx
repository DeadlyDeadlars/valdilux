'use client';
import { useState } from 'react';

type Option = {
  name: string;
  values: { label: string; priceModifier: number }[];
};

export default function PriceCalculator({ basePrice, options }: { basePrice: number; options: Option[] }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (!options || options.length === 0) return null;

  const totalPrice = basePrice + options.reduce((sum, opt) => {
    const val = opt.values.find(v => v.label === selected[opt.name]);
    return sum + (val?.priceModifier || 0);
  }, 0);

  return (
    <div style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '1.5rem', marginBottom: '2rem' }}>
      <div className="section-label mb-4">Калькулятор стоимости</div>
      
      {options.map(opt => (
        <div key={opt.name} style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{opt.name}</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {opt.values.map(val => (
              <button key={val.label} onClick={() => setSelected(s => ({ ...s, [opt.name]: val.label }))}
                style={{ padding: '0.5rem 1rem', background: selected[opt.name] === val.label ? 'rgba(201,169,110,0.15)' : 'transparent', border: `1px solid ${selected[opt.name] === val.label ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.15)'}`, color: selected[opt.name] === val.label ? '#c9a96e' : '#6a6058', fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {val.label} {val.priceModifier !== 0 && `(${val.priceModifier > 0 ? '+' : ''}${val.priceModifier.toLocaleString('ru-RU')} ₽)`}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Итоговая стоимость</span>
          <span style={{ color: '#c9a96e', fontSize: '1.25rem', fontWeight: 300 }}>{totalPrice.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    </div>
  );
}
