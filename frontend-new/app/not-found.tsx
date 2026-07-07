import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)' }}>
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 600, width: '100%' }}>
        {/* Декоративное фото */}
        <div style={{ width: 200, height: 200, margin: '0 auto 2.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.1)' }}>
          <img
            src="/logo.webp"
            alt="ValDiLux"
            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.15, padding: '2rem' }}
          />
        </div>
        <div style={{ color: 'rgba(201,169,110,0.2)', fontSize: '8rem', fontWeight: 300, lineHeight: 1, marginBottom: '1rem', fontFamily: 'serif' }}>404</div>
        <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, marginBottom: '1rem' }}>
          Страница не найдена
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2.5rem', lineHeight: 1.8 }}>
          Возможно, страница была перемещена или удалена.<br />
          Вернитесь на главную или перейдите в каталог.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-gold">На главную</Link>
          <Link href="/catalog" className="btn-gold">Каталог</Link>
        </div>
      </div>
    </div>
  );
}
