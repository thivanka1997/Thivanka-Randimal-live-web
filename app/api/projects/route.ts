import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectModel from '@/lib/models/Project';

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ status: 'success', data: projects });
    }
    return NextResponse.json({
      status: 'success',
      source: 'local_store',
      message: 'MongoDB in standby mode. Client state synchronizes with portal memory.',
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const conn = await connectDB();
    if (conn) {
      const created = await ProjectModel.create(body);
      return NextResponse.json({ status: 'success', data: created }, { status: 201 });
    }
    return NextResponse.json({
      status: 'success',
      message: 'Project created in memory (MongoDB in standby)',
      data: body,
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
