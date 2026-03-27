import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  const adminPass = process.env.ADMIN_PASS || 'admin123';
  if (token !== adminPass) {
    redirect('/admin-login');
  }
}
