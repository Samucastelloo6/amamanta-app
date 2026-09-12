import { type HydratedDocument, model, Schema } from 'mongoose';

export const analyticsSections = [
  'home',
  'events',
  'workshops',
  'universityRooms',
  'hospitals',
  'friendlySpaces',
  'contact',
  'collaborate',
  'feedback',
] as const;

export type AnalyticsSection = (typeof analyticsSections)[number];

export interface AnalyticsSectionsDocument {
  home: number;
  events: number;
  workshops: number;
  universityRooms: number;
  hospitals: number;
  friendlySpaces: number;
  contact: number;
  collaborate: number;
  feedback: number;
}

export interface AnalyticsDocument {
  date: string;

  visits: number;
  pageViews: number;

  sections: AnalyticsSectionsDocument;

  /*
   * Marca los días registrados con el contador de visitantes únicos. Los días
   * anteriores contaban cada pestaña y cada bot, así que sus cifras no son
   * comparables y el panel lo advierte.
   */
  reliable: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type AnalyticsHydratedDocument = HydratedDocument<AnalyticsDocument>;

const analyticsSectionsSchema = new Schema<AnalyticsSectionsDocument>(
  {
    home: {
      type: Number,
      default: 0,
      min: 0,
    },

    events: {
      type: Number,
      default: 0,
      min: 0,
    },

    workshops: {
      type: Number,
      default: 0,
      min: 0,
    },

    universityRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    hospitals: {
      type: Number,
      default: 0,
      min: 0,
    },

    friendlySpaces: {
      type: Number,
      default: 0,
      min: 0,
    },

    contact: {
      type: Number,
      default: 0,
      min: 0,
    },

    collaborate: {
      type: Number,
      default: 0,
      min: 0,
    },

    feedback: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const analyticsSchema = new Schema<AnalyticsDocument>(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    visits: {
      type: Number,
      default: 0,
      min: 0,
    },

    pageViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    reliable: {
      type: Boolean,
      default: false,
      index: true,
    },

    sections: {
      type: analyticsSectionsSchema,
      required: true,
      default: () => ({
        home: 0,
        events: 0,
        workshops: 0,
        universityRooms: 0,
        hospitals: 0,
        friendlySpaces: 0,
        contact: 0,
        collaborate: 0,
        feedback: 0,
      }),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const AnalyticsModel = model<AnalyticsDocument>(
  'Analytics',
  analyticsSchema,
);
