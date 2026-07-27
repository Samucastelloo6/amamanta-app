import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { ExperienceModel, type ExperienceType } from './experience.model.js';
import type { CreateExperienceDto } from './experience.types.js';

export async function getAllExperiences(type?: ExperienceType) {
  const filter = type
    ? {
        type,
      }
    : {};

  return ExperienceModel.find(filter)
    .sort({
      createdAt: -1,
    })
    .exec();
}

export async function createExperience(data: CreateExperienceDto) {
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
  };

  return ExperienceModel.create(payload);
}

export async function deleteExperience(id: string) {
  validateExperienceId(id);

  const experience = await ExperienceModel.findByIdAndDelete(id).exec();

  if (!experience) {
    throw new AppError(404, 'La experiencia no existe', 'EXPERIENCE_NOT_FOUND');
  }

  return experience;
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
