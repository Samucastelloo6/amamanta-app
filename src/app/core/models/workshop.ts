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

const WORKSHOP_DAY_LABELS: Record<WorkshopDay, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miércoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
};

/*
 * Etiqueta con la que se identifica un taller en desplegables y listados.
 * El nombre por sí solo no basta: puede haber varios talleres en el mismo
 * sitio en días u horarios distintos.
 */
export function getWorkshopLabel(workshop: Workshop): string {
  const day = WORKSHOP_DAY_LABELS[workshop.day] ?? '';
  const mode = workshop.mode === 'online' ? ' · Online' : '';

  return `${workshop.name} — ${day} ${workshop.schedule}${mode}`;
}
