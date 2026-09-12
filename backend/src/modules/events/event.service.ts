import { isValidObjectId } from 'mongoose';
import { AppError } from '../../shared/errors/app-error.js';
import { EventModel } from './event.model.js';
import type { CreateEventDto, UpdateEventDto } from './event.types.js';

export async function getAllEvents() {
  return EventModel.find()
    .sort({
      date: 1,
      startTime: 1,
    })
    .exec();
}

export async function getEventById(id: string) {
  validateEventId(id);

  const event = await EventModel.findById(id).exec();

  if (!event) {
    throw new AppError(404, 'El evento no existe', 'EVENT_NOT_FOUND');
  }

  return event;
}

/*
 * Un evento es presencial u online, nunca las dos cosas. Al guardar se vacía
 * el bloque de la modalidad que no corresponde, para que cambiar de modalidad
 * no deje una dirección o un enlace antiguos colgando en la ficha pública.
 */
export async function createEvent(data: CreateEventDto) {
  if (data.mode === 'online') {
    const { location, googleMapsUrl, ...rest } = data;

    return EventModel.create({
      ...rest,
      location: '',
      googleMapsUrl: '',
    });
  }

  const { onlinePlatform, ...rest } = data;

  return EventModel.create({
    ...rest,
    onlineUrl: '',
    onlineCode: '',
  });
}

export async function updateEvent(id: string, data: UpdateEventDto) {
  validateEventId(id);

  const event = await EventModel.findById(id).exec();

  if (!event) {
    throw new AppError(404, 'El evento no existe', 'EVENT_NOT_FOUND');
  }

  event.set(data);

  if (data.mode === 'online') {
    event.location = '';
    event.googleMapsUrl = '';
  }

  if (data.mode === 'presential') {
    event.set('onlinePlatform', undefined);
    event.onlineUrl = '';
    event.onlineCode = '';
  }

  await event.save();

  return event;
}

export async function deleteEvent(id: string) {
  validateEventId(id);

  const event = await EventModel.findByIdAndDelete(id).exec();

  if (!event) {
    throw new AppError(404, 'El evento no existe', 'EVENT_NOT_FOUND');
  }

  return event;
}

function validateEventId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del evento no es válido',
      'INVALID_EVENT_ID',
    );
  }
}
