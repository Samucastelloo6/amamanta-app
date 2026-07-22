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
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del evento no es válido',
      'INVALID_EVENT_ID',
    );
  }

  const event = await EventModel.findById(id).exec();

  if (!event) {
    throw new AppError(404, 'El evento no existe', 'EVENT_NOT_FOUND');
  }

  return event;
}

export async function createEvent(data: CreateEventDto) {
  return EventModel.create(data);
}

export async function updateEvent(id: string, data: UpdateEventDto) {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del evento no es válido',
      'INVALID_EVENT_ID',
    );
  }

  const event = await EventModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();

  if (!event) {
    throw new AppError(404, 'El evento no existe', 'EVENT_NOT_FOUND');
  }

  return event;
}

export async function deleteEvent(id: string) {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del evento no es válido',
      'INVALID_EVENT_ID',
    );
  }

  const event = await EventModel.findByIdAndDelete(id).exec();

  if (!event) {
    throw new AppError(404, 'El evento no existe', 'EVENT_NOT_FOUND');
  }

  return event;
}
