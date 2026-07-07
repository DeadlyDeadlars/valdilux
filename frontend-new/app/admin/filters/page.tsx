import FilterAdmin from '@/components/FilterAdmin';

export default function FiltersAdminPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.1 }}>
            Управление фильтрами
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Настройка активных фильтров и их порядка в каталоге
          </p>
        </div>
      </div>

      <div style={{ padding: '2rem 1.5rem' }}>
        <FilterAdmin />
      </div>
    </div>
  );
}
