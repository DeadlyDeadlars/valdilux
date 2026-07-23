'use client';
import { useEffect } from 'react';

export default function GoogleAnalytics() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id) return;

    const load = () => {
      if (typeof (window as any).gtag === 'function') return;
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      document.head.appendChild(s1);

      const s2 = document.createElement('script');
      s2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `;
      document.head.appendChild(s2);
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
