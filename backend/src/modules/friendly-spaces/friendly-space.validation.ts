import { z } from 'zod';

const friendlySpaceFields = {
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del espacio es obligatorio')
    .max(150, 'El nombre no puede superar los 150 caracteres'),

  categoryId: z
    .string()
    .trim()
    .min(1, 'La categoría es obligatoria')
    .max(80, 'La categoría no es válida'),

  address: z
    .string()
    .trim()
    .min(1, 'La dirección es obligatoria')
    .max(250, 'La dirección no puede superar los 250 caracteres'),

  latitude: z
    .number()
    .min(-90, 'La latitud debe estar entre -90 y 90')
    .max(90, 'La latitud debe estar entre -90 y 90'),

  longitude: z
    .number()
    .min(-180, 'La longitud debe estar entre -180 y 180')
    .max(180, 'La longitud debe estar entre -180 y 180'),

  googleMapsUrl: z.url('El enlace de Google Maps no es válido'),

  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede superar los 1000 caracteres')
    .default(''),

  isActive: z.boolean().default(true),
};

export const createFriendlySpaceSchema = z
  .object(friendlySpaceFields)
  .strict()
  .superRefine((data, context) => {
    if (data.latitude === 0 && data.longitude === 0) {
      context.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'Añade unas coordenadas válidas para el espacio',
      });
    }
  });

export const updateFriendlySpaceSchema = z
  .object({
    name: friendlySpaceFields.name.optional(),
    categoryId: friendlySpaceFields.categoryId.optional(),

    address: friendlySpaceFields.address.optional(),

    latitude: friendlySpaceFields.latitude.optional(),
    longitude: friendlySpaceFields.longitude.optional(),

    googleMapsUrl: friendlySpaceFields.googleMapsUrl.optional(),

    description: friendlySpaceFields.description.optional(),

    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  );
