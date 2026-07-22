import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../shared/errors/app-error.js';
import { AdminModel } from './auth.model.js';
import type { LoginDto, LoginResponseDto } from './auth.types.js';

export async function loginAdmin(
  credentials: LoginDto,
): Promise<LoginResponseDto> {
  const admin = await AdminModel.findOne({
    email: credentials.email,
  })
    .select('+passwordHash')
    .exec();

  if (!admin) {
    throwInvalidCredentials();
  }

  const passwordIsValid = await bcrypt.compare(
    credentials.password,
    admin.passwordHash,
  );

  if (!passwordIsValid) {
    throwInvalidCredentials();
  }

  if (!admin.isActive) {
    throw new AppError(
      403,
      'La cuenta de administrador está desactivada',
      'ADMIN_INACTIVE',
    );
  }

  const token = jwt.sign(
    {
      role: 'admin',
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      subject: admin._id.toString(),
    },
  );

  return {
    accessToken: token,
    user: {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: 'admin',
    },
  };
}

function throwInvalidCredentials(): never {
  throw new AppError(
    401,
    'El correo electrónico o la contraseña no son correctos',
    'INVALID_CREDENTIALS',
  );
}
