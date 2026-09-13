import rateLimit from 'express-rate-limit';

/*
 * Límites por IP para los endpoints públicos, los que cualquiera puede llamar
 * sin haber iniciado sesión.
 *
 * Para que funcionen hace falta `app.set('trust proxy', 1)` en app.ts: detrás
 * del proxy de Northflank, sin eso todas las peticiones parecerían venir de la
 * misma dirección y el límite afectaría a todo el mundo a la vez.
 */

/*
 * Formularios públicos: valorar un taller y valorar la aplicación.
 *
 * 30 envíos por hora y dirección es muy holgado para el uso real —una persona
 * envía una valoración, no treinta— pero deja margen de sobra para el caso que
 * sí ocurre: un taller entero conectado a la misma wifi, o varias personas
 * compartiendo la salida a internet del móvil, valorando después de la sesión.
 * Lo que corta es el envío automático en bucle, que serían miles.
 */
export const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message:
        'Has enviado muchos formularios seguidos. Espera un momento e inténtalo de nuevo.',
    },
  },
});

/*
 * Analítica: la web envía una petición en cada cambio de sección, así que el
 * margen tiene que ser mucho mayor que el de un formulario.
 */
export const analyticsWriteLimiter = rateLimit({
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
