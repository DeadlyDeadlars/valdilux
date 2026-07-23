import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendPath = '/' + path.join('/');

  const store = await cookies();
  const token = store.get('admin_token')?.value;

  const body = req.method !== 'GET' && req.method !== 'DELETE' ? await req.json().catch(() => undefined) : undefined;

  const backend = await fetch(`${API}${backendPath}${req.nextUrl.search}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-admin-pass': token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = backend.ok ? await backend.json().catch(() => null) : null;
  return NextResponse.json(data || { error: 'Backend error' }, { status: backend.ok ? 200 : backend.status });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
