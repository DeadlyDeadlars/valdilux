'use client';
import { useEffect } from 'react';

export default function JivoChat() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_JIVO_ID;
    if (!id) return;

    const script = document.createElement('script');
    script.src = `//code.jivo.ru/widget/${id}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
