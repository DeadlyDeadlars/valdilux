export default function DeliveryPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label mb-6">Логистика</div>
          <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Доставка и сборка</h1>
        </div>
      </div>

      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {[
          {
            title: 'Доставка по России',
            text: 'Осуществляем доставку по всей территории России. Стоимость и сроки рассчитываются индивидуально в зависимости от региона и габаритов заказа.',
          },
          {
            title: 'Сроки изготовления',
            text: 'Стандартные позиции из каталога — от 14 рабочих дней. Индивидуальные проекты — от 30 рабочих дней. Точные сроки согласовываются при оформлении заказа.',
          },
          {
            title: 'Профессиональная сборка',
            text: 'Наши специалисты выполнят профессиональную сборку и установку мебели на месте. Услуга доступна в Екатеринбурге и ближайших городах.',
          },
          {
            title: 'Упаковка',
            text: 'Каждое изделие упаковывается в защитные материалы, исключающие повреждения при транспортировке.',
          },
        ].map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '3rem', borderLeft: '1px solid rgba(201,169,110,0.2)', paddingLeft: '2rem' }}>
            <h2 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{title}</h2>
            <p style={{ color: '#6a6058', fontSize: '0.875rem', lineHeight: 1.9 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
