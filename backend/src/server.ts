import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${env.PORT}`);
  });
}

void startServer();
