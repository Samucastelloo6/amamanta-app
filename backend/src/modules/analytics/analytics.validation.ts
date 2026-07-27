import { z } from 'zod';

import { analyticsSections } from './analytics.model.js';

export const registerPageViewSchema = z
  .object({
    section: z.enum(analyticsSections),
  })
  .strict();

export const analyticsSummaryQuerySchema = z.object({
  year: z.coerce.number().int().min(2025).max(2100),

  month: z.coerce.number().int().min(1).max(12).optional(),
});
