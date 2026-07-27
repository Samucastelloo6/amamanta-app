import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { HospitalModel } from './hospital.model.js';
import type { CreateHospitalDto, UpdateHospitalDto } from './hospital.types.js';

export async function getAllHospitals() {
  return HospitalModel.find()
    .sort({
      name: 1,
    })
    .exec();
}

export async function getHospitalById(id: string) {
  validateHospitalId(id);

  const hospital = await HospitalModel.findById(id).exec();

  if (!hospital) {
    throw new AppError(404, 'El hospital no existe', 'HOSPITAL_NOT_FOUND');
  }

  return hospital;
}

export async function createHospital(data: CreateHospitalDto) {
  return HospitalModel.create(data);
}

export async function updateHospital(id: string, data: UpdateHospitalDto) {
  validateHospitalId(id);

  const hospital = await HospitalModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();

  if (!hospital) {
    throw new AppError(404, 'El hospital no existe', 'HOSPITAL_NOT_FOUND');
  }

  return hospital;
}

export async function deleteHospital(id: string) {
  validateHospitalId(id);

  const hospital = await HospitalModel.findByIdAndDelete(id).exec();

  if (!hospital) {
    throw new AppError(404, 'El hospital no existe', 'HOSPITAL_NOT_FOUND');
  }

  return hospital;
}

function validateHospitalId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del hospital no es válido',
      'INVALID_HOSPITAL_ID',
    );
  }
}
