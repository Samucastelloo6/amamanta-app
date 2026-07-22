export interface CreateEventDto {
  title: string;
  date: string;
  startTime: string;
  location: string;
  googleMapsUrl: string;
  description: string;
  requiresRegistration?: boolean;
  isActive?: boolean;
}

export type UpdateEventDto = Partial<CreateEventDto>;
