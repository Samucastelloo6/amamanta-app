import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventFields = {
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(150, 'El título no puede superar los 150 caracteres'),

  date: z
    .string()
    .trim()
    .min(1, 'La fecha es obligatoria')
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      'La fecha no tiene un formato válido',
    ),

  startTime: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || timeRegex.test(value),
      'La hora debe tener el formato HH:mm',
    ),

  location: z
    .string()
    .trim()
    .min(1, 'La ubicación es obligatoria')
    .max(200, 'La ubicación no puede superar los 200 caracteres'),

  googleMapsUrl: z.url('La URL de Google Maps no es válida').trim(),

  description: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),

  requiresRegistration: z.boolean().optional().default(false),

  isActive: z.boolean().optional().default(true),
};

export const createEventSchema = z.object(eventFields).strict();

export const updateEventSchema = z
  .object({
    title: eventFields.title.optional(),
    date: eventFields.date.optional(),
    startTime: eventFields.startTime.optional(),
    location: eventFields.location.optional(),
    googleMapsUrl: eventFields.googleMapsUrl.optional(),
    description: eventFields.description.optional(),
    requiresRegistration: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  );
