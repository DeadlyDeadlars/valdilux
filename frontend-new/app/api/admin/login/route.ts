import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPass = process.env.ADMIN_PASS || 'admin123';
  if (password !== adminPass) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const store = await cookies();
  store.set('admin_token', adminPass, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
  return NextResponse.json({ ok: true });
}
