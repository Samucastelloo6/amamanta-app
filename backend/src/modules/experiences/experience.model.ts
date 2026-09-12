import { type HydratedDocument, model, Schema, type Types } from 'mongoose';

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

  workshopId?: Types.ObjectId;
  workshopName?: string;

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

    /*
     * Taller valorado. Solo se rellena cuando el tipo es 'workshops'.
     * Guardamos también el nombre en el momento del envío para que la
     * experiencia siga siendo legible aunque el taller se renombre o se
     * elimine más adelante.
     */
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: 'Workshop',
      required: false,
      index: true,
    },

    workshopName: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
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

experienceSchema.index({
  type: 1,
  workshopId: 1,
  createdAt: -1,
});

export const ExperienceModel = model<ExperienceDocument>(
  'Experience',
  experienceSchema,
);
