import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from 'crypto';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const scrypt = promisify(scryptCb) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export type SessionRole = 'admin' | 'client' | 'business_development';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: SessionRole;
}

export const SESSION_COOKIE = 'trp_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getSecret = () => {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
};

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');

const sign = (data: string, secret: string) => createHmac('sha256', secret).update(data).digest('base64url');

/** Compare two strings without leaking their contents through timing. */
export const safeEqual = (a: string, b: string) => {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
};

// ─── Passwords (scrypt, stored as "scrypt$<salt>$<hash>") ───

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored?: string | null): Promise<boolean> {
  if (!stored || !stored.startsWith('scrypt$')) return false;
  const [, salt, hashHex] = stored.split('$');
  if (!salt || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ─── Session tokens (HMAC-signed, stored in an httpOnly cookie) ───

export function createSessionToken(user: SessionUser): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = b64url(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  return `${payload}.${sign(payload, secret)}`;
}

export function readSessionToken(token?: string | null): SessionUser | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: data.id, name: data.name, email: data.email, role: data.role };
  } catch {
    return null;
  }
}

const readCookie = (req: Request, name: string) => {
  const header = req.headers.get('cookie') || '';
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

export const getSessionUser = (req: Request) => readSessionToken(readCookie(req, SESSION_COOKIE));

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

/** Returns a 401 response unless the request carries a valid admin session. */
export function requireAdmin(req: Request): NextResponse | null {
  const user = getSessionUser(req);
  if (user?.role === 'admin') return null;
  return NextResponse.json({ status: 'error', message: 'Admin login required' }, { status: 401 });
}

// ─── Basic brute-force protection (per server instance) ───

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export const clearAttempts = (key: string) => attempts.delete(key);

export const clientIp = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
