import type { EventMode, EventOnlinePlatform } from './event.model.js';

export interface CreateEventDto {
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
  requiresRegistration?: boolean;
  isActive?: boolean;
}

export type UpdateEventDto = Partial<CreateEventDto>;
