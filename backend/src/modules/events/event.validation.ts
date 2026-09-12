import { z } from 'zod';

import { eventOnlinePlatforms } from './event.model.js';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

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

  mode: z.enum(['presential', 'online']).default('presential'),

  location: z
    .string()
    .trim()
    .max(200, 'La ubicación no puede superar los 200 caracteres')
    .optional()
    .default(''),

  googleMapsUrl: z
    .string()
    .trim()
    .max(500, 'El enlace de Google Maps es demasiado largo')
    .optional()
    .default(''),

  onlinePlatform: z.enum(eventOnlinePlatforms).optional(),

  onlineUrl: z
    .string()
    .trim()
    .max(500, 'El enlace de la reunión es demasiado largo')
    .optional()
    .default(''),

  onlineCode: z
    .string()
    .trim()
    .max(100, 'El código de acceso no puede superar los 100 caracteres')
    .optional()
    .default(''),

  description: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),

  requiresRegistration: z.boolean().optional().default(false),

  isActive: z.boolean().optional().default(true),
};

export const createEventSchema = z
  .object(eventFields)
  .strict()
  .superRefine((data, context) => {
    if (data.mode === 'presential') {
      if (!data.location) {
        context.addIssue({
          code: 'custom',
          path: ['location'],
          message: 'El lugar es obligatorio en un evento presencial',
        });
      }

      if (!data.googleMapsUrl || !isHttpUrl(data.googleMapsUrl)) {
        context.addIssue({
          code: 'custom',
          path: ['googleMapsUrl'],
          message: 'Añade un enlace de Google Maps válido',
        });
      }

      return;
    }

    if (!data.onlinePlatform) {
      context.addIssue({
        code: 'custom',
        path: ['onlinePlatform'],
        message: 'Selecciona la plataforma de la reunión',
      });
    }

    if (!data.onlineUrl || !isHttpUrl(data.onlineUrl)) {
      context.addIssue({
        code: 'custom',
        path: ['onlineUrl'],
        message: 'Añade un enlace de reunión válido',
      });
    }
  });

export const updateEventSchema = z
  .object({
    title: eventFields.title.optional(),
    date: eventFields.date.optional(),
    startTime: eventFields.startTime.optional(),
    mode: z.enum(['presential', 'online']).optional(),
    location: eventFields.location.optional(),
    googleMapsUrl: eventFields.googleMapsUrl.optional(),
    onlinePlatform: eventFields.onlinePlatform,
    onlineUrl: eventFields.onlineUrl.optional(),
    onlineCode: eventFields.onlineCode.optional(),
    description: eventFields.description.optional(),
    requiresRegistration: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  )
  /*
   * El panel envía siempre el evento completo al editar, así que cuando llega
   * la modalidad se comprueba que el bloque correspondiente esté relleno.
   */
  .superRefine((data, context) => {
    if (data.mode === undefined) {
      return;
    }

    if (data.mode === 'presential') {
      if (!data.location) {
        context.addIssue({
          code: 'custom',
          path: ['location'],
          message: 'El lugar es obligatorio en un evento presencial',
        });
      }

      if (!data.googleMapsUrl || !isHttpUrl(data.googleMapsUrl)) {
        context.addIssue({
          code: 'custom',
          path: ['googleMapsUrl'],
          message: 'Añade un enlace de Google Maps válido',
        });
      }

      return;
    }

    if (!data.onlinePlatform) {
      context.addIssue({
        code: 'custom',
        path: ['onlinePlatform'],
        message: 'Selecciona la plataforma de la reunión',
      });
    }

    if (!data.onlineUrl || !isHttpUrl(data.onlineUrl)) {
      context.addIssue({
        code: 'custom',
        path: ['onlineUrl'],
        message: 'Añade un enlace de reunión válido',
      });
    }
  });
