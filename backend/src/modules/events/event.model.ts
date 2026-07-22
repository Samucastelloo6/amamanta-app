import { type HydratedDocument, model, Schema } from 'mongoose';

export interface EventDocument {
  title: string;
  date: Date;
  startTime: string;
  location: string;
  googleMapsUrl: string;
  description: string;
  requiresRegistration: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventHydratedDocument = HydratedDocument<EventDocument>;

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
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
      maxlength: 2000,
    },

    requiresRegistration: {
      type: Boolean,
      default: false,
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

eventSchema.index({ date: 1, startTime: 1 });
eventSchema.index({ isActive: 1, date: 1 });

export const EventModel = model<EventDocument>('Event', eventSchema);
