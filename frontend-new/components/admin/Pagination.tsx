'use client';

export default function AdminPagination({ page, totalPages, setPage }: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const btn = (active: boolean, label: string, onClick: () => void) => (
    <button onClick={onClick}
      style={{
        background: active ? 'rgba(201,169,110,0.15)' : 'transparent',
        border: `1px solid ${active ? '#c9a96e' : 'rgba(201,169,110,0.2)'}`,
        color: active ? '#c9a96e' : 'var(--muted)',
        padding: '0.35rem 0.75rem',
        fontSize: '0.7rem',
        cursor: 'pointer',
        minWidth: '2rem',
      }}>{label}</button>
  );

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginTop: '1.5rem', alignItems: 'center' }}>
      {btn(false, '‹', () => setPage(Math.max(1, page - 1)))}
      {pages.map((p, i) =>
        typeof p === 'number'
          ? btn(p === page, String(p), () => setPage(p))
          : <span key={`dots-${i}`} style={{ color: 'var(--muted2)', fontSize: '0.7rem', padding: '0 0.25rem' }}>…</span>
      )}
      {btn(false, '›', () => setPage(Math.min(totalPages, page + 1)))}
    </div>
  );
}
