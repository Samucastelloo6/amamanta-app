import type { Types } from 'mongoose';

import { ExperienceModel } from './experience.model.js';

/*
 * Cada valoración guarda una copia del nombre del sitio para seguir siendo
 * legible aunque el sitio se elimine. Al renombrarlo hay que propagar el
 * nombre nuevo a las valoraciones ya asociadas, o se verían unas con el
 * nombre viejo y otras con el nuevo.
 *
 * Lo llaman los servicios de talleres, hospitales, salas universitarias y
 * espacios amigos. Vive en un fichero propio, y no dentro de
 * experience.service.ts, para que esos cuatro módulos no arrastren las
 * dependencias del servicio de valoraciones.
 */
export async function renamePlaceInExperiences(
  placeId: Types.ObjectId,
  placeName: string,
): Promise<void> {
  await ExperienceModel.updateMany(
    {
      placeId,
    },
    {
      $set: {
        placeName,
      },
    },
  ).exec();

  /*
   * Lo guardado antes del cambio de nombre de campo, por si todavía no se ha
   * ejecutado `npm run migrate:experiences`.
   */
  await ExperienceModel.updateMany(
    {
      workshopId: placeId,
    },
    {
      $set: {
        workshopName: placeName,
      },
    },
  ).exec();
}
