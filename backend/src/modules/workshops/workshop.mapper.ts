import type { WorkshopHydratedDocument } from './workshop.model.js';

export interface WorkshopResponse {
  id: string;

  name: string;

  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;

  day: 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes';
  time: 'morning' | 'afternoon';
  schedule: string;

  contacts: {
    name: string;
    phone: string;
  }[];

  notes: string;

  mode: 'presential' | 'online';
  status: 'open' | 'temporarily_closed';

  closureType?: 'specific_days' | 'temporary';
  closureMessage: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export function mapWorkshopToResponse(
  workshop: WorkshopHydratedDocument,
): WorkshopResponse {
  return {
    id: workshop._id.toString(),

    name: workshop.name,

    address: workshop.address,
    latitude: workshop.latitude,
    longitude: workshop.longitude,
    googleMapsUrl: workshop.googleMapsUrl,

    day: workshop.day,
    time: workshop.time,
    schedule: workshop.schedule,

    contacts: workshop.contacts.map((contact) => ({
      name: contact.name,
      phone: contact.phone,
    })),

    notes: workshop.notes,

    mode: workshop.mode,
    status: workshop.status,

    ...(workshop.closureType ? { closureType: workshop.closureType } : {}),

    closureMessage: workshop.closureMessage,

    isActive: workshop.isActive,

    createdAt: workshop.createdAt.toISOString(),
    updatedAt: workshop.updatedAt.toISOString(),
  };
}
