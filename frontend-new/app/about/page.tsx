export default function AboutPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label mb-6">О нас</div>
          <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.1 }}>
            О фабрике ValDiLux
          </h1>
          <p style={{ color: '#6a6058', fontSize: '0.85rem', marginTop: '1rem' }}>Мебельный цех Мининых — создаём премиальную мебель</p>
        </div>
      </div>

      <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "5rem 1.5rem" }}>
        {[
          {
            title: 'Главный принцип',
            text: 'Подходить к работе с максимальной внимательностью и ответственностью, чтобы каждое изделие отражало преданность профессии и уважение к клиентам.',
          },
          {
            title: 'Миссия компании',
            text: 'Создавать исключительную мебель, сочетающую в себе классическую красоту и современную эргономику. Ваш кабинет — станет отражением вашего статуса и престижа.',
          },
          {
            title: 'Качество производства',
            text: 'Мы предлагаем вам столы, созданные с любовью и вниманием к деталям. Наша работа — это не массовое производство, а настоящее мастерство, где каждая деталь проходит тщательную обработку и контроль качества.',
          },
        ].map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '3.5rem', borderLeft: '1px solid rgba(201,169,110,0.2)', paddingLeft: '2rem' }}>
            <h2 className="serif" style={{ color: '#f0ebe3', fontSize: '1.6rem', fontWeight: 300, marginBottom: '1rem' }}>{title}</h2>
            <p style={{ color: '#6a6058', fontSize: '0.875rem', lineHeight: 1.9 }}>{text}</p>
          </div>
        ))}

        <div style={{ marginBottom: '3.5rem' }}>
          <h2 className="serif" style={{ color: '#f0ebe3', fontSize: '1.6rem', fontWeight: 300, marginBottom: '2rem' }}>Возможности изготовления</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Рабочие столы и кабинеты', text: 'Изготавливаем письменные столы, рабочие кабинеты, корпусную мебель из массива' },
              { title: 'Индивидуальные размеры', text: 'Возможно изготовление по вашим размерам и пожеланиям' },
              { title: '3D визуализация', text: 'Разработка проекта и 3D визуализации для нестандартных заказов' },
            ].map(({ title, text }) => (
              <div key={title} style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '1.5rem' }}>
                <h4 style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{title}</h4>
                <p style={{ color: '#6a6058', fontSize: '0.75rem', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '3.5rem' }}>
          <h2 className="serif" style={{ color: '#f0ebe3', fontSize: '1.6rem', fontWeight: 300, marginBottom: '2rem' }}>Материалы премиум-класса</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Массив дерева', text: 'Дуб, бук, ясень — только отборная древесина с естественной сушкой' },
              { title: 'Натуральная кожа', text: 'Обтяжка столешниц натуральной кожей премиум-качества' },
              { title: 'Фурнитура', text: 'Европейская фурнитура с доводчиками и гарантией долговечности' },
            ].map(({ title, text }) => (
              <div key={title} style={{ borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: '1.25rem' }}>
                <h4 style={{ color: '#c9a96e', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ color: '#6a6058', fontSize: '0.75rem', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '2rem' }}>
          <h3 className="serif" style={{ color: '#f0ebe3', fontSize: '1.2rem', fontWeight: 300, marginBottom: '1rem' }}>ИП Минин Дмитрий Витальевич</h3>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#4a4540', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>ИНН</div>
              <div style={{ color: '#a09080', fontSize: '0.8rem' }}>661903101020</div>
            </div>
            <div>
              <div style={{ color: '#4a4540', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>ОГРН</div>
              <div style={{ color: '#a09080', fontSize: '0.8rem' }}>324665800125389</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
