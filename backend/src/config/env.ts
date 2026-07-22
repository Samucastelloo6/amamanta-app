import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI es obligatoria'),

  CLIENT_URL: z.url().default('http://localhost:4200'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),

  JWT_EXPIRES_IN: z.enum(['1h', '8h', '24h', '7d']).default('24h'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Variables de entorno inválidas:');
  console.error(z.treeifyError(result.error));

  process.exit(1);
}

export const env = result.data;
