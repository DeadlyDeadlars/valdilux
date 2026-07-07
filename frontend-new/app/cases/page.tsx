const PROJECTS = [
  { img: '/photos/1nATC-gb.jpg', title: 'Кабинет руководителя', desc: 'Массив дуба, кожа' },
  { img: '/photos/9GKWoY0k.jpg', title: 'Гостиная в классическом стиле', desc: 'Шпон ореха, латунь' },
  { img: '/photos/CWw1Dh9b.jpg', title: 'Спальня премиум-класса', desc: 'Массив ясеня' },
  { img: '/photos/Ce1Den6q.jpg', title: 'Библиотека', desc: 'Массив дуба' },
  { img: '/photos/DkESoVwv.jpg', title: 'Столовая зона', desc: 'Шпон ореха' },
  { img: '/photos/FxLhQYGE.jpg', title: 'Домашний офис', desc: 'Массив дуба, кожа' },
  { img: '/photos/dFEP82d5.jpg', title: 'Гардеробная', desc: 'Шпон дуба' },
  { img: '/photos/jSVIyafQ.jpg', title: 'Кухня-гостиная', desc: 'Массив ясеня' },
  { img: '/photos/jwCq7FQ7.jpg', title: 'Прихожая', desc: 'Массив дуба' },
  { img: '/photos/of-wRB_L.jpg', title: 'Детская комната', desc: 'Массив бука' },
  { img: '/photos/v1YDmbWZ.jpg', title: 'Кабинет в квартире', desc: 'Шпон ореха' },
  { img: '/photos/vM6q5wD_.jpg', title: 'Гостевая спальня', desc: 'Массив дуба' },
];

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
          {PROJECTS.map((p, i) => (
            <div key={i} className="product-card">
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#1a1a1a', overflow: 'hidden' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                <div style={{ color: '#4a4540', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{p.desc}</div>
                <h3 className="serif" style={{ color: 'var(--text2)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.3 }}>{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
