import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import {
  validate,
  validateQuery,
} from '../../middlewares/validate.middleware.js';
import {
  getAnalyticsSummaryController,
  registerPageViewController,
  registerVisitController,
} from './analytics.controller.js';
import {
  analyticsSummaryQuerySchema,
  registerPageViewSchema,
} from './analytics.validation.js';

const analyticsRouter = Router();

analyticsRouter.post('/visit', registerVisitController);

analyticsRouter.post(
  '/page-view',
  validate(registerPageViewSchema),
  registerPageViewController,
);

analyticsRouter.get(
  '/summary',
  requireAuth,
  validateQuery(analyticsSummaryQuerySchema),
  getAnalyticsSummaryController,
);

export default analyticsRouter;
