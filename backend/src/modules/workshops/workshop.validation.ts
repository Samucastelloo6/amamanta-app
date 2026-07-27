import { z } from 'zod';

const workshopContactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'El nombre del responsable es obligatorio')
      .max(100, 'El nombre no puede superar los 100 caracteres'),

    phone: z
      .string()
      .trim()
      .min(1, 'El teléfono del responsable es obligatorio')
      .max(30, 'El teléfono no puede superar los 30 caracteres'),
  })
  .strict();

const workshopFields = {
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del taller es obligatorio')
    .max(150, 'El nombre no puede superar los 150 caracteres'),

  address: z
    .string()
    .trim()
    .max(250, 'La dirección no puede superar los 250 caracteres')
    .default(''),

  latitude: z
    .number()
    .min(-90, 'La latitud debe estar entre -90 y 90')
    .max(90, 'La latitud debe estar entre -90 y 90'),

  longitude: z
    .number()
    .min(-180, 'La longitud debe estar entre -180 y 180')
    .max(180, 'La longitud debe estar entre -180 y 180'),

  googleMapsUrl: z
    .union([z.literal(''), z.url('El enlace de Google Maps no es válido')])
    .default(''),

  day: z.enum(['lunes', 'martes', 'miércoles', 'jueves', 'viernes']),

  time: z.enum(['morning', 'afternoon']),

  schedule: z
    .string()
    .trim()
    .min(1, 'El horario del taller es obligatorio')
    .max(100, 'El horario no puede superar los 100 caracteres'),

  contacts: z.array(workshopContactSchema).default([]),

  notes: z
    .string()
    .trim()
    .max(2000, 'Las notas no pueden superar los 2000 caracteres')
    .optional()
    .default(''),

  mode: z.enum(['presential', 'online']).default('presential'),

  status: z.enum(['open', 'temporarily_closed']).default('open'),

  closureType: z.enum(['specific_days', 'temporary']).optional(),

  closureMessage: z
    .string()
    .trim()
    .max(500, 'El mensaje de cierre no puede superar los 500 caracteres')
    .optional()
    .default(''),

  isActive: z.boolean().default(true),
};

export const createWorkshopSchema = z
  .object(workshopFields)
  .strict()
  .superRefine((data, context) => {
    if (data.mode === 'presential' && !data.address) {
      context.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'La dirección es obligatoria para un taller presencial',
      });
    }

    if (
      data.mode === 'presential' &&
      data.latitude === 0 &&
      data.longitude === 0
    ) {
      context.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'Añade unas coordenadas válidas para el taller presencial',
      });
    }

    if (data.status === 'temporarily_closed' && !data.closureType) {
      context.addIssue({
        code: 'custom',
        path: ['closureType'],
        message: 'Selecciona el tipo de cierre',
      });
    }

    if (data.status === 'temporarily_closed' && !data.closureMessage) {
      context.addIssue({
        code: 'custom',
        path: ['closureMessage'],
        message: 'Indica el motivo o los días del cierre',
      });
    }
  });

export const updateWorkshopSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'El nombre del taller es obligatorio')
      .max(150, 'El nombre no puede superar los 150 caracteres')
      .optional(),

    address: z
      .string()
      .trim()
      .max(250, 'La dirección no puede superar los 250 caracteres')
      .optional(),

    latitude: z
      .number()
      .min(-90, 'La latitud debe estar entre -90 y 90')
      .max(90, 'La latitud debe estar entre -90 y 90')
      .optional(),

    longitude: z
      .number()
      .min(-180, 'La longitud debe estar entre -180 y 180')
      .max(180, 'La longitud debe estar entre -180 y 180')
      .optional(),

    googleMapsUrl: z
      .union([z.literal(''), z.url('El enlace de Google Maps no es válido')])
      .optional(),

    day: z
      .enum(['lunes', 'martes', 'miércoles', 'jueves', 'viernes'])
      .optional(),

    time: z.enum(['morning', 'afternoon']).optional(),

    schedule: z
      .string()
      .trim()
      .min(1, 'El horario del taller es obligatorio')
      .max(100, 'El horario no puede superar los 100 caracteres')
      .optional(),

    contacts: z.array(workshopContactSchema).optional(),

    notes: z
      .string()
      .trim()
      .max(2000, 'Las notas no pueden superar los 2000 caracteres')
      .optional(),

    mode: z.enum(['presential', 'online']).optional(),

    status: z.enum(['open', 'temporarily_closed']).optional(),

    closureType: z.enum(['specific_days', 'temporary']).optional(),

    closureMessage: z
      .string()
      .trim()
      .max(500, 'El mensaje de cierre no puede superar los 500 caracteres')
      .optional(),

    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  )
  .superRefine((data, context) => {
    if (data.mode === 'presential' && data.address === '') {
      context.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'La dirección es obligatoria para un taller presencial',
      });
    }

    if (data.status === 'temporarily_closed' && data.closureMessage === '') {
      context.addIssue({
        code: 'custom',
        path: ['closureMessage'],
        message: 'Indica el motivo o los días del cierre',
      });
    }
  });
