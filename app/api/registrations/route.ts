import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RegistrationModel from '@/lib/models/Registration';

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const registrations = await RegistrationModel.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ status: 'success', data: registrations });
    }
    return NextResponse.json({
      status: 'success',
      source: 'local_store',
      message: 'MongoDB in standby mode.',
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const regData = await req.json();
    const conn = await connectDB();

    if (conn) {
      const saved = await RegistrationModel.create(regData);
      return NextResponse.json({ status: 'success', data: saved }, { status: 201 });
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Registration received by Next.js backend (Standby mode)',
        data: regData,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
