import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { FriendlySpaceModel } from '../friendly-spaces/friendly-space.model.js';
import { HospitalModel } from '../hospitals/hospital.model.js';
import { UniversityRoomModel } from '../university-rooms/university-room.model.js';
import { WorkshopModel } from '../workshops/workshop.model.js';
import {
  ExperienceModel,
  type ExperienceType,
  usesPlaceList,
} from './experience.model.js';
import type {
  CreateExperienceDto,
  UpdateExperienceDto,
} from './experience.types.js';

/*
 * ── TRANSICIÓN DE DESPLIEGUE ────────────────────────────────────────────────
 *
 * Poner a true cuando todo el mundo tenga ya el frontend nuevo (un par de días
 * después del despliegue). Es lo único que hay que cambiar.
 *
 * Por qué está en false: la app es una PWA. Quien la tenga instalada sigue
 * ejecutando la versión antigua hasta que pasa por la pantalla de inicio y
 * pulsa «Actualizar». Ese formulario antiguo no envía el sitio, así que con la
 * regla activada esas personas verían un error y perderían su valoración.
 *
 * Con la regla desactivada, la valoración se guarda y aparece como «Sin
 * indicar», que es un caso que el panel ya resuelve con «Asignar sitio».
 *
 * Esto no relaja el formulario público: el desplegable es obligatorio en el
 * frontend nuevo desde el primer día.
 * ───────────────────────────────────────────────────────────────────────────
 */
const REQUIRE_PLACE_ON_CREATE: boolean = false;

const placePrompts: Record<ExperienceType, string> = {
  workshops: 'Selecciona el taller que quieres valorar',
  hospitals: 'Selecciona el hospital que quieres valorar',
  rooms: 'Selecciona la sala de lactancia que quieres valorar',
  'friendly-spaces': 'Selecciona el espacio amigo que quieres valorar',
};

const placeUnavailableMessages: Record<ExperienceType, string> = {
  workshops: 'El taller seleccionado ya no está disponible',
  hospitals: 'El hospital seleccionado ya no está disponible',
  rooms: 'La sala seleccionada ya no está disponible',
  'friendly-spaces': 'El espacio amigo seleccionado ya no está disponible',
};

export async function getAllExperiences(
  type?: ExperienceType,
  placeId?: string,
) {
  if (placeId) {
    validatePlaceId(placeId);
  }

  const filter = {
    ...(type
      ? {
          type,
        }
      : {}),

    /*
     * Se busca también por el campo antiguo para que las valoraciones
     * guardadas antes del cambio de nombre sigan apareciendo en su sitio
     * aunque todavía no se haya ejecutado `npm run migrate:experiences`.
     */
    ...(placeId
      ? {
          $or: [
            {
              placeId,
            },
            {
              workshopId: placeId,
            },
          ],
        }
      : {}),
  };

  return ExperienceModel.find(filter)
    .sort({
      createdAt: -1,
    })
    .exec();
}

export async function createExperience(data: CreateExperienceDto) {
  /* La versión antigua de la app todavía llama `workshopId` al sitio. */
  const requestedPlaceId = data.placeId ?? data.workshopId;

  const common = {
    type: data.type,
    rating: data.rating,

    ...(data.authorName
      ? {
          authorName: data.authorName,
        }
      : {}),

    ...(data.text
      ? {
          text: data.text,
        }
      : {}),

    ...(data.improvement
      ? {
          improvement: data.improvement,
        }
      : {}),
  };

  /*
   * Espacios amigos: no hay lista que elegir. Se guarda el nombre tal cual lo
   * haya escrito quien valora, si es que lo ha escrito.
   */
  if (!usesPlaceList(data.type)) {
    return ExperienceModel.create({
      ...common,

      ...(data.placeName
        ? {
            placeName: data.placeName,
          }
        : {}),
    });
  }

  if (REQUIRE_PLACE_ON_CREATE && !requestedPlaceId) {
    throw new AppError(400, placePrompts[data.type], 'PLACE_REQUIRED');
  }

  const place = requestedPlaceId
    ? await findSelectablePlace(data.type, requestedPlaceId)
    : null;

  /*
   * El nombre se copia del registro real, nunca de lo que mande el cliente.
   */
  return ExperienceModel.create({
    ...common,

    ...(place
      ? {
          placeId: place._id,
          placeName: place.name,
        }
      : {}),
  });
}

export async function updateExperience(id: string, data: UpdateExperienceDto) {
  validateExperienceId(id);

  const experience = await ExperienceModel.findById(id).exec();

  if (!experience) {
    throw new AppError(404, 'La experiencia no existe', 'EXPERIENCE_NOT_FOUND');
  }

  if (data.rating !== undefined) {
    experience.rating = data.rating;
  }

  /*
   * Un texto vacío elimina el campo en lugar de guardar una cadena en blanco,
   * para que las vistas sigan pudiendo comprobar su existencia. En el nombre,
   * dejarlo vacío es la forma de volver a hacer anónima una valoración.
   */
  if (data.authorName !== undefined) {
    if (data.authorName) {
      experience.authorName = data.authorName;
    } else {
      experience.set('authorName', undefined);
    }
  }

  if (data.text !== undefined) {
    if (data.text) {
      experience.text = data.text;
    } else {
      experience.set('text', undefined);
    }
  }

  if (data.improvement !== undefined) {
    if (data.improvement) {
      experience.improvement = data.improvement;
    } else {
      experience.set('improvement', undefined);
    }
  }

  if (!usesPlaceList(experience.type)) {
    /* Espacios amigos: el nombre del sitio es texto libre y se puede borrar. */
    if (data.placeName !== undefined) {
      if (data.placeName) {
        experience.placeName = data.placeName;
      } else {
        experience.set('placeName', undefined);
      }
    }
  } else {
    const requestedPlaceId = data.placeId ?? data.workshopId;

    if (requestedPlaceId !== undefined) {
      const place = await findSelectablePlace(
        experience.type,
        requestedPlaceId,
      );

      experience.placeId = place._id;
      experience.placeName = place.name;

      /*
       * Si venía de los campos antiguos, se limpian al asignar el sitio para
       * no dejar la valoración con la información duplicada.
       */
      experience.set('workshopId', undefined);
      experience.set('workshopName', undefined);
    }
  }

  await experience.save();

  return experience;
}

export async function deleteExperience(id: string) {
  validateExperienceId(id);

  const experience = await ExperienceModel.findByIdAndDelete(id).exec();

  if (!experience) {
    throw new AppError(404, 'La experiencia no existe', 'EXPERIENCE_NOT_FOUND');
  }

  return experience;
}

/*
 * El sitio vive en una colección distinta según el tipo de experiencia, así
 * que se busca en la que corresponde. Los cuatro modelos tienen `name` e
 * `isActive`, que es lo único que hace falta aquí.
 */
async function findPlaceDocument(type: ExperienceType, placeId: string) {
  switch (type) {
    case 'workshops':
      return WorkshopModel.findById(placeId).exec();

    case 'hospitals':
      return HospitalModel.findById(placeId).exec();

    case 'rooms':
      return UniversityRoomModel.findById(placeId).exec();

    case 'friendly-spaces':
      return FriendlySpaceModel.findById(placeId).exec();
  }
}

async function findSelectablePlace(type: ExperienceType, placeId: string) {
  validatePlaceId(placeId);

  const place = await findPlaceDocument(type, placeId);

  if (!place || !place.isActive) {
    throw new AppError(
      400,
      placeUnavailableMessages[type],
      'PLACE_NOT_AVAILABLE',
    );
  }

  return place;
}

function validateExperienceId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador de la experiencia no es válido',
      'INVALID_EXPERIENCE_ID',
    );
  }
}

function validatePlaceId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del sitio no es válido',
      'INVALID_PLACE_ID',
    );
  }
}
