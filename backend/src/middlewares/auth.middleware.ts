import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AdminModel } from '../modules/auth/auth.model.js';
import { AppError } from '../shared/errors/app-error.js';
import { asyncHandler } from '../shared/utils/async-handler.js';

interface AuthTokenPayload extends JwtPayload {
  sub: string;
  role: 'admin';
}

export const requireAuth: RequestHandler = asyncHandler(
  async (request, _response, next) => {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'Debes iniciar sesión para realizar esta acción',
        'AUTH_REQUIRED',
      );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new AppError(
        401,
        'Debes iniciar sesión para realizar esta acción',
        'AUTH_REQUIRED',
      );
    }

    let payload: AuthTokenPayload;

    try {
      const decodedToken = jwt.verify(token, env.JWT_SECRET);

      if (
        typeof decodedToken === 'string' ||
        typeof decodedToken.sub !== 'string' ||
        decodedToken.role !== 'admin'
      ) {
        throw new AppError(
          401,
          'El token de acceso no es válido',
          'INVALID_TOKEN',
        );
      }

      payload = decodedToken as AuthTokenPayload;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        401,
        'La sesión ha expirado o el token no es válido',
        'INVALID_OR_EXPIRED_TOKEN',
      );
    }

    const admin = await AdminModel.findById(payload.sub)
      .select('_id isActive')
      .exec();

    if (!admin) {
      throw new AppError(
        401,
        'La cuenta asociada a la sesión ya no existe',
        'ADMIN_NOT_FOUND',
      );
    }

    if (!admin.isActive) {
      throw new AppError(
        403,
        'La cuenta de administrador está desactivada',
        'ADMIN_INACTIVE',
      );
    }

    next();
  },
);
