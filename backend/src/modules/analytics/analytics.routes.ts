import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { analyticsWriteLimiter } from '../../middlewares/rate-limit.middleware.js';
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

/*
 * Los dos endpoints de registro son públicos por necesidad: los llama la web
 * sin que nadie haya iniciado sesión. El límite por IP evita que alguien infle
 * las estadísticas con un bucle de peticiones.
 */

analyticsRouter.post('/visit', analyticsWriteLimiter, registerVisitController);

analyticsRouter.post(
  '/page-view',
  analyticsWriteLimiter,
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
