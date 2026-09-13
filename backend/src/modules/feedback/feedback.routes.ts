import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { publicFormLimiter } from '../../middlewares/rate-limit.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createFeedbackController,
  getAllFeedbackController,
  markFeedbackAsReviewedController,
} from './feedback.controller.js';
import { createFeedbackSchema } from './feedback.validation.js';

const feedbackRouter = Router();

/*
 * Público: lo envía la pantalla «Valora la aplicación». Con límite por IP para
 * que nadie pueda llenarla de envíos automáticos.
 */
feedbackRouter.post(
  '/',
  publicFormLimiter,
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
