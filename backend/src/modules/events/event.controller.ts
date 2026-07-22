import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapEventToResponse } from './event.mapper.js';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from './event.service.js';

function getEventId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador del evento es obligatorio',
      'EVENT_ID_REQUIRED',
    );
  }

  return id;
}

export const getAllEventsController = asyncHandler(
  async (_request, response) => {
    const events = await getAllEvents();

    response.status(200).json({
      success: true,
      data: events.map(mapEventToResponse),
    });
  },
);

export const getEventByIdController = asyncHandler(
  async (request, response) => {
    const id = getEventId(request.params.id);
    const event = await getEventById(id);

    response.status(200).json({
      success: true,
      data: mapEventToResponse(event),
    });
  },
);

export const createEventController = asyncHandler(async (request, response) => {
  const event = await createEvent(request.body);

  response.status(201).json({
    success: true,
    data: mapEventToResponse(event),
  });
});

export const updateEventController = asyncHandler(async (request, response) => {
  const id = getEventId(request.params.id);
  const event = await updateEvent(id, request.body);

  response.status(200).json({
    success: true,
    data: mapEventToResponse(event),
  });
});

export const deleteEventController = asyncHandler(async (request, response) => {
  const id = getEventId(request.params.id);
  const event = await deleteEvent(id);

  response.status(200).json({
    success: true,
    data: mapEventToResponse(event),
  });
});
