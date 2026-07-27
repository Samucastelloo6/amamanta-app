import type { ExperienceType } from './experience.model.js';

export interface CreateExperienceDto {
  type: ExperienceType;
  rating: number;

  text?: string;
  improvement?: string;
}
