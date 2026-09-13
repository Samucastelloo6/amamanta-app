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

function getPlaceFilter(placeId: unknown): string | undefined {
  if (placeId === undefined) {
    return undefined;
  }

  if (typeof placeId !== 'string') {
    throw new AppError(
      400,
      'El identificador del sitio no es válido',
      'INVALID_PLACE_ID',
    );
  }

  return placeId;
}

export const getAllExperiencesController = asyncHandler(
  async (request, response) => {
    const type = getExperienceType(request.query.type);

    /*
     * Se acepta el nombre anterior del parámetro para no romper a quien
     * todavía tenga la versión antigua de la app abierta.
     */
    const placeId = getPlaceFilter(
      request.query.placeId ?? request.query.workshopId,
    );

    const experiences = await getAllExperiences(type, placeId);

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
