import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es obligatorio')
      .email('El correo electrónico no tiene un formato válido')
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .max(128, 'La contraseña no puede superar los 128 caracteres'),
  })
  .strict();
