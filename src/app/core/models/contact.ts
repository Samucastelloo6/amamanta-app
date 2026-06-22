export interface ContactEmail {
  id: string;
  title: string;
  description: string;
  email: string;
}

export interface ContactPhone {
  id: string;
  name: string;
  description: string;
  phone: string;
}

export interface ContactLocation {
  title: string;
  building: string;
  floor: string;
  address: string;
  description: string;
  googleMapsUrl: string;
}
