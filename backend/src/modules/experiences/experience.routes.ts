import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { publicFormLimiter } from '../../middlewares/rate-limit.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createExperienceController,
  deleteExperienceController,
  getAllExperiencesController,
  updateExperienceController,
} from './experience.controller.js';
import {
  createExperienceSchema,
  updateExperienceSchema,
} from './experience.validation.js';

const experienceRouter = Router();

experienceRouter.get('/', getAllExperiencesController);

/*
 * Público: lo envía el formulario de valoración. Con límite por IP para que
 * nadie pueda llenar la web de valoraciones automáticas.
 */
experienceRouter.post(
  '/',
  publicFormLimiter,
  validate(createExperienceSchema),
  createExperienceController,
);

experienceRouter.patch(
  '/:id',
  requireAuth,
  validate(updateExperienceSchema),
  updateExperienceController,
);

experienceRouter.delete('/:id', requireAuth, deleteExperienceController);

export default experienceRouter;
