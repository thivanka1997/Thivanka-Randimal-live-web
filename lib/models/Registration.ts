import mongoose, { Schema, Model } from 'mongoose';

export interface IRegistration {
  clientName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceRequested: string;
  packageTier?: string;
  budget?: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentSlipUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    serviceRequested: { type: String, required: true },
    packageTier: { type: String, default: 'Standard' },
    budget: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    paymentReference: { type: String, default: '' },
    paymentSlipUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const RegistrationModel: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>('Registration', registrationSchema);

export default RegistrationModel;
