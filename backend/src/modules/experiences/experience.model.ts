import { type HydratedDocument, model, Schema } from 'mongoose';

export const experienceTypes = [
  'workshops',
  'rooms',
  'friendly-spaces',
  'hospitals',
] as const;

export type ExperienceType = (typeof experienceTypes)[number];

export interface ExperienceDocument {
  type: ExperienceType;

  rating: number;

  text?: string;
  improvement?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type ExperienceHydratedDocument = HydratedDocument<ExperienceDocument>;

const experienceSchema = new Schema<ExperienceDocument>(
  {
    type: {
      type: String,
      enum: experienceTypes,
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    improvement: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

experienceSchema.index({
  type: 1,
  createdAt: -1,
});

export const ExperienceModel = model<ExperienceDocument>(
  'Experience',
  experienceSchema,
);
