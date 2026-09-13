import 'dotenv/config';
import mongoose from 'mongoose';

import { ExperienceModel } from '../modules/experiences/experience.model.js';

/*
 * Pasa las valoraciones guardadas con los campos antiguos (workshopId,
 * workshopName), de cuando esto solo existía para talleres, a los campos
 * genéricos (placeId, placeName), que ahora sirven también para hospitales,
 * salas universitarias y espacios amigos.
 *
 * Se puede ejecutar las veces que haga falta: si no queda nada por cambiar,
 * no hace nada. Ejecutar con `npm run migrate:experiences`.
 */
async function migrateExperiencePlaces(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('La variable MONGODB_URI no está definida.');
  }

  try {
    await mongoose.connect(mongoUri);

    const pending = await ExperienceModel.countDocuments({
      workshopId: {
        $exists: true,
      },
    }).exec();

    if (pending === 0) {
      console.log('No hay valoraciones pendientes de migrar.');
      return;
    }

    console.log(`Valoraciones por migrar: ${pending}`);

    /*
     * Se usa la colección directamente porque $rename es un operador de
     * MongoDB que Mongoose no expone en el modelo tipado.
     */
    const renamedId = await ExperienceModel.collection.updateMany(
      {
        workshopId: {
          $exists: true,
        },
      },
      {
        $rename: {
          workshopId: 'placeId',
        },
      },
    );

    const renamedName = await ExperienceModel.collection.updateMany(
      {
        workshopName: {
          $exists: true,
        },
      },
      {
        $rename: {
          workshopName: 'placeName',
        },
      },
    );

    console.log(
      `Migración completada: ${renamedId.modifiedCount} identificadores y ${renamedName.modifiedCount} nombres.`,
    );
  } catch (error) {
    console.error('Error al migrar las valoraciones:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void migrateExperiencePlaces();
