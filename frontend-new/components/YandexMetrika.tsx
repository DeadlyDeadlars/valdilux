'use client';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function YandexMetrikaInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
    if (!id) return;

    // Инициализация
    if (!(window as any).ym) {
      (window as any).ym = (window as any).ym || function(...args: any[]) {
        ((window as any).ym.a = (window as any).ym.a || []).push(args);
      };
      (window as any).ym.l = Date.now();

      const script = document.createElement('script');
      script.src = 'https://mc.yandex.ru/metrika/tag.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).ym(id, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: 'dataLayer',
        });
      };
    }
  }, []);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
    if (id && (window as any).ym) {
      (window as any).ym(id, 'hit', pathname + (searchParams.toString() ? '?' + searchParams.toString() : ''));
    }
  }, [pathname, searchParams]);

  return null;
}

export default function YandexMetrika() {
  return (
    <Suspense fallback={null}>
      <YandexMetrikaInner />
    </Suspense>
  );
}
