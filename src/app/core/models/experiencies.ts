export type ExperienceType =
  | 'workshops'
  | 'rooms'
  | 'friendly-spaces'
  | 'hospitals';

export interface Experience {
  id: string;
  type: ExperienceType;
  rating: number;
  text?: string;
  improvement?: string;
  workshopId?: string;
  workshopName?: string;
  date: string;
}

export interface CreateExperienceRequest {
  type: ExperienceType;
  rating: number;
  text?: string;
  improvement?: string;
  workshopId?: string;
}

export interface UpdateExperienceRequest {
  rating?: number;
  text?: string;
  improvement?: string;
  workshopId?: string;
}

export const EXPERIENCE_TEXT_MAX_LENGTH = 2000;
