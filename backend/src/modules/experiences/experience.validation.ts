import { z } from 'zod';

import { experienceTypes } from './experience.model.js';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const ratingSchema = z
  .number()
  .int('La valoración debe ser un número entero')
  .min(1, 'Selecciona una valoración entre 1 y 5')
  .max(5, 'Selecciona una valoración entre 1 y 5');

const textSchema = z
  .string()
  .trim()
  .max(2000, 'La experiencia no puede superar los 2000 caracteres');

const improvementSchema = z
  .string()
  .trim()
  .max(2000, 'La propuesta de mejora no puede superar los 2000 caracteres');

const workshopIdSchema = z
  .string()
  .trim()
  .regex(objectIdPattern, 'El taller seleccionado no es válido');

/*
 * Estos esquemas solo comprueban la forma de cada campo por separado.
 * Las reglas que cruzan campos (el taller es obligatorio en las experiencias
 * de talleres y no se admite en el resto) viven en el servicio, junto a la
 * comprobación de que el taller existe y está activo.
 */
export const createExperienceSchema = z
  .object({
    type: z.enum(experienceTypes),

    rating: ratingSchema,

    text: textSchema.optional(),

    improvement: improvementSchema.optional(),

    workshopId: workshopIdSchema.optional(),
  })
  .strict();

/*
 * Edición desde el panel de administración. Todos los campos son opcionales:
 * solo se modifica lo que llega. Un texto vacío elimina ese campo, y el tipo
 * de la experiencia no se puede cambiar.
 */
export const updateExperienceSchema = z
  .object({
    rating: ratingSchema.optional(),

    text: textSchema.optional(),

    improvement: improvementSchema.optional(),

    workshopId: workshopIdSchema.optional(),
  })
  .strict();
