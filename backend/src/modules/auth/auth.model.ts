import { model, Schema } from 'mongoose';

export interface AdminDocument {
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const AdminModel = model<AdminDocument>('Admin', adminSchema);
