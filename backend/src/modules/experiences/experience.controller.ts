import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { experienceTypes, type ExperienceType } from './experience.model.js';
import { mapExperienceToResponse } from './experience.mapper.js';
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  updateExperience,
} from './experience.service.js';

function getExperienceId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador de la experiencia es obligatorio',
      'EXPERIENCE_ID_REQUIRED',
    );
  }

  return id;
}

function getExperienceType(type: unknown): ExperienceType | undefined {
  if (type === undefined) {
    return undefined;
  }

  if (
    typeof type !== 'string' ||
    !experienceTypes.includes(type as ExperienceType)
  ) {
    throw new AppError(
      400,
      'El tipo de experiencia no es válido',
      'INVALID_EXPERIENCE_TYPE',
    );
  }

  return type as ExperienceType;
}

function getWorkshopFilter(workshopId: unknown): string | undefined {
  if (workshopId === undefined) {
    return undefined;
  }

  if (typeof workshopId !== 'string') {
    throw new AppError(
      400,
      'El identificador del taller no es válido',
      'INVALID_WORKSHOP_ID',
    );
  }

  return workshopId;
}

export const getAllExperiencesController = asyncHandler(
  async (request, response) => {
    const type = getExperienceType(request.query.type);
    const workshopId = getWorkshopFilter(request.query.workshopId);

    const experiences = await getAllExperiences(type, workshopId);

    response.status(200).json({
      success: true,
      data: experiences.map(mapExperienceToResponse),
    });
  },
);

export const createExperienceController = asyncHandler(
  async (request, response) => {
    const experience = await createExperience(request.body);

    response.status(201).json({
      success: true,
      data: mapExperienceToResponse(experience),
    });
  },
);

export const updateExperienceController = asyncHandler(
  async (request, response) => {
    const id = getExperienceId(request.params.id);
    const experience = await updateExperience(id, request.body);

    response.status(200).json({
      success: true,
      data: mapExperienceToResponse(experience),
    });
  },
);

export const deleteExperienceController = asyncHandler(
  async (request, response) => {
    const id = getExperienceId(request.params.id);
    const experience = await deleteExperience(id);

    response.status(200).json({
      success: true,
      data: mapExperienceToResponse(experience),
    });
  },
);
