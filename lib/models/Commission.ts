import mongoose, { Schema, Model } from 'mongoose';

export interface ICommission {
  commissionId: string;
  bdId: string;
  bdName?: string;
  leadId?: string;
  clientName: string;
  service: string;
  projectValue: number;
  commissionPercent: number;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  paymentReference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commissionSchema = new Schema<ICommission>(
  {
    commissionId: { type: String, required: true, unique: true, index: true },
    bdId: { type: String, required: true, index: true },
    bdName: { type: String, default: '' },
    leadId: { type: String, default: '' },
    clientName: { type: String, required: true },
    service: { type: String, required: true },
    projectValue: { type: Number, required: true },
    commissionPercent: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'PAID', 'CANCELLED'],
      default: 'PENDING',
    },
    approvedAt: { type: String, default: '' },
    approvedBy: { type: String, default: '' },
    paidAt: { type: String, default: '' },
    paymentReference: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CommissionModel: Model<ICommission> =
  mongoose.models.Commission || mongoose.model<ICommission>('Commission', commissionSchema);

export default CommissionModel;
