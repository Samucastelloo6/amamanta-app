import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createFriendlySpaceCategoryController,
  deleteFriendlySpaceCategoryController,
  getAllFriendlySpaceCategoriesController,
  getFriendlySpaceCategoryByKeyController,
  updateFriendlySpaceCategoryController,
} from './friendly-space-category.controller.js';
import {
  createFriendlySpaceCategorySchema,
  updateFriendlySpaceCategorySchema,
} from './friendly-space-category.validation.js';

const friendlySpaceCategoryRouter = Router();

friendlySpaceCategoryRouter.get('/', getAllFriendlySpaceCategoriesController);

friendlySpaceCategoryRouter.get(
  '/:key',
  getFriendlySpaceCategoryByKeyController,
);

friendlySpaceCategoryRouter.post(
  '/',
  requireAuth,
  validate(createFriendlySpaceCategorySchema),
  createFriendlySpaceCategoryController,
);

friendlySpaceCategoryRouter.patch(
  '/:key',
  requireAuth,
  validate(updateFriendlySpaceCategorySchema),
  updateFriendlySpaceCategoryController,
);

friendlySpaceCategoryRouter.delete(
  '/:key',
  requireAuth,
  deleteFriendlySpaceCategoryController,
);

export default friendlySpaceCategoryRouter;
