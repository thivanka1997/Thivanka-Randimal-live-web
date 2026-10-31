import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dns from 'dns';
import { requireAdmin } from '@/lib/auth';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // ignore
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { uri } = await req.json();

    if (!uri || typeof uri !== 'string') {
      return NextResponse.json(
        { success: false, message: 'MongoDB URI is required' },
        { status: 400 }
      );
    }

    // Attempt isolated test connection
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    }).asPromise();

    const collections = await conn.db?.listCollections().toArray();
    await conn.close();

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB Cluster!',
      collectionsCount: collections?.length || 0,
      collections: collections?.map((c) => c.name) || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: `MongoDB Connection Failed: ${err.message}`,
      },
      { status: 500 }
    );
  }
}
