import type {
  EventHydratedDocument,
  EventMode,
  EventOnlinePlatform,
} from './event.model.js';

export interface EventResponse {
  id: string;
  title: string;
  date: string;
  startTime: string;

  mode: EventMode;

  location: string;
  googleMapsUrl: string;

  onlinePlatform?: EventOnlinePlatform;
  onlineUrl: string;
  onlineCode: string;

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

    /*
     * Los eventos creados antes de que existiera la modalidad no tienen el
     * campo, y son todos presenciales.
     */
    mode: event.mode ?? 'presential',

    location: event.location ?? '',
    googleMapsUrl: event.googleMapsUrl ?? '',

    ...(event.onlinePlatform
      ? {
          onlinePlatform: event.onlinePlatform,
        }
      : {}),

    onlineUrl: event.onlineUrl ?? '',
    onlineCode: event.onlineCode ?? '',

    description: event.description,
    requiresRegistration: event.requiresRegistration,
    isActive: event.isActive,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
