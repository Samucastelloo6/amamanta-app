import { type HydratedDocument, model, Schema } from 'mongoose';

export interface UniversityRoomDocument {
  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type UniversityRoomHydratedDocument =
  HydratedDocument<UniversityRoomDocument>;

const universityRoomSchema = new Schema<UniversityRoomDocument>(
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

    description: {
      type: String,
      required: true,
      trim: true,
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

universityRoomSchema.index({
  name: 1,
});

export const UniversityRoomModel = model<UniversityRoomDocument>(
  'UniversityRoom',
  universityRoomSchema,
);
