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
  date: string;
}
