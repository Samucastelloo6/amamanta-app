import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapUniversityRoomToResponse } from './university-room.mapper.js';
import {
  createUniversityRoom,
  deleteUniversityRoom,
  getAllUniversityRooms,
  getUniversityRoomById,
  updateUniversityRoom,
} from './university-room.service.js';

function getUniversityRoomId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador de la sala universitaria es obligatorio',
      'UNIVERSITY_ROOM_ID_REQUIRED',
    );
  }

  return id;
}

export const getAllUniversityRoomsController = asyncHandler(
  async (_request, response) => {
    const rooms = await getAllUniversityRooms();

    response.status(200).json({
      success: true,
      data: rooms.map(mapUniversityRoomToResponse),
    });
  },
);

export const getUniversityRoomByIdController = asyncHandler(
  async (request, response) => {
    const id = getUniversityRoomId(request.params.id);
    const room = await getUniversityRoomById(id);

    response.status(200).json({
      success: true,
      data: mapUniversityRoomToResponse(room),
    });
  },
);

export const createUniversityRoomController = asyncHandler(
  async (request, response) => {
    const room = await createUniversityRoom(request.body);

    response.status(201).json({
      success: true,
      data: mapUniversityRoomToResponse(room),
    });
  },
);

export const updateUniversityRoomController = asyncHandler(
  async (request, response) => {
    const id = getUniversityRoomId(request.params.id);
    const room = await updateUniversityRoom(id, request.body);

    response.status(200).json({
      success: true,
      data: mapUniversityRoomToResponse(room),
    });
  },
);

export const deleteUniversityRoomController = asyncHandler(
  async (request, response) => {
    const id = getUniversityRoomId(request.params.id);
    const room = await deleteUniversityRoom(id);

    response.status(200).json({
      success: true,
      data: mapUniversityRoomToResponse(room),
    });
  },
);
