import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/lib/models/User';
import { hashPassword, requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ROLES = ['client', 'business_development'] as const;
const MIN_PASSWORD_LENGTH = 8;

// Admin-only: create or update a client / BD partner login so it works on any device.
// Body: { email, name?, role?, status?, password? }
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email) {
      return NextResponse.json({ status: 'error', message: 'email is required' }, { status: 400 });
    }
    if (body.role && !ROLES.includes(body.role)) {
      return NextResponse.json({ status: 'error', message: 'role must be client or business_development' }, { status: 400 });
    }
    if (body.password && String(body.password).length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { status: 'error', message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ status: 'error', message: 'Database unavailable' }, { status: 503 });
    }

    const updates: Record<string, unknown> = {};
    if (body.name) updates.name = String(body.name);
    if (body.role) updates.role = body.role;
    if (body.status) updates.status = body.status === 'active' ? 'active' : 'inactive';
    if (body.password) updates.passwordHash = await hashPassword(String(body.password));

    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: updates, $setOnInsert: { email, name: body.name || email, role: body.role || 'client' } },
      { new: true, upsert: true, runValidators: true, projection: { name: 1, email: 1, role: 1, status: 1 } }
    )
      .lean()
      .exec();

    if (user?.role === 'admin') {
      return NextResponse.json({ status: 'error', message: 'Admin accounts are managed via server settings' }, { status: 400 });
    }

    return NextResponse.json({ status: 'success', user });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// Admin-only: remove a login. Query: ?email=
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const email = new URL(req.url).searchParams.get('email')?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ status: 'error', message: 'email is required' }, { status: 400 });
  }

  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({ status: 'error', message: 'Database unavailable' }, { status: 503 });
  }
  await UserModel.deleteOne({ email, role: { $ne: 'admin' } }).exec();
  return NextResponse.json({ status: 'success' });
}
