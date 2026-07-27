import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapWorkshopToResponse } from './workshop.mapper.js';
import {
  createWorkshop,
  deleteWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
} from './workshop.service.js';

function getWorkshopId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador del taller es obligatorio',
      'WORKSHOP_ID_REQUIRED',
    );
  }

  return id;
}

export const getAllWorkshopsController = asyncHandler(
  async (_request, response) => {
    const workshops = await getAllWorkshops();

    response.status(200).json({
      success: true,
      data: workshops.map(mapWorkshopToResponse),
    });
  },
);

export const getWorkshopByIdController = asyncHandler(
  async (request, response) => {
    const id = getWorkshopId(request.params.id);
    const workshop = await getWorkshopById(id);

    response.status(200).json({
      success: true,
      data: mapWorkshopToResponse(workshop),
    });
  },
);

export const createWorkshopController = asyncHandler(
  async (request, response) => {
    const workshop = await createWorkshop(request.body);

    response.status(201).json({
      success: true,
      data: mapWorkshopToResponse(workshop),
    });
  },
);

export const updateWorkshopController = asyncHandler(
  async (request, response) => {
    const id = getWorkshopId(request.params.id);
    const workshop = await updateWorkshop(id, request.body);

    response.status(200).json({
      success: true,
      data: mapWorkshopToResponse(workshop),
    });
  },
);

export const deleteWorkshopController = asyncHandler(
  async (request, response) => {
    const id = getWorkshopId(request.params.id);
    const workshop = await deleteWorkshop(id);

    response.status(200).json({
      success: true,
      data: mapWorkshopToResponse(workshop),
    });
  },
);
