const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const PASS = process.env.ADMIN_PASS || 'admin123';

export const adminFetch = (path: string, options?: RequestInit) =>
  fetch(`${API}${path}`, {
    ...options,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'x-admin-pass': PASS, ...options?.headers },
  }).then(r => r.json());
