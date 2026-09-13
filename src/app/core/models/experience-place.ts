import { ExperienceType } from './experiencies';

/*
 * Una opción del desplegable de sitio. El sitio vive en una colección distinta
 * según el tipo de valoración (talleres, hospitales, salas universitarias o
 * espacios amigos), así que aquí se reduce todo a lo mismo: un identificador y
 * una etiqueta para mostrar.
 */
export interface PlaceOption {
  id: string;
  label: string;
}

/*
 * En talleres, hospitales y salas el sitio se elige de una lista, y las
 * valoraciones se agrupan por él.
 *
 * Los espacios amigos no: son muchos, cambian a menudo y una familia puede
 * haber estado en uno que todavía no está dado de alta. Ahí se escribe el
 * nombre del sitio si se quiere, y las valoraciones van todas juntas.
 */
export function experienceUsesPlaceList(type: ExperienceType): boolean {
  return type !== 'friendly-spaces';
}

/* Cómo se llama el sitio en cada tipo, para los textos de la interfaz. */
export const EXPERIENCE_PLACE_NAMES: Record<ExperienceType, string> = {
  workshops: 'taller',
  hospitals: 'hospital',
  rooms: 'sala de lactancia',
  'friendly-spaces': 'espacio amigo',
};

/* En plural, para frases como «Cargando talleres...». */
export const EXPERIENCE_PLACE_NAMES_PLURAL: Record<ExperienceType, string> = {
  workshops: 'talleres',
  hospitals: 'hospitales',
  rooms: 'salas de lactancia',
  'friendly-spaces': 'espacios amigos',
};

/* Con artículo, para frases como «Selecciona el taller». */
export const EXPERIENCE_PLACE_NAMES_WITH_ARTICLE: Record<
  ExperienceType,
  string
> = {
  workshops: 'el taller',
  hospitals: 'el hospital',
  rooms: 'la sala de lactancia',
  'friendly-spaces': 'el espacio amigo',
};

/* Primera opción del filtro. Lleva el género hecho para que suene bien. */
export const EXPERIENCE_PLACE_ALL_LABELS: Record<ExperienceType, string> = {
  workshops: 'Todos los talleres',
  hospitals: 'Todos los hospitales',
  rooms: 'Todas las salas',
  'friendly-spaces': 'Todos los espacios amigos',
};

/* Título del grupo que reúne las valoraciones que no indican sitio. */
export const EXPERIENCE_PLACE_MISSING_LABELS: Record<ExperienceType, string> = {
  workshops: 'Sin taller indicado',
  hospitals: 'Sin hospital indicado',
  rooms: 'Sin sala indicada',
  'friendly-spaces': 'Sin espacio indicado',
};

/* Clave interna del grupo anterior. No se muestra. */
export const EXPERIENCE_PLACE_MISSING_KEY = 'sin-sitio';
