import mongoose, { Schema, Model } from 'mongoose';

export interface IBDProfile {
  userId?: string;
  bdId?: string;
  referralCode?: string;
  fullName: string;
  nicPassport?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address?: string;
  city?: string;
  province?: string;
  profilePhoto?: string;
  companyName?: string;
  jobPosition?: string;
  industry?: string;
  experience?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  previousExperience?: string;
  preferredServices?: string[];
  expectedMonthlyReferrals?: string;
  howHeardAboutUs?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  adminNotes?: string;
  agreedToTerms: boolean;
  agreedToReferralProgram: boolean;
  agreedToPrivacyPolicy: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const bdProfileSchema = new Schema<IBDProfile>(
  {
    userId: { type: String, default: '' },
    bdId: { type: String, default: '', index: true },
    referralCode: { type: String, default: '', unique: true, sparse: true, index: true },
    fullName: { type: String, required: true },
    nicPassport: { type: String, default: '' },
    phone: { type: String, required: true },
    whatsapp: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    province: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    companyName: { type: String, default: '' },
    jobPosition: { type: String, default: '' },
    industry: { type: String, default: '' },
    experience: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    previousExperience: { type: String, default: '' },
    preferredServices: { type: [String], default: [] },
    expectedMonthlyReferrals: { type: String, default: '' },
    howHeardAboutUs: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    verifiedAt: { type: String, default: '' },
    verifiedBy: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    agreedToTerms: { type: Boolean, default: false },
    agreedToReferralProgram: { type: Boolean, default: false },
    agreedToPrivacyPolicy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BDProfileModel: Model<IBDProfile> =
  mongoose.models.BDProfile || mongoose.model<IBDProfile>('BDProfile', bdProfileSchema);

export default BDProfileModel;
