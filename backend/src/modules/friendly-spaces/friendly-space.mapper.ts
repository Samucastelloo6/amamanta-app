import type { FriendlySpaceHydratedDocument } from './friendly-space.model.js';

export interface FriendlySpaceResponse {
  id: string;

  name: string;
  categoryId: string;

  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export function mapFriendlySpaceToResponse(
  space: FriendlySpaceHydratedDocument,
): FriendlySpaceResponse {
  return {
    id: space._id.toString(),

    name: space.name,
    categoryId: space.categoryKey,

    address: space.address,

    latitude: space.latitude,
    longitude: space.longitude,

    googleMapsUrl: space.googleMapsUrl,

    description: space.description,

    isActive: space.isActive,

    createdAt: space.createdAt.toISOString(),
    updatedAt: space.updatedAt.toISOString(),
  };
}
