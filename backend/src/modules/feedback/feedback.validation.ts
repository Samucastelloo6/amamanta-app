import { z } from 'zod';

import { feedbackCategories } from './feedback.model.js';

export const createFeedbackSchema = z
  .object({
    rating: z
      .number()
      .int('La valoración debe ser un número entero')
      .min(1, 'Selecciona una valoración entre 1 y 5')
      .max(5, 'Selecciona una valoración entre 1 y 5'),

    categories: z
      .array(z.enum(feedbackCategories))
      .max(
        feedbackCategories.length,
        'Se han seleccionado demasiadas categorías',
      )
      .default([]),

    positive: z
      .string()
      .trim()
      .max(2000, 'El comentario no puede superar los 2000 caracteres')
      .optional(),

    improvement: z
      .string()
      .trim()
      .max(2000, 'La propuesta de mejora no puede superar los 2000 caracteres')
      .optional(),
  })
  .strict();
