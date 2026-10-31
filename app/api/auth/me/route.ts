import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ status: 'error', user: null }, { status: 401 });
  return NextResponse.json({ status: 'success', user });
}
