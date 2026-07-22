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

app.use('/api/auth', authRouter);
/*
 * Estos dos middlewares deben ir al final:
 * primero detectamos rutas inexistentes y después gestionamos errores.
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
