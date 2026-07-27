export interface CreateHospitalDto {
  name: string;
  address: string;

  latitude: number;
  longitude: number;

  googleMapsUrl: string;

  schedule: string;
  description: string;

  isActive?: boolean;
}

export type UpdateHospitalDto = Partial<CreateHospitalDto>;
