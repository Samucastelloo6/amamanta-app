import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapFriendlySpaceToResponse } from './friendly-space.mapper.js';
import {
  createFriendlySpace,
  deleteFriendlySpace,
  getAllFriendlySpaces,
  getFriendlySpaceById,
  updateFriendlySpace,
} from './friendly-space.service.js';

function getFriendlySpaceId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador del espacio amigo es obligatorio',
      'FRIENDLY_SPACE_ID_REQUIRED',
    );
  }

  return id;
}

export const getAllFriendlySpacesController = asyncHandler(
  async (_request, response) => {
    const spaces = await getAllFriendlySpaces();

    response.status(200).json({
      success: true,
      data: spaces.map(mapFriendlySpaceToResponse),
    });
  },
);

export const getFriendlySpaceByIdController = asyncHandler(
  async (request, response) => {
    const id = getFriendlySpaceId(request.params.id);
    const space = await getFriendlySpaceById(id);

    response.status(200).json({
      success: true,
      data: mapFriendlySpaceToResponse(space),
    });
  },
);

export const createFriendlySpaceController = asyncHandler(
  async (request, response) => {
    const space = await createFriendlySpace(request.body);

    response.status(201).json({
      success: true,
      data: mapFriendlySpaceToResponse(space),
    });
  },
);

export const updateFriendlySpaceController = asyncHandler(
  async (request, response) => {
    const id = getFriendlySpaceId(request.params.id);
    const space = await updateFriendlySpace(id, request.body);

    response.status(200).json({
      success: true,
      data: mapFriendlySpaceToResponse(space),
    });
  },
);

export const deleteFriendlySpaceController = asyncHandler(
  async (request, response) => {
    const id = getFriendlySpaceId(request.params.id);
    const space = await deleteFriendlySpace(id);

    response.status(200).json({
      success: true,
      data: mapFriendlySpaceToResponse(space),
    });
  },
);
