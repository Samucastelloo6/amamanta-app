import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { buildEventIcs, buildEventIcsFileName } from './event.calendar.js';
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

/*
 * Devuelve el evento como fichero de calendario.
 *
 * `Content-Disposition: inline` es la clave: con `attachment` el iPhone se
 * limita a guardarlo en Archivos, mientras que así Safari abre directamente la
 * pantalla de «Añadir a Calendario». Es público como el resto de eventos.
 */
export const getEventCalendarController = asyncHandler(
  async (request, response) => {
    const id = getEventId(request.params.id);
    const event = await getEventById(id);

    response.setHeader('Content-Type', 'text/calendar; charset=utf-8');

    response.setHeader(
      'Content-Disposition',
      `inline; filename="${buildEventIcsFileName(event)}"`,
    );

    response.status(200).send(buildEventIcs(event));
  },
);
