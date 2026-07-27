import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { FeedbackModel } from './feedback.model.js';
import type { CreateFeedbackDto } from './feedback.types.js';

export async function getAllFeedback() {
  return FeedbackModel.find()
    .sort({
      createdAt: -1,
    })
    .exec();
}

export async function createFeedback(data: CreateFeedbackDto) {
  const payload = {
    rating: data.rating,
    categories: data.categories,
    ...(data.positive
      ? {
          positive: data.positive,
        }
      : {}),
    ...(data.improvement
      ? {
          improvement: data.improvement,
        }
      : {}),
    isReviewed: false,
  };

  return FeedbackModel.create(payload);
}

export async function markFeedbackAsReviewed(id: string) {
  validateFeedbackId(id);

  const feedback = await FeedbackModel.findByIdAndUpdate(
    id,
    {
      isReviewed: true,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  ).exec();

  if (!feedback) {
    throw new AppError(404, 'La valoración no existe', 'FEEDBACK_NOT_FOUND');
  }

  return feedback;
}

function validateFeedbackId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador de la valoración no es válido',
      'INVALID_FEEDBACK_ID',
    );
  }
}
