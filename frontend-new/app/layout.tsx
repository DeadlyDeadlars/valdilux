import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

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
import CookieConsent from '@/components/CookieConsent';
import JivoChat from '@/components/JivoChat';
import LiveChat from '@/components/LiveChat';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://valdilux-mebel.ru';

export const metadata: Metadata = {
  title: 'ValDiLux — Премиальная мебель из массива дерева на заказ',
  description: 'Изготовление мебели из массива дуба, ясеня, бука. Столы, шкафы, комоды, стеллажи. Доставка по России. Гарантия 5 лет.',
  keywords: 'мебель из массива, мебель на заказ, мебель из дерева, столы из массива, шкафы из дерева, мебель Екатеринбург',
  openGraph: {
    title: 'ValDiLux — Премиальная мебель из массива дерева',
    description: 'Изготовление мебели из массива дуба, ясеня, бука. Гарантия 5 лет. Доставка по России.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ValDiLux',
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ValDiLux",
              "url": siteUrl,
              "logo": `${siteUrl}/logo.webp`,
              "image": `${siteUrl}/logo.webp`,
              "description": "Премиальная мебель из массива дерева на заказ",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Екатеринбург",
                "addressRegion": "Свердловская область",
                "addressCountry": "RU"
              },
              "contactPoint": [
                { "@type": "ContactPoint", "telephone": "+7-905-805-24-65", "contactType": "sales", "availableLanguage": "Russian" }
              ],
              "sameAs": ["https://t.me/Valdilux_mebel"]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "ValDiLux",
              "image": `${siteUrl}/logo.webp`,
              "url": siteUrl,
              "telephone": "+7-905-805-24-65",
              "email": "valdilux-mebel@yandex.ru",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Екатеринбург",
                "streetAddress": "пос. Октябрьский, ул. Свердлова, 18",
                "addressRegion": "Свердловская обл.",
                "addressCountry": "RU"
              },
              "priceRange": "50000-300000₽",
              "areaServed": "RU",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Премиальная мебель из массива",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Столы письменные" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Шкафы книжные" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Стеллажи" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Комоды" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Тумбы" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Индивидуальные проекты" } }
                ]
              }
            })
          }}
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}`}
        </Script>
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
              <CookieConsent />
            </CartProvider>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
