import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { UniversityRoomModel } from './university-room.model.js';
import type {
  CreateUniversityRoomDto,
  UpdateUniversityRoomDto,
} from './university-room.types.js';

export async function getAllUniversityRooms() {
  return UniversityRoomModel.find()
    .sort({
      name: 1,
    })
    .exec();
}

export async function getUniversityRoomById(id: string) {
  validateUniversityRoomId(id);

  const room = await UniversityRoomModel.findById(id).exec();

  if (!room) {
    throw new AppError(
      404,
      'La sala universitaria no existe',
      'UNIVERSITY_ROOM_NOT_FOUND',
    );
  }

  return room;
}

export async function createUniversityRoom(data: CreateUniversityRoomDto) {
  return UniversityRoomModel.create(data);
}

export async function updateUniversityRoom(
  id: string,
  data: UpdateUniversityRoomDto,
) {
  validateUniversityRoomId(id);

  const room = await UniversityRoomModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();

  if (!room) {
    throw new AppError(
      404,
      'La sala universitaria no existe',
      'UNIVERSITY_ROOM_NOT_FOUND',
    );
  }

  return room;
}

export async function deleteUniversityRoom(id: string) {
  validateUniversityRoomId(id);

  const room = await UniversityRoomModel.findByIdAndDelete(id).exec();

  if (!room) {
    throw new AppError(
      404,
      'La sala universitaria no existe',
      'UNIVERSITY_ROOM_NOT_FOUND',
    );
  }

  return room;
}

function validateUniversityRoomId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador de la sala universitaria no es válido',
      'INVALID_UNIVERSITY_ROOM_ID',
    );
  }
}
