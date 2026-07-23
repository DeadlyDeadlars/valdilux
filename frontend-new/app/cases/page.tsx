import type { Metadata } from 'next';
import photos from '@/public/photos/ind-zakaz/index.json';

export const metadata: Metadata = {
  title: 'Портфолио — реализованные проекты мебели из массива | ValDiLux',
  description: 'Фото готовых проектов мебели из массива дуба, бука и ясеня. Письменные столы, шкафы, стеллажи, индивидуальные проекты для кабинетов.',
  openGraph: {
    title: 'Портфолио мебели из массива — ValDiLux',
    description: 'Фото готовых проектов: столы, шкафы, стеллажи из массива дерева.',
  },
};

export default function CasesPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">Портфолио</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Наши проекты</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem' }}>Реализованные проекты для наших клиентов</p>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(photos as string[]).map((file, i) => (
            <div key={i}>
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#1a1a1a', overflow: 'hidden' }}>
                <img
                  src={`/photos/ind-zakaz/${file}`}
                  alt={`Индивидуальный проект мебели из массива дерева — пример работы ValDiLux ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
