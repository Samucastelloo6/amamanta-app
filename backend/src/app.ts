import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import eventRouter from './modules/events/event.routes.js';
import authRouter from './modules/auth/auth.routes.js';
import workshopRouter from './modules/workshops/workshop.routes.js';
import universityRoomRouter from './modules/university-rooms/university-room.routes.js';
import hospitalRouter from './modules/hospitals/hospital.routes.js';
import friendlySpaceCategoryRouter from './modules/friendly-space-categories/friendly-space-category.routes.js';
import friendlySpaceRouter from './modules/friendly-spaces/friendly-space.routes.js';
import contactRouter from './modules/contact/contact.routes.js';
import collaborateRouter from './modules/collaborate/collaborate.routes.js';
import feedbackRouter from './modules/feedback/feedback.routes.js';
import experienceRouter from './modules/experiences/experience.routes.js';
import analyticsRouter from './modules/analytics/analytics.routes.js';

const app = express();

app.disable('x-powered-by');

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    data: {
      status: 'ok',
      message: 'El backend de Amamanta funciona correctamente',
    },
  });
});

app.use('/api/events', eventRouter);
app.use('/api/workshops', workshopRouter);
app.use('/api/auth', authRouter);
app.use('/api/university-rooms', universityRoomRouter);
app.use('/api/hospitals', hospitalRouter);
app.use('/api/friendly-space-categories', friendlySpaceCategoryRouter);
app.use('/api/friendly-spaces', friendlySpaceRouter);
app.use('/api/contact', contactRouter);
app.use('/api/collaborate', collaborateRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/experiences', experienceRouter);
app.use('/api/analytics', analyticsRouter);
/*
 * Estos dos middlewares deben ir al final:
 * primero detectamos rutas inexistentes y después gestionamos errores.
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
