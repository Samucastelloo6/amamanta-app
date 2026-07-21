export type FeedbackCategory =
  | 'Toda la aplicación'
  | 'Salas universitarias'
  | 'Talleres'
  | 'Espacios amigos'
  | 'Eventos'
  | 'Facilidad de uso';

export interface AppFeedback {
  id: string;

  rating: number;

  categories: FeedbackCategory[];

  positive?: string;

  improvement?: string;

  date: string;

  isReviewed: boolean;
}
