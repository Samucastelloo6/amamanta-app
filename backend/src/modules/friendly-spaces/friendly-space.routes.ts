import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createFriendlySpaceController,
  deleteFriendlySpaceController,
  getAllFriendlySpacesController,
  getFriendlySpaceByIdController,
  updateFriendlySpaceController,
} from './friendly-space.controller.js';
import {
  createFriendlySpaceSchema,
  updateFriendlySpaceSchema,
} from './friendly-space.validation.js';

const friendlySpaceRouter = Router();

friendlySpaceRouter.get('/', getAllFriendlySpacesController);

friendlySpaceRouter.get('/:id', getFriendlySpaceByIdController);

friendlySpaceRouter.post(
  '/',
  requireAuth,
  validate(createFriendlySpaceSchema),
  createFriendlySpaceController,
);

friendlySpaceRouter.patch(
  '/:id',
  requireAuth,
  validate(updateFriendlySpaceSchema),
  updateFriendlySpaceController,
);

friendlySpaceRouter.delete('/:id', requireAuth, deleteFriendlySpaceController);

export default friendlySpaceRouter;
