import { type HydratedDocument, model, Schema } from 'mongoose';

export type WorkshopDay =
  | 'lunes'
  | 'martes'
  | 'miércoles'
  | 'jueves'
  | 'viernes';

export type WorkshopTime = 'morning' | 'afternoon';

export type WorkshopMode = 'presential' | 'online';

export type WorkshopStatus = 'open' | 'temporarily_closed';

export type WorkshopClosureType = 'specific_days' | 'temporary';

export interface WorkshopContact {
  name: string;
  phone: string;
}

export interface WorkshopDocument {
  name: string;

  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;

  day: WorkshopDay;
  time: WorkshopTime;
  schedule: string;

  contacts: WorkshopContact[];

  notes: string;

  mode: WorkshopMode;
  status: WorkshopStatus;

  closureType?: WorkshopClosureType;
  closureMessage: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type WorkshopHydratedDocument = HydratedDocument<WorkshopDocument>;

const workshopContactSchema = new Schema<WorkshopContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
  },
  {
    _id: false,
  },
);

const workshopSchema = new Schema<WorkshopDocument>(
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
      trim: true,
      default: '',
    },

    day: {
      type: String,
      required: true,
      enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
      index: true,
    },

    time: {
      type: String,
      required: true,
      enum: ['morning', 'afternoon'],
      index: true,
    },

    schedule: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    contacts: {
      type: [workshopContactSchema],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },

    mode: {
      type: String,
      enum: ['presential', 'online'],
      default: 'presential',
      index: true,
    },

    status: {
      type: String,
      enum: ['open', 'temporarily_closed'],
      default: 'open',
      index: true,
    },

    closureType: {
      type: String,
      enum: ['specific_days', 'temporary'],
      required: false,
    },

    closureMessage: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
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

workshopSchema.index({
  day: 1,
  time: 1,
  schedule: 1,
});

workshopSchema.index({
  isActive: 1,
  day: 1,
  time: 1,
});

export const WorkshopModel = model<WorkshopDocument>(
  'Workshop',
  workshopSchema,
);
