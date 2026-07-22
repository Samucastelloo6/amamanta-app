import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log('🟢 MongoDB conectada correctamente');
  } catch (error) {
    console.error('🔴 Error al conectar con MongoDB');
    console.error(error);

    process.exit(1);
  }
}
