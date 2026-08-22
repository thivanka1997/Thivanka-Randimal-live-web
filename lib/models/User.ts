import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'client';
  status: 'active' | 'inactive';
  clientId?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: 'demo123' },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    clientId: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;
