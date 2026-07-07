import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pt-10 pb-6 md:pt-16 md:pb-8" style={{ background: 'var(--bg)', borderTop: '1px solid rgba(201,169,110,0.08)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-8 md:mb-12">
          <div>
            <div className="serif mb-2 md:mb-3 md:text-lg" style={{ color: '#c9a96e', fontSize: '0.9rem', fontWeight: 300 }}>Valdilux</div>
            <p className="md:text-xs md:leading-relaxed" style={{ color: '#3a3530', fontSize: '0.6rem', lineHeight: 1.6 }}>Мебельный цех Мининых</p>
          </div>
          <div>
            <div className="section-label mb-3 md:mb-4 md:text-xs" style={{ fontSize: '0.55rem' }}>Каталог</div>
            {([
              ['Все товары', '/catalog'],
              ['Письменный стол', '/catalog?category=pismennye-stoly'],
              ['Книжный шкаф', '/catalog?category=shkafy'],
              ['Стеллажи', '/catalog?category=stellazhi'],
              ['Комоды', '/catalog?category=komody'],
              ['Журнальные столики', '/catalog?category=zhurnalnye-stoliki'],
              ['Тумбы', '/catalog?category=tumby'],
              ['Брифинги', '/catalog?category=brifing'],
              ['Консоли', '/catalog?category=konsoli'],
              ['Сервант', '/catalog?category=servant'],
              ['ТВ тумба', '/catalog?category=tv-tumba'],
            ] as [string,string][]).map(([l, h]) => (
              <Link key={h} href={h} className="footer-link" style={{ fontSize: '0.6rem', marginBottom: '0.4rem' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div className="section-label mb-3 md:mb-4 md:text-xs" style={{ fontSize: '0.55rem' }}>Компания</div>
            {([['О фабрике', '/about'], ['Контакты', '/contacts'], ['Доставка', '/delivery'], ['Оплата', '/payment'], ['Отзывы', '/reviews'], ['FAQ', '/faq'], ['Наши проекты', '/cases'], ['Блог', '/blog'], ['Политика конфиденциальности', '/privacy'], ['Пользовательское соглашение', '/terms']] as [string,string][]).map(([l, h]) => (
              <Link key={h} href={h} className="footer-link" style={{ fontSize: '0.6rem', marginBottom: '0.4rem' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div className="section-label mb-3 md:mb-4 md:text-xs" style={{ fontSize: '0.55rem' }}>Контакты</div>
            <a href="tel:+79058052465" className="footer-link" style={{ fontSize: '0.6rem', marginBottom: '0.4rem' }}>+7 (905) 805-24-65</a>
            <a href="mailto:valdilux-mebel@yandex.ru" className="footer-link" style={{ fontSize: '0.6rem', marginBottom: '0.4rem' }}>valdilux-mebel@yandex.ru</a>
            <div className="flex gap-3 md:gap-4 mt-2 md:mt-3">
              <a href="https://t.me/Valdilux_mebel" target="_blank" rel="noopener" className="nav-link" style={{ fontSize: '0.6rem' }}>Telegram</a>
              <a href="https://max.ru/u/f9LHodD0cOKBmU6imfN_JGcs3nE4xAXE4j3ow9K7QaKrK-zb4W1Yj_N19G4" target="_blank" rel="noopener" className="nav-link" style={{ fontSize: '0.6rem' }}>Max</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-2 md:justify-between md:pt-6" style={{ borderTop: '1px solid rgba(201,169,110,0.06)', paddingTop: '1rem' }}>
          <p className="md:text-xs" style={{ color: '#2a2520', fontSize: '0.55rem' }}>© 2024–2025 ValDiLux. Мебельный цех Мининых. Все права защищены.</p>
          <p className="md:text-xs" style={{ color: '#2a2520', fontSize: '0.55rem' }}>ИП Минин Дмитрий Витальевич | ИНН 661903101020</p>
        </div>
      </div>
    </footer>
  );
}
