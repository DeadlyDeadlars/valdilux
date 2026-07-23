'use client';
import { useCallback, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export function useContactForm(endpoint: string) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const busy = useRef(false);

  const submit = useCallback(async (body: Record<string, unknown>) => {
    if (busy.current) return;
    busy.current = true;
    setStatus('loading');
    setError('');

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Ошибка отправки');
      setStatus('ok');
    } catch {
      setStatus('error');
      setError('Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      busy.current = false;
    }
  }, [endpoint]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
  }, []);

  return { status, error, submit, reset };
}
