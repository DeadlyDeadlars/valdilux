'use client';
import { useEffect } from 'react';

export default function YandexMetrika() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
    if (!id) return;

    const load = () => {
      if (typeof (window as any).ym === 'function') return;
      const w = window as any;
      w.ym = w.ym || function(...args: any[]) { (w.ym.a = w.ym.a || []).push(args); };
      w.ym.l = 1 * Date.now();
      for (let j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === 'https://mc.yandex.ru/metrika/tag.js?id=' + id) return;
      }
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + id;
      document.getElementsByTagName('script')[0].parentNode!.insertBefore(s, document.getElementsByTagName('script')[0]);
      w.ym(id, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
    };

    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      load();
    } else {
      const handler = () => load();
      window.addEventListener('cookie-consent-accepted', handler);
      return () => window.removeEventListener('cookie-consent-accepted', handler);
    }
  }, []);

  return null;
}
