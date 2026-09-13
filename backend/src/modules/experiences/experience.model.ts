import { type HydratedDocument, model, Schema, type Types } from 'mongoose';

export const experienceTypes = [
  'workshops',
  'rooms',
  'friendly-spaces',
  'hospitals',
] as const;

export type ExperienceType = (typeof experienceTypes)[number];

/*
 * En talleres, hospitales y salas el sitio se elige de una lista, y su nombre
 * se copia del registro real.
 *
 * Los espacios amigos no: son muchos, cambian a menudo y una familia puede
 * haber estado en uno que todavía no está dado de alta. Ahí quien valora
 * escribe el nombre del sitio si quiere, y las valoraciones no se agrupan.
 */
export function usesPlaceList(type: ExperienceType): boolean {
  return type !== 'friendly-spaces';
}

export interface ExperienceDocument {
  type: ExperienceType;

  rating: number;

  /*
   * Nombre de quien valora. Es opcional: si no se rellena, la valoración se
   * muestra como anónima.
   */
  authorName?: string;

  text?: string;
  improvement?: string;

  /*
   * Sitio valorado: el taller, el hospital, la sala universitaria o el espacio
   * amigo, según el tipo. No lleva `ref` porque apunta a una colección
   * distinta en cada caso; por eso guardamos también el nombre en el momento
   * del envío, que además mantiene la valoración legible aunque el sitio se
   * renombre o se elimine más adelante.
   */
  placeId?: Types.ObjectId;
  placeName?: string;

  /*
   * Campos anteriores, de cuando esto solo existía para talleres. Se conservan
   * para poder leer lo guardado antes del cambio. El script
   * `npm run migrate:experiences` los pasa a placeId/placeName; una vez
   * ejecutado, se pueden borrar de aquí.
   */
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

    authorName: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60,
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

    placeId: {
      type: Schema.Types.ObjectId,
      required: false,
      index: true,
    },

    placeName: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },

    workshopId: {
      type: Schema.Types.ObjectId,
      required: false,
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
  placeId: 1,
  createdAt: -1,
});

export const ExperienceModel = model<ExperienceDocument>(
  'Experience',
  experienceSchema,
);
