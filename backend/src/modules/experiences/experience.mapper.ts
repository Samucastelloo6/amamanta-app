import type {
  ExperienceHydratedDocument,
  ExperienceType,
} from './experience.model.js';

export interface ExperienceResponse {
  id: string;

  type: ExperienceType;
  rating: number;

  text?: string;
  improvement?: string;

  date: string;
}

export function mapExperienceToResponse(
  experience: ExperienceHydratedDocument,
): ExperienceResponse {
  return {
    id: experience._id.toString(),

    type: experience.type,
    rating: experience.rating,

    ...(experience.text
      ? {
          text: experience.text,
        }
      : {}),

    ...(experience.improvement
      ? {
          improvement: experience.improvement,
        }
      : {}),

    date: experience.createdAt.toISOString(),
  };
}
