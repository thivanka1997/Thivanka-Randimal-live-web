import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/lib/models/User';
import {
  SessionUser,
  clearAttempts,
  clientIp,
  createSessionToken,
  isRateLimited,
  recordFailedAttempt,
  safeEqual,
  setSessionCookie,
  verifyPassword,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

const fail = (message: string, status = 401) => NextResponse.json({ status: 'error', message }, { status });

export async function POST(req: Request) {
  let body: { email?: string; password?: string; role?: string } = {};
  try {
    body = await req.json();
  } catch {
    // fall through to validation
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const role = body.role;
  if (!email || !password) return fail('Email and password are required.', 400);

  const limitKey = `${clientIp(req)}:${email}`;
  if (isRateLimited(limitKey)) {
    return fail('Too many failed attempts. Please wait 15 minutes and try again.', 429);
  }

  let user: SessionUser | null = null;

  // ─── Administrator: credentials live only in server environment variables ───
  if (role === 'admin') {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    if (!adminEmail || !adminPassword) {
      return fail('Admin login is not configured on the server yet.', 503);
    }
    if (safeEqual(email, adminEmail) && safeEqual(password, adminPassword)) {
      user = { id: 'admin', name: process.env.ADMIN_NAME || 'Thivanka Randimal', email: adminEmail, role: 'admin' };
    }
  } else {
    // ─── Clients & BD partners: hashed passwords in MongoDB ───
    const conn = await connectDB();
    if (!conn) return fail('Login service is temporarily unavailable. Please try again shortly.', 503);

    const found = await UserModel.findOne({ email })
      .select('+passwordHash name email role status')
      .lean()
      .exec();

    const roleMatches = !role || found?.role === role;
    if (found && found.role !== 'admin' && roleMatches && (await verifyPassword(password, found.passwordHash))) {
      if (found.status !== 'active') {
        return fail('This account is not active. Please contact the administrator.', 403);
      }
      user = { id: found._id.toString(), name: found.name, email: found.email, role: found.role };
    }
  }

  if (!user) {
    recordFailedAttempt(limitKey);
    return fail('Incorrect email or password.');
  }

  const token = createSessionToken(user);
  if (!token) return fail('Server session secret (AUTH_SECRET) is not configured.', 503);

  clearAttempts(limitKey);
  const res = NextResponse.json({ status: 'success', user });
  setSessionCookie(res, token);
  return res;
}
