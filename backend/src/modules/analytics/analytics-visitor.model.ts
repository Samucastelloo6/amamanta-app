import { model, Schema } from 'mongoose';

/*
 * Registro efímero para saber si un visitante ya se ha contado hoy.
 *
 * No guarda ningún dato personal: solo una fecha y un identificador anónimo
 * irreversible. Los registros se borran solos a los 40 días, porque pasado el
 * día al que pertenecen ya no sirven para nada.
 */
export interface AnalyticsVisitorDocument {
  date: string;
  visitorHash: string;
  createdAt: Date;
}

const analyticsVisitorSchema = new Schema<AnalyticsVisitorDocument>(
  {
    date: {
      type: String,
      required: true,
    },

    visitorHash: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
  },
);

/*
 * El índice único es lo que hace de contador: si la inserción falla por clave
 * duplicada, es que esa persona ya estaba contada hoy.
 */
analyticsVisitorSchema.index(
  {
    date: 1,
    visitorHash: 1,
  },
  {
    unique: true,
  },
);

analyticsVisitorSchema.index(
  {
    createdAt: 1,
  },
  {
    expireAfterSeconds: 60 * 60 * 24 * 40,
  },
);

export const AnalyticsVisitorModel = model<AnalyticsVisitorDocument>(
  'AnalyticsVisitor',
  analyticsVisitorSchema,
);
