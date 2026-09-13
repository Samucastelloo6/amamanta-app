import type { ExperienceType } from './experience.model.js';

export interface CreateExperienceDto {
  type: ExperienceType;
  rating: number;

  authorName?: string;

  text?: string;
  improvement?: string;

  placeId?: string;

  /* Solo en espacios amigos: el nombre del sitio escrito a mano. */
  placeName?: string;

  /* Nombre anterior de placeId, que todavía envía la app antigua. */
  workshopId?: string;
}

export interface UpdateExperienceDto {
  rating?: number;

  authorName?: string;

  text?: string;
  improvement?: string;

  placeId?: string;

  placeName?: string;

  workshopId?: string;
}
