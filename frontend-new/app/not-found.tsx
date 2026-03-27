import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ color: 'rgba(201,169,110,0.3)', fontSize: '6rem', fontWeight: 300, lineHeight: 1, marginBottom: '1rem' }}>404</div>
        <h1 className="serif" style={{ color: '#f0ebe3', fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>Страница не найдена</h1>
        <p style={{ color: '#6a6058', fontSize: '0.85rem', marginBottom: '2.5rem' }}>Запрашиваемая страница не существует</p>
        <Link href="/" className="btn-gold">На главную</Link>
      </div>
    </div>
  );
}
