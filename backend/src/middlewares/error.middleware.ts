import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../shared/errors/app-error.js';

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};

    for (const issue of error.issues) {
      const field = issue.path.join('.');

      if (field && !fields[field]) {
        fields[field] = issue.message;
      }
    }

    response.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Revisa los datos del formulario',
        fields,
      },
    });

    return;
  }

  const isOperationalError = error instanceof AppError;

  const statusCode = isOperationalError ? error.statusCode : 500;

  const code = isOperationalError ? error.code : 'INTERNAL_SERVER_ERROR';

  const message = isOperationalError
    ? error.message
    : 'Ha ocurrido un error interno en el servidor';

  if (!isOperationalError) {
    console.error('Error inesperado:', error);
  }

  response.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.NODE_ENV === 'development' &&
      error instanceof Error &&
      error.stack
        ? { stack: error.stack }
        : {}),
    },
  });
};
