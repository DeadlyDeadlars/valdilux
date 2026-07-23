import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка — ValDiLux',
  description: 'Доставка мебели ValDiLux по всей России. Сроки, стоимость, самовывоз.',
};

export default function DeliveryPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">Логистика</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Доставка</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.8, marginTop: '1rem' }}>
            Доставляем мебель по всей России и за рубеж. Каждое изделие упаковывается с особой тщательностью.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {[
          {
            title: 'География доставки',
            text: 'Доставляем по всей России и в страны СНГ. Для международных заказов — индивидуальный расчёт. Работаем с транспортными компаниями СДЭК, ПЭК, Деловые Линии и другими.',
          },
          {
            title: 'Сроки доставки',
            text: 'По Екатеринбургу — 1–3 рабочих дня. По России — от 3 до 14 рабочих дней в зависимости от региона. Точные сроки уточняются при оформлении заказа.',
          },
          {
            title: 'Стоимость доставки',
            text: 'Стоимость рассчитывается индивидуально в зависимости от габаритов, веса и региона доставки. Для расчёта стоимости воспользуйтесь калькулятором транспортной компании ПЭК.',
          },
          {
            title: 'Самовывоз',
            text: 'Самовывоз из нашего шоурума в Екатеринбурге — бесплатно. Адрес и время работы уточняйте по телефону или в мессенджерах.',
          },

        ].map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '3rem', borderLeft: '1px solid rgba(201,169,110,0.2)', paddingLeft: '2rem' }}>
            <h2 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.9 }}>{text}</p>
          </div>
        ))}


        <div style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', padding: '1.5rem 2rem' }}>
          <p style={{ color: '#a09080', fontSize: '0.8rem', lineHeight: 1.8 }}>
            Вопросы по доставке:{' '}
            <a href="tel:+79058052465" style={{ color: '#c9a96e', textDecoration: 'none' }}>+7 905 805 24 65</a>
            {' '}или{' '}
            <a href="https://t.me/valdilux" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a96e', textDecoration: 'none' }}>Telegram</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
