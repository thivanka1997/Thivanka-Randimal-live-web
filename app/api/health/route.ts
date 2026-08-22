import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const conn = await connectDB();
    const isConnected = !!conn && mongoose.connection.readyState === 1;

    return NextResponse.json({
      status: 'ok',
      engine: 'Next.js App Router (Server-Side)',
      database: isConnected ? 'MongoDB (Connected)' : 'MongoDB (Standby / Memory)',
      mongooseReadyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      engine: 'Next.js App Router (Server-Side)',
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
