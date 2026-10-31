import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/mongodb';
import ProjectModel from '@/lib/models/Project';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_PROJECTS = 200;

// Fields the server manages itself — never accept them from the client
const stripManagedFields = (body: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, createdAt, updatedAt, ...rest } = body;
  return rest;
};

// Client-side ids look like "proj-1"; only match _id when it's a real ObjectId,
// otherwise Mongoose throws a CastError and the whole query fails.
const matchById = (id: string) =>
  isValidObjectId(id) ? { $or: [{ id }, { _id: id }] } : { id };

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const projects = await ProjectModel.find({})
        .sort({ createdAt: -1 })
        .limit(MAX_PROJECTS)
        .select('-__v')
        .lean()
        .exec();
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
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    if (!body?.title || !body?.category) {
      return NextResponse.json({ status: 'error', message: 'title and category are required' }, { status: 400 });
    }
    const conn = await connectDB();
    if (conn) {
      const created = await ProjectModel.create(stripManagedFields(body));
      return NextResponse.json({ status: 'success', data: created.toObject() }, { status: 201 });
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
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const id: string | undefined = body?.id || body?._id;
    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Project id is required' }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      const updated = await ProjectModel.findOneAndUpdate(
        matchById(String(id)),
        { $set: stripManagedFields(body) },
        { new: true, upsert: true, runValidators: true, projection: { __v: 0 } }
      )
        .lean()
        .exec();
      return NextResponse.json({ status: 'success', data: updated });
    }
    return NextResponse.json({ status: 'success', data: body });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Project id is required' }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      await ProjectModel.deleteOne(matchById(id)).exec();
      return NextResponse.json({ status: 'success', message: 'Project deleted' });
    }
    return NextResponse.json({ status: 'success', message: 'Deleted locally' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
