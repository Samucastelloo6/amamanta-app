import { type HydratedDocument, model, Schema } from 'mongoose';

export type EventMode = 'presential' | 'online';

export const eventOnlinePlatforms = ['zoom', 'meet', 'teams', 'other'] as const;

export type EventOnlinePlatform = (typeof eventOnlinePlatforms)[number];

export interface EventDocument {
  title: string;
  date: Date;
  startTime: string;

  mode: EventMode;

  /*
   * Lugar y mapa solo se rellenan en los eventos presenciales; plataforma,
   * enlace y código solo en los online. La obligatoriedad de cada bloque se
   * comprueba en la validación, según la modalidad.
   */
  location: string;
  googleMapsUrl: string;

  onlinePlatform?: EventOnlinePlatform;
  onlineUrl: string;
  onlineCode: string;

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
      trim: true,
      default: '',
    },

    mode: {
      type: String,
      enum: ['presential', 'online'],
      default: 'presential',
      index: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },

    googleMapsUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    onlinePlatform: {
      type: String,
      enum: eventOnlinePlatforms,
      required: false,
    },

    onlineUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    onlineCode: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
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
