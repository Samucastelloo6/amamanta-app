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
