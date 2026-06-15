export interface ResourcePoint {
  id: string;
  name: string;
  type: 'lactation_room' | 'friendly_space'| 'workshop';
  sector?:
  | 'food'
  | 'fashion'
  | 'books_gifts'
  | 'beauty'
  | 'health'
  | 'restaurants'
  | 'financial'
  | 'others';
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  description?: string;
  isActive: boolean;
  day?: 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes';
  time?: 'morning' | 'afternoon';
    schedule?: string;
    contact?: string;
}
