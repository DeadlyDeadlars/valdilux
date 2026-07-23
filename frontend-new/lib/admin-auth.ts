import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function isAdminJWT(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  if (!token || !isAdminJWT(token)) {
    redirect('/admin-login');
  }
}
