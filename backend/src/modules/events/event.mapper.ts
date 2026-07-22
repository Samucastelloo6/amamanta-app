import type { EventHydratedDocument } from './event.model.js';

export interface EventResponse {
  id: string;
  title: string;
  date: string;
  startTime: string;
  location: string;
  googleMapsUrl: string;
  description: string;
  requiresRegistration: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapEventToResponse(
  event: EventHydratedDocument,
): EventResponse {
  return {
    id: event._id.toString(),
    title: event.title,
    date: event.date.toISOString().slice(0, 10),
    startTime: event.startTime,
    location: event.location,
    googleMapsUrl: event.googleMapsUrl,
    description: event.description,
    requiresRegistration: event.requiresRegistration,
    isActive: event.isActive,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
