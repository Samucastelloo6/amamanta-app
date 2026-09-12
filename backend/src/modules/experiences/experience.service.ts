import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { WorkshopModel } from '../workshops/workshop.model.js';
import { ExperienceModel, type ExperienceType } from './experience.model.js';
import type {
  CreateExperienceDto,
  UpdateExperienceDto,
} from './experience.types.js';

export async function getAllExperiences(
  type?: ExperienceType,
  workshopId?: string,
) {
  if (workshopId) {
    validateWorkshopId(workshopId);
  }

  const filter = {
    ...(type
      ? {
          type,
        }
      : {}),

    ...(workshopId
      ? {
          workshopId,
        }
      : {}),
  };

  return ExperienceModel.find(filter)
    .sort({
      createdAt: -1,
    })
    .exec();
}

/*
 * ── TRANSICIÓN DE DESPLIEGUE ────────────────────────────────────────────────
 *
 * Poner a true cuando todo el mundo tenga ya el frontend nuevo (un par de días
 * después del despliegue). Es lo único que hay que cambiar.
 *
 * Por qué está en false: la app es una PWA. Quien la tenga instalada sigue
 * ejecutando la versión antigua hasta que pasa por la pantalla de inicio y
 * pulsa «Actualizar». Ese formulario antiguo no envía el taller, así que con
 * la regla activada esas personas verían un error y perderían su valoración.
 *
 * Con la regla desactivada, la valoración se guarda y aparece como «Sin taller
 * indicado», que es un caso que el panel ya resuelve con «Asignar taller».
 *
 * Esto no relaja el formulario público: el desplegable es obligatorio en el
 * frontend nuevo desde el primer día. Solo evita que se pierda una valoración
 * enviada desde una versión vieja de la app.
 * ───────────────────────────────────────────────────────────────────────────
 */
const REQUIRE_WORKSHOP_ON_CREATE: boolean = false;

export async function createExperience(data: CreateExperienceDto) {
  /*
   * El taller es obligatorio en las experiencias de talleres y no se admite
   * en el resto de tipos, que no están asociados a ningún taller concreto.
   */
  if (REQUIRE_WORKSHOP_ON_CREATE && data.type === 'workshops' && !data.workshopId) {
    throw new AppError(
      400,
      'Selecciona el taller que quieres valorar',
      'WORKSHOP_REQUIRED',
    );
  }

  if (data.type !== 'workshops' && data.workshopId) {
    throw new AppError(
      400,
      'Solo las experiencias de talleres pueden indicar un taller',
      'EXPERIENCE_WITHOUT_WORKSHOP',
    );
  }

  const workshop = data.workshopId
    ? await findSelectableWorkshop(data.workshopId)
    : null;

  const payload = {
    type: data.type,
    rating: data.rating,

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

    ...(workshop
      ? {
          workshopId: workshop._id,
          workshopName: workshop.name,
        }
      : {}),
  };

  return ExperienceModel.create(payload);
}

export async function updateExperience(id: string, data: UpdateExperienceDto) {
  validateExperienceId(id);

  const experience = await ExperienceModel.findById(id).exec();

  if (!experience) {
    throw new AppError(404, 'La experiencia no existe', 'EXPERIENCE_NOT_FOUND');
  }

  if (data.workshopId !== undefined && experience.type !== 'workshops') {
    throw new AppError(
      400,
      'Solo las experiencias de talleres pueden asociarse a un taller',
      'EXPERIENCE_WITHOUT_WORKSHOP',
    );
  }

  if (data.rating !== undefined) {
    experience.rating = data.rating;
  }

  /*
   * Un texto vacío elimina el campo en lugar de guardar una cadena en blanco,
   * para que las vistas sigan pudiendo comprobar su existencia.
   */
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

  if (data.workshopId !== undefined) {
    const workshop = await findSelectableWorkshop(data.workshopId);

    experience.workshopId = workshop._id;
    experience.workshopName = workshop.name;
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

async function findSelectableWorkshop(workshopId: string) {
  validateWorkshopId(workshopId);

  const workshop = await WorkshopModel.findById(workshopId).exec();

  if (!workshop || !workshop.isActive) {
    throw new AppError(
      400,
      'El taller seleccionado ya no está disponible',
      'WORKSHOP_NOT_AVAILABLE',
    );
  }

  return workshop;
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

function validateWorkshopId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del taller no es válido',
      'INVALID_WORKSHOP_ID',
    );
  }
}
