export interface CreateUniversityRoomDto {
  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description: string;

  isActive?: boolean;
}

export type UpdateUniversityRoomDto = Partial<CreateUniversityRoomDto>;
