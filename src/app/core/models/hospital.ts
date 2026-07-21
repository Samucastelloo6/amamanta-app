export interface Hospital {
  id: string;
  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  schedule: string;
  description: string;

  isActive: boolean;
}
