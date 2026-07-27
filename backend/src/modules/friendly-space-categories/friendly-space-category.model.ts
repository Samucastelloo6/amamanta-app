import { type HydratedDocument, model, Schema } from 'mongoose';

export interface FriendlySpaceCategoryDocument {
  key: string;
  name: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type FriendlySpaceCategoryHydratedDocument =
  HydratedDocument<FriendlySpaceCategoryDocument>;

const friendlySpaceCategorySchema = new Schema<FriendlySpaceCategoryDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 80,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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

friendlySpaceCategorySchema.index({
  name: 1,
});

export const FriendlySpaceCategoryModel = model<FriendlySpaceCategoryDocument>(
  'FriendlySpaceCategory',
  friendlySpaceCategorySchema,
);
