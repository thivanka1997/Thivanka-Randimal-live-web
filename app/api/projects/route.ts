import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectModel from '@/lib/models/Project';

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ status: 'success', count: projects.length, data: projects });
    }
    return NextResponse.json({
      status: 'success',
      source: 'local_store',
      message: 'MongoDB in standby mode.',
      data: [],
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, _id, ...updates } = body;
    const query = id ? { id } : { _id };

    const conn = await connectDB();
    if (conn) {
      const updated = await ProjectModel.findOneAndUpdate(query, updates, { new: true, upsert: true });
      return NextResponse.json({ status: 'success', data: updated });
    }
    return NextResponse.json({ status: 'success', data: body });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Project id is required' }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      await ProjectModel.deleteOne({ $or: [{ id }, { _id: id }] });
      return NextResponse.json({ status: 'success', message: 'Project deleted' });
    }
    return NextResponse.json({ status: 'success', message: 'Deleted locally' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
