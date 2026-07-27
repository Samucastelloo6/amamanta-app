import { z } from 'zod';

const hospitalFields = {
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del hospital es obligatorio')
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

  schedule: z
    .string()
    .trim()
    .min(1, 'El horario del voluntariado es obligatorio')
    .max(300, 'El horario no puede superar los 300 caracteres'),

  description: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria')
    .max(1500, 'La descripción no puede superar los 1500 caracteres'),

  isActive: z.boolean().default(true),
};

export const createHospitalSchema = z
  .object(hospitalFields)
  .strict()
  .superRefine((data, context) => {
    if (data.latitude === 0 && data.longitude === 0) {
      context.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'Añade unas coordenadas válidas para el hospital',
      });
    }
  });

export const updateHospitalSchema = z
  .object({
    name: hospitalFields.name.optional(),
    address: hospitalFields.address.optional(),
    latitude: hospitalFields.latitude.optional(),
    longitude: hospitalFields.longitude.optional(),
    googleMapsUrl: hospitalFields.googleMapsUrl.optional(),
    schedule: hospitalFields.schedule.optional(),
    description: hospitalFields.description.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  );
