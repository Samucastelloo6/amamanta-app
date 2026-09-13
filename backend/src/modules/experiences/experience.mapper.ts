import type {
  ExperienceHydratedDocument,
  ExperienceType,
} from './experience.model.js';

export interface ExperienceResponse {
  id: string;

  type: ExperienceType;
  rating: number;

  authorName?: string;

  text?: string;
  improvement?: string;

  placeId?: string;
  placeName?: string;

  date: string;
}

export function mapExperienceToResponse(
  experience: ExperienceHydratedDocument,
): ExperienceResponse {
  /*
   * Se acepta el campo antiguo para que las valoraciones guardadas antes del
   * cambio de nombre sigan mostrándose en su sitio aunque todavía no se haya
   * ejecutado `npm run migrate:experiences`.
   */
  const placeId = experience.placeId ?? experience.workshopId;
  const placeName = experience.placeName ?? experience.workshopName;

  return {
    id: experience._id.toString(),

    type: experience.type,
    rating: experience.rating,

    ...(experience.authorName
      ? {
          authorName: experience.authorName,
        }
      : {}),

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

    ...(placeId
      ? {
          placeId: placeId.toString(),
        }
      : {}),

    ...(placeName
      ? {
          placeName,
        }
      : {}),

    date: experience.createdAt.toISOString(),
  };
}
