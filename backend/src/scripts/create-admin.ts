import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { connectDatabase } from '../config/database.js';
import { AdminModel } from '../modules/auth/auth.model.js';

const SALT_ROUNDS = 12;

async function createAdmin(): Promise<void> {
  const readline = createInterface({
    input: stdin,
    output: stdout,
  });

  try {
    await connectDatabase();

    const name = (await readline.question('Nombre del administrador: ')).trim();

    const email = (await readline.question('Correo electrónico: '))
      .trim()
      .toLowerCase();

    const password = await readline.question('Contraseña: ');

    if (!name || !email || !password) {
      throw new Error('Nombre, correo y contraseña son obligatorios');
    }

    if (password.length < 10) {
      throw new Error('La contraseña debe tener al menos 10 caracteres');
    }

    const existingAdmin = await AdminModel.findOne({ email }).exec();

    if (existingAdmin) {
      throw new Error('Ya existe un administrador con ese correo electrónico');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = await AdminModel.create({
      name,
      email,
      passwordHash,
      isActive: true,
    });

    console.log('');
    console.log('🟢 Administrador creado correctamente');
    console.log(`Nombre: ${admin.name}`);
    console.log(`Correo: ${admin.email}`);
  } catch (error) {
    console.error('');
    console.error('🔴 No se ha podido crear el administrador');

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    readline.close();
    await mongoose.disconnect();
  }
}

void createAdmin();
