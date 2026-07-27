export interface CreateFriendlySpaceDto {
  name: string;
  categoryId: string;

  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description?: string;

  isActive?: boolean;
}

export type UpdateFriendlySpaceDto = Partial<CreateFriendlySpaceDto>;
