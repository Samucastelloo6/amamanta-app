import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapHospitalToResponse } from './hospital.mapper.js';
import {
  createHospital,
  deleteHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
} from './hospital.service.js';

function getHospitalId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador del hospital es obligatorio',
      'HOSPITAL_ID_REQUIRED',
    );
  }

  return id;
}

export const getAllHospitalsController = asyncHandler(
  async (_request, response) => {
    const hospitals = await getAllHospitals();

    response.status(200).json({
      success: true,
      data: hospitals.map(mapHospitalToResponse),
    });
  },
);

export const getHospitalByIdController = asyncHandler(
  async (request, response) => {
    const id = getHospitalId(request.params.id);
    const hospital = await getHospitalById(id);

    response.status(200).json({
      success: true,
      data: mapHospitalToResponse(hospital),
    });
  },
);

export const createHospitalController = asyncHandler(
  async (request, response) => {
    const hospital = await createHospital(request.body);

    response.status(201).json({
      success: true,
      data: mapHospitalToResponse(hospital),
    });
  },
);

export const updateHospitalController = asyncHandler(
  async (request, response) => {
    const id = getHospitalId(request.params.id);
    const hospital = await updateHospital(id, request.body);

    response.status(200).json({
      success: true,
      data: mapHospitalToResponse(hospital),
    });
  },
);

export const deleteHospitalController = asyncHandler(
  async (request, response) => {
    const id = getHospitalId(request.params.id);
    const hospital = await deleteHospital(id);

    response.status(200).json({
      success: true,
      data: mapHospitalToResponse(hospital),
    });
  },
);
