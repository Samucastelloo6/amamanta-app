import type {
  WorkshopClosureType,
  WorkshopContact,
  WorkshopDay,
  WorkshopMode,
  WorkshopStatus,
  WorkshopTime,
} from './workshop.model.js';

export interface CreateWorkshopDto {
  name: string;

  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;

  day: WorkshopDay;
  time: WorkshopTime;
  schedule: string;

  contacts: WorkshopContact[];

  notes?: string;

  mode?: WorkshopMode;
  status?: WorkshopStatus;

  closureType?: WorkshopClosureType;
  closureMessage?: string;

  isActive?: boolean;
}

export type UpdateWorkshopDto = Partial<CreateWorkshopDto>;
