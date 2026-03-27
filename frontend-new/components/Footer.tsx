import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="serif mb-3" style={{ color: '#c9a96e', fontSize: '1.1rem', fontWeight: 300 }}>Valdilux</div>
            <p style={{ color: '#3a3530', fontSize: '0.7rem', lineHeight: 1.8 }}>Мебельный цех Мининых</p>
          </div>
          <div>
            <div className="section-label mb-4">Каталог</div>
            {([['Все товары', '/catalog'], ['Столы', '/catalog?category=tables'], ['Стулья', '/catalog?category=chairs'], ['Шкафы', '/catalog?category=cabinets'], ['Диваны', '/catalog?category=sofas']] as [string,string][]).map(([l, h]) => (
              <Link key={h} href={h} className="footer-link">{l}</Link>
            ))}
          </div>
          <div>
            <div className="section-label mb-4">Компания</div>
            {([['О фабрике', '/about'], ['Контакты', '/contacts'], ['Доставка', '/delivery'], ['FAQ', '/faq'], ['Наши проекты', '/cases'], ['Новости', '/news'], ['Блог', '/blog'], ['Политика конфиденциальности', '/privacy']] as [string,string][]).map(([l, h]) => (
              <Link key={h} href={h} className="footer-link">{l}</Link>
            ))}
          </div>
          <div>
            <div className="section-label mb-4">Контакты</div>
            <a href="tel:+79058052465" className="footer-link">+7 (905) 805-24-65</a>
            <a href="mailto:valdilux-mebel@yandex.ru" className="footer-link">valdilux-mebel@yandex.ru</a>
            <div className="flex gap-4 mt-3">
              <a href="https://t.me/Valdilux_mebel" target="_blank" rel="noopener" className="nav-link">Telegram</a>
              <a href="https://wa.me/79058052465" target="_blank" rel="noopener" className="nav-link">WhatsApp</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(201,169,110,0.06)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between' }}>
          <p style={{ color: '#2a2520', fontSize: '0.65rem' }}>© 2024–2025 ValDiLux. Мебельный цех Мининых. Все права защищены.</p>
          <p style={{ color: '#2a2520', fontSize: '0.65rem' }}>ИП Минин Дмитрий Витальевич | ИНН 661903101020</p>
        </div>
      </div>
    </footer>
  );
}
