export interface UniversityRoom {
  id: string;

  name: string;

  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  description?: string;

  isActive: boolean;
}

export type CreateUniversityRoomRequest = Omit<UniversityRoom, 'id'>;

export type UpdateUniversityRoomRequest = Partial<CreateUniversityRoomRequest>;
