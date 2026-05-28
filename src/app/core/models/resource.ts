export interface ResourcePoint {
  id: string;
  name: string;
  type: 'lactation_room' | 'friendly_space';
  sector?: 'food' | 'fashion' | 'beauty' | 'health' | 'services';
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  description?: string;
  isActive: boolean;
}
