import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createExperienceController,
  deleteExperienceController,
  getAllExperiencesController,
} from './experience.controller.js';
import { createExperienceSchema } from './experience.validation.js';

const experienceRouter = Router();

experienceRouter.get('/', getAllExperiencesController);

experienceRouter.post(
  '/',
  validate(createExperienceSchema),
  createExperienceController,
);

experienceRouter.delete('/:id', requireAuth, deleteExperienceController);

export default experienceRouter;
