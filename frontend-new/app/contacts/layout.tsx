import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты — ValDiLux | Производство мебели в Екатеринбурге',
  description: 'Контакты мастерской премиальной мебели ValDiLux. Телефон: +7 (905) 805-24-65. Екатеринбург, Свердловская обл. Telegram, WhatsApp.',
  openGraph: {
    title: 'Контакты — ValDiLux | Производство мебели в Екатеринбурге',
    description: 'Свяжитесь с нами: +7 (905) 805-24-65, Telegram, Email. Производство в Екатеринбурге.',
  },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
