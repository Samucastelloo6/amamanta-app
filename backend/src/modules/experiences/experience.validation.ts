import { z } from 'zod';

import { experienceTypes } from './experience.model.js';

export const createExperienceSchema = z
  .object({
    type: z.enum(experienceTypes),

    rating: z
      .number()
      .int('La valoración debe ser un número entero')
      .min(1, 'Selecciona una valoración entre 1 y 5')
      .max(5, 'Selecciona una valoración entre 1 y 5'),

    text: z
      .string()
      .trim()
      .max(2000, 'La experiencia no puede superar los 2000 caracteres')
      .optional(),

    improvement: z
      .string()
      .trim()
      .max(2000, 'La propuesta de mejora no puede superar los 2000 caracteres')
      .optional(),
  })
  .strict();
