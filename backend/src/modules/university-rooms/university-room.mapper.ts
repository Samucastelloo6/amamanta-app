import type { UniversityRoomHydratedDocument } from './university-room.model.js';

export interface UniversityRoomResponse {
  id: string;

  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export function mapUniversityRoomToResponse(
  room: UniversityRoomHydratedDocument,
): UniversityRoomResponse {
  return {
    id: room._id.toString(),

    name: room.name,
    address: room.address,

    latitude: room.latitude,
    longitude: room.longitude,

    googleMapsUrl: room.googleMapsUrl,

    description: room.description,

    isActive: room.isActive,

    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}
