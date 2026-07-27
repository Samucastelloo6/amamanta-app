import { type HydratedDocument, model, Schema } from 'mongoose';

export interface FriendlySpaceDocument {
  name: string;
  categoryKey: string;

  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type FriendlySpaceHydratedDocument =
  HydratedDocument<FriendlySpaceDocument>;

const friendlySpaceSchema = new Schema<FriendlySpaceDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    categoryKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    googleMapsUrl: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

friendlySpaceSchema.index({
  name: 1,
});

friendlySpaceSchema.index({
  categoryKey: 1,
  name: 1,
});

export const FriendlySpaceModel = model<FriendlySpaceDocument>(
  'FriendlySpace',
  friendlySpaceSchema,
);
