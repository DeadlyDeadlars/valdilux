import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ token });
}
