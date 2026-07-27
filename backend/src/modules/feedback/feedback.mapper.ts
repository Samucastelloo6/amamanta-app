import type { FeedbackHydratedDocument } from './feedback.model.js';

export interface FeedbackResponse {
  id: string;
  rating: number;
  categories: string[];

  positive?: string;
  improvement?: string;

  date: string;
  isReviewed: boolean;
}

export function mapFeedbackToResponse(
  feedback: FeedbackHydratedDocument,
): FeedbackResponse {
  return {
    id: feedback._id.toString(),
    rating: feedback.rating,
    categories: [...feedback.categories],

    ...(feedback.positive
      ? {
          positive: feedback.positive,
        }
      : {}),

    ...(feedback.improvement
      ? {
          improvement: feedback.improvement,
        }
      : {}),

    date: feedback.createdAt.toISOString(),
    isReviewed: feedback.isReviewed,
  };
}
