export type ExperienceType =
  | 'workshops'
  | 'rooms'
  | 'friendly-spaces'
  | 'hospitals';

export interface Experience {
  id: string;
  type: ExperienceType;
  rating: number;

  /* Nombre de quien valora. Si no está, la valoración es anónima. */
  authorName?: string;

  text?: string;
  improvement?: string;

  /* Sitio valorado: el taller, hospital, sala o espacio amigo. */
  placeId?: string;
  placeName?: string;

  date: string;
}

export interface CreateExperienceRequest {
  type: ExperienceType;
  rating: number;
  authorName?: string;
  text?: string;
  improvement?: string;
  placeId?: string;

  /* Solo en espacios amigos: el nombre del sitio escrito a mano. */
  placeName?: string;
}

export interface UpdateExperienceRequest {
  rating?: number;
  authorName?: string;
  text?: string;
  improvement?: string;
  placeId?: string;
  placeName?: string;
}

export const EXPERIENCE_TEXT_MAX_LENGTH = 2000;

export const EXPERIENCE_AUTHOR_MAX_LENGTH = 60;

export const EXPERIENCE_PLACE_NAME_MAX_LENGTH = 150;

/* Lo que se muestra cuando quien valora no ha puesto su nombre. */
export const EXPERIENCE_ANONYMOUS_LABEL = 'Anónima';
