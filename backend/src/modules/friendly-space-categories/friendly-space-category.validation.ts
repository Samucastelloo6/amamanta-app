import { z } from 'zod';

const categoryFields = {
  name: z
    .string()
    .trim()
    .min(1, 'El nombre de la categoría es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  isActive: z.boolean().default(true),
};

export const createFriendlySpaceCategorySchema = z
  .object(categoryFields)
  .strict();

export const updateFriendlySpaceCategorySchema = z
  .object({
    name: categoryFields.name.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo para actualizar',
  );
