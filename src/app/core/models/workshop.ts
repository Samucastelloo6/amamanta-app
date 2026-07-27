export type WorkshopDay =
  | 'lunes'
  | 'martes'
  | 'miércoles'
  | 'jueves'
  | 'viernes';

export type WorkshopTime = 'morning' | 'afternoon';

export type WorkshopMode = 'presential' | 'online';

export type WorkshopStatus = 'open' | 'temporarily_closed';

export type WorkshopClosureType = 'specific_days' | 'temporary';

export interface WorkshopContact {
  name: string;
  phone: string;
}

export interface Workshop {
  id: string;

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

  isActive: boolean;
}
export type CreateWorkshopRequest = Omit<Workshop, 'id'>;

export type UpdateWorkshopRequest = Partial<CreateWorkshopRequest>;
