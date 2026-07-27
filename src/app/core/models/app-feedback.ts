export type FeedbackCategory =
  | 'Toda la aplicación'
  | 'Salas lactancia UV'
  | 'Talleres LM'
  | 'Espacios amigos LM'
  | 'Actividades'
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

export interface CreateFeedbackRequest {
  rating: number;
  categories: FeedbackCategory[];
  positive?: string;
  improvement?: string;
}
