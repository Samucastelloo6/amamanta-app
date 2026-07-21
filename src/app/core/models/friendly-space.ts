export interface FriendlySpaceCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface FriendlySpace {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  description?: string;
  isActive: boolean;
}
