export interface AmamantaEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  location: string;
  googleMapsUrl: string;
  description: string;
  requiresRegistration?: boolean;
  isActive: boolean;
}

export type CreateEventRequest = Omit<AmamantaEvent, 'id'>;

export type UpdateEventRequest = Partial<CreateEventRequest>;
