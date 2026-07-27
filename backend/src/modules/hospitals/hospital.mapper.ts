import type { HospitalHydratedDocument } from './hospital.model.js';

export interface HospitalResponse {
  id: string;

  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  schedule: string;
  description: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export function mapHospitalToResponse(
  hospital: HospitalHydratedDocument,
): HospitalResponse {
  return {
    id: hospital._id.toString(),

    name: hospital.name,
    address: hospital.address,

    latitude: hospital.latitude,
    longitude: hospital.longitude,

    googleMapsUrl: hospital.googleMapsUrl,

    schedule: hospital.schedule,
    description: hospital.description,

    isActive: hospital.isActive,

    createdAt: hospital.createdAt.toISOString(),
    updatedAt: hospital.updatedAt.toISOString(),
  };
}
