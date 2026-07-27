import { type HydratedDocument, model, Schema } from 'mongoose';

export interface ContactEmailDocument {
  id: string;
  title: string;
  description: string;
  email: string;
}

export interface ContactPhoneDocument {
  id: string;
  name: string;
  description: string;
  phone: string;
}

export interface ContactLocationDocument {
  title: string;
  building: string;
  floor: string;
  address: string;
  description: string;

  latitude: number;
  longitude: number;
}

export interface ContactDocument {
  key: string;

  emails: ContactEmailDocument[];
  phones: ContactPhoneDocument[];
  location: ContactLocationDocument;

  createdAt: Date;
  updatedAt: Date;
}

export type ContactHydratedDocument = HydratedDocument<ContactDocument>;

const contactEmailSchema = new Schema<ContactEmailDocument>(
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

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    _id: false,
  },
);

const contactPhoneSchema = new Schema<ContactPhoneDocument>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const contactLocationSchema = new Schema<ContactLocationDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    building: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
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
  },
  {
    _id: false,
  },
);

const contactSchema = new Schema<ContactDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },

    emails: {
      type: [contactEmailSchema],
      required: true,
      default: [],
    },

    phones: {
      type: [contactPhoneSchema],
      required: true,
      default: [],
    },

    location: {
      type: contactLocationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactModel = model<ContactDocument>('Contact', contactSchema);
