import { z } from 'zod';

const universityRoomFields = {
  name: z
    .string()
    .trim()
    .min(1, 'El nombre de la sala es obligatorio')
    .max(150, 'El nombre no puede superar los 150 caracteres'),

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
    .min(1, 'La descripción es obligatoria')
    .max(1000, 'La descripción no puede superar los 1000 caracteres'),

  isActive: z.boolean().default(true),
};

export const createUniversityRoomSchema = z
  .object(universityRoomFields)
  .strict()
  .superRefine((data, context) => {
    if (data.latitude === 0 && data.longitude === 0) {
      context.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'Añade unas coordenadas válidas para la sala',
      });
    }
  });

export const updateUniversityRoomSchema = z
  .object({
    name: universityRoomFields.name.optional(),
    address: universityRoomFields.address.optional(),
    latitude: universityRoomFields.latitude.optional(),
    longitude: universityRoomFields.longitude.optional(),
    googleMapsUrl: universityRoomFields.googleMapsUrl.optional(),
    description: universityRoomFields.description.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  );
