import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RegistrationModel from '@/lib/models/Registration';

export const dynamic = 'force-dynamic';

// Registrations hold client contact and payment details, so listing them requires
// the ADMIN_API_KEY (set in Vercel → Settings → Environment Variables) as a header:
//   x-admin-key: <ADMIN_API_KEY>
const isAdminRequest = (req: Request) => {
  const key = process.env.ADMIN_API_KEY;
  return !!key && req.headers.get('x-admin-key') === key;
};

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const conn = await connectDB();
    if (conn) {
      const registrations = await RegistrationModel.find({})
        .sort({ createdAt: -1 })
        .limit(500)
        .select('-__v')
        .lean()
        .exec();
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
    const email = typeof regData?.email === 'string' ? regData.email.trim() : '';
    const clientName = regData?.clientName || regData?.name;
    if (!email || !clientName) {
      return NextResponse.json({ status: 'error', message: 'name and email are required' }, { status: 400 });
    }

    // Map the portal's registration form onto the database schema.
    // The password is deliberately never stored here.
    const doc = {
      referenceNumber: regData.referenceNumber || '',
      clientName,
      email,
      phone: regData.phone || '',
      company: regData.company || regData.companyName || '',
      serviceRequested: regData.serviceRequested || regData.serviceTitle || regData.serviceId || 'General Enquiry',
      packageTier: regData.packageTier || 'Standard',
      budget: Number(regData.budget ?? regData.finalAmount ?? regData.packagePrice ?? 0) || 0,
      paymentMethod: regData.paymentMethod || 'Bank Transfer',
      paymentReference: regData.paymentReference || '',
      paymentSlipUrl: regData.paymentSlipUrl || '',
      status: 'pending' as const,
      adminNotes: regData.notes || '',
    };

    const conn = await connectDB();
    if (conn) {
      const saved = await RegistrationModel.create(doc);
      return NextResponse.json(
        { status: 'success', data: { id: saved._id.toString(), referenceNumber: saved.referenceNumber } },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Registration received by Next.js backend (Standby mode)',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
