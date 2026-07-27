import { type HydratedDocument, model, Schema } from 'mongoose';

export const feedbackCategories = [
  'Toda la aplicación',
  'Salas lactancia UV',
  'Talleres LM',
  'Espacios amigos LM',
  'Actividades',
  'Facilidad de uso',
] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number];

export interface FeedbackDocument {
  rating: number;
  categories: FeedbackCategory[];

  positive?: string;
  improvement?: string;

  isReviewed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type FeedbackHydratedDocument = HydratedDocument<FeedbackDocument>;

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    categories: {
      type: [String],
      enum: feedbackCategories,
      default: [],
    },

    positive: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    improvement: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    isReviewed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

feedbackSchema.index({
  createdAt: -1,
});

export const FeedbackModel = model<FeedbackDocument>(
  'Feedback',
  feedbackSchema,
);
