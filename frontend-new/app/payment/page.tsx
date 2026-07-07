import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оплата — ValDiLux',
  description: 'Способы оплаты мебели ValDiLux: карты, безналичный расчёт, рассрочка, наличные.',
};

const methods = [
  {
    title: 'Банковская карта',
    text: 'Оплата картами Visa, Mastercard, МИР онлайн через защищённый платёжный шлюз. Данные карты не хранятся на наших серверах.',
    icon: '💳',
  },
  {
    title: 'Безналичный расчёт (юрлица)',
    text: 'Выставляем счёт для юридических лиц и ИП. Работаем с НДС и без. Предоставляем полный пакет закрывающих документов.',
    icon: '🏢',
  },
  {
    title: 'СБП — Система быстрых платежей',
    text: 'Мгновенный перевод по номеру телефона без комиссии. Самый быстрый способ оплаты.',
    icon: '⚡',
  },
  {
    title: 'Наличные',
    text: 'Оплата наличными при самовывозе из шоурума или при доставке курьером по Екатеринбургу.',
    icon: '💵',
  },
  {
    title: 'Рассрочка и кредит',
    text: 'Оформляем рассрочку 0% через банки-партнёры на срок от 3 до 24 месяцев. Кредит на покупку мебели без первоначального взноса.',
    icon: '📅',
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
            <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: 2 }}>{icon}</span>
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
