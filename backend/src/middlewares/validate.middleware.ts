import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

export function validate<T>(schema: ZodSchema<T>): RequestHandler {
  return async (request, _response, next) => {
    try {
      request.body = await schema.parseAsync(request.body);

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>): RequestHandler {
  return async (request, _response, next) => {
    try {
      await schema.parseAsync(request.query);

      next();
    } catch (error) {
      next(error);
    }
  };
}
