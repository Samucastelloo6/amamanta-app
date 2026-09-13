import { z } from 'zod';

import { experienceTypes } from './experience.model.js';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const ratingSchema = z
  .number()
  .int('La valoración debe ser un número entero')
  .min(1, 'Selecciona una valoración entre 1 y 5')
  .max(5, 'Selecciona una valoración entre 1 y 5');

const authorNameSchema = z
  .string()
  .trim()
  .max(60, 'El nombre no puede superar los 60 caracteres');

const textSchema = z
  .string()
  .trim()
  .max(2000, 'La experiencia no puede superar los 2000 caracteres');

const improvementSchema = z
  .string()
  .trim()
  .max(2000, 'La propuesta de mejora no puede superar los 2000 caracteres');

const placeIdSchema = z
  .string()
  .trim()
  .regex(objectIdPattern, 'El sitio seleccionado no es válido');

/*
 * Solo lo usan los espacios amigos, donde el sitio se escribe a mano. En el
 * resto de tipos el nombre se copia del registro real y lo que mande el
 * cliente se ignora.
 */
const placeNameSchema = z
  .string()
  .trim()
  .max(150, 'El nombre del sitio no puede superar los 150 caracteres');

/*
 * Estos esquemas solo comprueban la forma de cada campo por separado.
 * Las reglas que cruzan campos (el sitio es obligatorio, y tiene que existir y
 * estar activo en la colección que corresponde al tipo) viven en el servicio.
 */
export const createExperienceSchema = z
  .object({
    type: z.enum(experienceTypes),

    rating: ratingSchema,

    authorName: authorNameSchema.optional(),

    text: textSchema.optional(),

    improvement: improvementSchema.optional(),

    placeId: placeIdSchema.optional(),

    placeName: placeNameSchema.optional(),

    /*
     * Nombre anterior de placeId. Se acepta para no rechazar lo que envía la
     * versión antigua de la app: quien la tenga instalada sigue usándola hasta
     * que pasa por Inicio y pulsa «Actualizar». Se puede quitar cuando se
     * active REQUIRE_PLACE_ON_CREATE.
     */
    workshopId: placeIdSchema.optional(),
  })
  .strict();

/*
 * Edición desde el panel de administración. Todos los campos son opcionales:
 * solo se modifica lo que llega. Un texto vacío elimina ese campo (también
 * sirve para dejar una valoración como anónima), y el tipo de la experiencia
 * no se puede cambiar.
 */
export const updateExperienceSchema = z
  .object({
    rating: ratingSchema.optional(),

    authorName: authorNameSchema.optional(),

    text: textSchema.optional(),

    improvement: improvementSchema.optional(),

    placeId: placeIdSchema.optional(),

    placeName: placeNameSchema.optional(),

    /* Igual que arriba: alias del nombre anterior. */
    workshopId: placeIdSchema.optional(),
  })
  .strict();
