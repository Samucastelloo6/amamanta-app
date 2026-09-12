import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { ExperienceModel } from '../experiences/experience.model.js';
import { WorkshopModel } from './workshop.model.js';
import type { CreateWorkshopDto, UpdateWorkshopDto } from './workshop.types.js';

const DAY_ORDER = {
  lunes: 1,
  martes: 2,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
} as const;

export async function getAllWorkshops() {
  const workshops = await WorkshopModel.find().exec();

  return workshops.sort((workshopA, workshopB) => {
    const dayDifference = DAY_ORDER[workshopA.day] - DAY_ORDER[workshopB.day];

    if (dayDifference !== 0) {
      return dayDifference;
    }

    return (
      getScheduleMinutes(workshopA.schedule) -
      getScheduleMinutes(workshopB.schedule)
    );
  });
}

export async function getWorkshopById(id: string) {
  validateWorkshopId(id);

  const workshop = await WorkshopModel.findById(id).exec();

  if (!workshop) {
    throw new AppError(404, 'El taller no existe', 'WORKSHOP_NOT_FOUND');
  }

  return workshop;
}

export async function createWorkshop(data: CreateWorkshopDto) {
  return WorkshopModel.create(data);
}

export async function updateWorkshop(id: string, data: UpdateWorkshopDto) {
  validateWorkshopId(id);

  const workshop = await WorkshopModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();

  if (!workshop) {
    throw new AppError(404, 'El taller no existe', 'WORKSHOP_NOT_FOUND');
  }

  /*
   * Cada experiencia guarda una copia del nombre del taller para seguir
   * siendo legible aunque el taller se elimine. Al renombrarlo hay que
   * propagar el nombre nuevo a las experiencias ya asociadas, o el panel
   * mostraría unas con el nombre viejo y otras con el nuevo.
   */
  if (data.name !== undefined) {
    await ExperienceModel.updateMany(
      {
        workshopId: workshop._id,
      },
      {
        $set: {
          workshopName: workshop.name,
        },
      },
    ).exec();
  }

  return workshop;
}

export async function deleteWorkshop(id: string) {
  validateWorkshopId(id);

  const workshop = await WorkshopModel.findByIdAndDelete(id).exec();

  if (!workshop) {
    throw new AppError(404, 'El taller no existe', 'WORKSHOP_NOT_FOUND');
  }

  return workshop;
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

function getScheduleMinutes(schedule: string): number {
  const match = schedule.match(/(\d{1,2}):(\d{2})/);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours * 60 + minutes;
}
