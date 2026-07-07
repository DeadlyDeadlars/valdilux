import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
import './globals.css';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';
import { CompareProvider } from '@/lib/compare';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YandexMetrika from '@/components/YandexMetrika';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import JivoChat from '@/components/JivoChat';
import LiveChat from '@/components/LiveChat';

export const metadata: Metadata = {
  title: 'ValDiLux — Премиальная мебель из массива дерева на заказ',
  description: 'Мебельный цех Мининых. Изготовление мебели из массива дуба, ясеня, ореха. Столы, шкафы, комоды, стеллажи. Доставка по России. Гарантия 5 лет.',
  keywords: 'мебель из массива, мебель на заказ, мебель из дерева, столы из массива, шкафы из дерева, мебель Екатеринбург',
  openGraph: {
    title: 'ValDiLux — Премиальная мебель из массива дерева',
    description: 'Изготовление мебели из массива дуба, ясеня, ореха. Гарантия 5 лет. Доставка по России.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ValDiLux',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://valdilux.ru" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta name="google-site-verification" content="your-google-verification-code" />
        {/* Предотвращение мигания при загрузке */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          } catch(e){}
        `}} />
      </head>
      <body>
        <AuthProvider>
          <CompareProvider>
            <CartProvider>
              <YandexMetrika />
              <GoogleAnalytics />
              <JivoChat />
              <LiveChat />
              <Header />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
