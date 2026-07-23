'use client';
import { useState, useRef, useEffect } from 'react';

const WOODS = ['бук', 'ясень', 'дуб'] as const;
export type WoodType = (typeof WOODS)[number];

const WOOD_LABELS: Record<WoodType, string> = {
  бук: 'Бук',
  ясень: 'Ясень',
  дуб: 'Дуб',
};

const WOOD_IMAGES: Record<WoodType, string> = {
  бук: '/photos/woods/buk.jpg',
  ясень: '/photos/woods/jasen.jpg',
  дуб: '/photos/woods/dub.jpg',
};

export default function WoodTypeSelector({
  woodPrices,
  selectedWood,
  onSelect,
}: {
  woodPrices: Record<string, number>;
  selectedWood: WoodType;
  onSelect: (wood: WoodType) => void;
}) {
  const [openWood, setOpenWood] = useState<WoodType | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpenWood(null);
      }
    }
    if (openWood) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openWood]);

  const handleClick = (wood: WoodType) => {
    if (wood !== selectedWood) onSelect(wood);
    setOpenWood(openWood === wood ? null : wood);
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        Материал на выбор
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {WOODS.map(wood => {
          const isSelected = selectedWood === wood;
          const isOpen = openWood === wood;
          return (
            <div key={wood} style={{ position: 'relative' }}>
              <button
                onClick={() => handleClick(wood)}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#c9a96e' : 'rgba(255,255,255,0.1)'}`,
                  padding: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: `url(${WOOD_IMAGES[wood]}) center/cover`,
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  display: 'block',
                }}
                title={WOOD_LABELS[wood]}
              />
              <div style={{ textAlign: 'center', marginTop: 4, fontSize: '0.6rem', color: isSelected ? '#c9a96e' : 'var(--muted2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {WOOD_LABELS[wood]}
              </div>
              {isOpen && (
                <div
                  ref={popoverRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: 8,
                    background: '#1a1a1a',
                    border: '1px solid rgba(201,169,110,0.2)',
                    borderRadius: 4,
                    padding: '0.75rem 1rem',
                    zIndex: 100,
                    whiteSpace: 'nowrap',
                    minWidth: 140,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {WOOD_LABELS[wood]}
                  </div>
                  <div style={{ color: '#c9a96e', fontSize: '1.1rem', fontWeight: 300 }}>
                    {woodPrices[wood]?.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
