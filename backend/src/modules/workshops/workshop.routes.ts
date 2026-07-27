import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createWorkshopController,
  deleteWorkshopController,
  getAllWorkshopsController,
  getWorkshopByIdController,
  updateWorkshopController,
} from './workshop.controller.js';
import {
  createWorkshopSchema,
  updateWorkshopSchema,
} from './workshop.validation.js';

const workshopRouter = Router();

workshopRouter.get('/', getAllWorkshopsController);

workshopRouter.get('/:id', getWorkshopByIdController);

workshopRouter.post(
  '/',
  requireAuth,
  validate(createWorkshopSchema),
  createWorkshopController,
);

workshopRouter.patch(
  '/:id',
  requireAuth,
  validate(updateWorkshopSchema),
  updateWorkshopController,
);

workshopRouter.delete('/:id', requireAuth, deleteWorkshopController);

export default workshopRouter;
