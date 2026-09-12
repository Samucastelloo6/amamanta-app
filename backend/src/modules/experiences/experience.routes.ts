import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
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

experienceRouter.post(
  '/',
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
