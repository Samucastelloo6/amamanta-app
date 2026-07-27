import { type HydratedDocument, model, Schema } from 'mongoose';

export interface CollaborateCopyItemDocument {
  label: string;
  value: string;
  copyText: string;
  buttonText: string;
}

export interface CollaborateOptionDocument {
  id: string;
  title: string;
  description: string;

  buttonText?: string;
  url?: string;

  extraInfo: string[];
  copyItems: CollaborateCopyItemDocument[];
}

export interface CollaborateDocument {
  key: string;
  options: CollaborateOptionDocument[];

  createdAt: Date;
  updatedAt: Date;
}

export type CollaborateHydratedDocument = HydratedDocument<CollaborateDocument>;

const collaborateCopyItemSchema = new Schema<CollaborateCopyItemDocument>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    copyText: {
      type: String,
      required: true,
      trim: true,
    },

    buttonText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const collaborateOptionSchema = new Schema<CollaborateOptionDocument>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    buttonText: {
      type: String,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    extraInfo: {
      type: [String],
      default: [],
    },

    copyItems: {
      type: [collaborateCopyItemSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const collaborateSchema = new Schema<CollaborateDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },

    options: {
      type: [collaborateOptionSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CollaborateModel = model<CollaborateDocument>(
  'Collaborate',
  collaborateSchema,
);
