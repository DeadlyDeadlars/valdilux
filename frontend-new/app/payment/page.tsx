import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оплата — ValDiLux',
  description: 'Способы оплаты мебели ValDiLux: карты, безналичный расчёт, рассрочка, наличные.',
};

const CardIcon = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="22" height="14" rx="2" />
    <line x1="1" y1="9" x2="23" y2="9" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <line x1="9" y1="6" x2="9" y2="8" />
    <line x1="12" y1="6" x2="12" y2="8" />
    <line x1="15" y1="6" x2="15" y2="8" />
    <line x1="9" y1="11" x2="9" y2="13" />
    <line x1="12" y1="11" x2="12" y2="13" />
    <line x1="15" y1="11" x2="15" y2="13" />
    <line x1="9" y1="16" x2="9" y2="18" />
    <line x1="12" y1="16" x2="12" y2="18" />
    <line x1="15" y1="16" x2="15" y2="18" />
  </svg>
);

const BoltIcon = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,1 2,14 9,14 8,23 18,10 11,10" />
  </svg>
);

const CashIcon = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="22" height="14" rx="2" />
    <circle cx="12" cy="10" r="4" />
    <line x1="1" y1="7" x2="4" y2="7" />
    <line x1="20" y1="13" x2="23" y2="13" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="18" height="18" rx="2" />
    <line x1="2" y1="9" x2="20" y2="9" />
    <line x1="7" y1="1" x2="7" y2="6" />
    <line x1="15" y1="1" x2="15" y2="6" />
  </svg>
);

const methods = [
  {
    title: 'Банковская карта',
    text: 'Оплата картами Visa, Mastercard, МИР онлайн через защищённый платёжный шлюз. Данные карты не хранятся на наших серверах.',
    icon: <CardIcon />,
  },
  {
    title: 'Безналичный расчёт (юрлица)',
    text: 'Выставляем счёт для юридических лиц и ИП. Работаем с НДС и без. Предоставляем полный пакет закрывающих документов.',
    icon: <BuildingIcon />,
  },
  {
    title: 'СБП — Система быстрых платежей',
    text: 'Мгновенный перевод по номеру телефона без комиссии. Самый быстрый способ оплаты.',
    icon: <BoltIcon />,
  },
  {
    title: 'Наличные',
    text: 'Оплата наличными при самовывозе из шоурума или при доставке курьером по Екатеринбургу.',
    icon: <CashIcon />,
  },
  {
    title: 'Рассрочка и кредит',
    text: 'Оформляем рассрочку 0% через банки-партнёры на срок от 3 до 24 месяцев. Кредит на покупку мебели без первоначального взноса.',
    icon: <CalendarIcon />,
  },
];

export default function PaymentPage() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">Финансы</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Оплата</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.8, marginTop: '1rem' }}>
            Выберите удобный способ оплаты. Все транзакции защищены.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {methods.map(({ title, text, icon }) => (
          <div key={title} style={{ marginBottom: '2.5rem', borderLeft: '1px solid rgba(201,169,110,0.2)', paddingLeft: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, marginTop: 2 }}>{icon}</span>
            <div>
              <h2 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{title}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.9 }}>{text}</p>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '3rem', borderLeft: '1px solid rgba(201,169,110,0.2)', paddingLeft: '2rem' }}>
          <h2 style={{ color: '#c9a96e', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Безопасность платежей</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.9 }}>
            Все онлайн-платежи обрабатываются через сертифицированный платёжный шлюз с шифрованием SSL. Мы не храним данные банковских карт. Платёжная система соответствует стандарту PCI DSS.
          </p>
        </div>

        <div style={{ marginTop: '3rem', background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', padding: '1.5rem 2rem' }}>
          <p style={{ color: '#a09080', fontSize: '0.8rem', lineHeight: 1.8 }}>
            Есть вопросы по оплате? Позвоните нам:{' '}
            <a href="tel:+79058052465" style={{ color: '#c9a96e', textDecoration: 'none' }}>+7 905 805 24 65</a>
            {' '}или напишите в{' '}
            <a href="https://t.me/valdilux" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a96e', textDecoration: 'none' }}>Telegram</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
