import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createFeedbackController,
  getAllFeedbackController,
  markFeedbackAsReviewedController,
} from './feedback.controller.js';
import { createFeedbackSchema } from './feedback.validation.js';

const feedbackRouter = Router();

feedbackRouter.post(
  '/',
  validate(createFeedbackSchema),
  createFeedbackController,
);

feedbackRouter.get('/', requireAuth, getAllFeedbackController);

feedbackRouter.patch(
  '/:id/reviewed',
  requireAuth,
  markFeedbackAsReviewedController,
);

export default feedbackRouter;
