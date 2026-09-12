import { Router } from 'express';
import rateLimit from 'express-rate-limit';

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

/*
 * Los dos endpoints de registro son públicos por necesidad: los llama la web
 * sin que nadie haya iniciado sesión. El límite por IP evita que alguien infle
 * las estadísticas con un bucle de peticiones.
 *
 * 240 por hora da margen de sobra para una navegación normal, en la que cada
 * cambio de sección envía una petición.
 */
const analyticsWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 240,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.',
    },
  },
});

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
