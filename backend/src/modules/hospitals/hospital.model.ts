import { type HydratedDocument, model, Schema } from 'mongoose';

export interface HospitalDocument {
  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  schedule: string;
  description: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type HospitalHydratedDocument = HydratedDocument<HospitalDocument>;

const hospitalSchema = new Schema<HospitalDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
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

    schedule: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
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

hospitalSchema.index({
  name: 1,
});

export const HospitalModel = model<HospitalDocument>(
  'Hospital',
  hospitalSchema,
);
