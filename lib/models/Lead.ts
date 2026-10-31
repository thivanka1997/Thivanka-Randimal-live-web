import mongoose, { Schema, Model } from 'mongoose';

export interface ILead {
  leadId: string;
  businessName: string;
  clientName?: string;
  category?: string;
  address?: string;
  city?: string;
  province?: string;
  phone: string;
  alternativePhone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  googleMaps?: string;
  rating?: number;
  reviewCount?: number;
  interestedService?: string;
  requirement?: string;
  estimatedBudget?: number;
  notes?: string;
  leadSource: string;
  leadPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: string;
  referralBdId?: string;
  referralCode?: string;
  assignedBdId?: string;
  assignedBdName?: string;
  assignedDate?: string;
  submittedBy?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const leadSchema = new Schema<ILead>(
  {
    leadId: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true },
    clientName: { type: String, default: '' },
    category: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    province: { type: String, default: '' },
    phone: { type: String, required: true },
    alternativePhone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    googleMaps: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    interestedService: { type: String, default: '' },
    requirement: { type: String, default: '' },
    estimatedBudget: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    leadSource: { type: String, default: 'ADMIN' },
    leadPriority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    status: { type: String, default: 'NEW' },
    referralBdId: { type: String, default: '' },
    referralCode: { type: String, default: '' },
    assignedBdId: { type: String, default: '' },
    assignedBdName: { type: String, default: '' },
    assignedDate: { type: String, default: '' },
    submittedBy: { type: String, default: '' },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ assignedBdId: 1, createdAt: -1 });
leadSchema.index({ referralBdId: 1 });

export const LeadModel: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);

export default LeadModel;
