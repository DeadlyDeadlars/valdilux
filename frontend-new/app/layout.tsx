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
  title: 'ValDiLux — Премиальная мебель',
  description: 'Мебельный цех Мининых. Столы, стулья, шкафы, диваны из массива дерева.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <head>
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
