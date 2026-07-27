import type { FeedbackCategory } from './feedback.model.js';

export interface CreateFeedbackDto {
  rating: number;
  categories: FeedbackCategory[];
  positive?: string;
  improvement?: string;
}
