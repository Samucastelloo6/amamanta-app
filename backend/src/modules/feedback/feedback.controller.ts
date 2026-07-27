import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapFeedbackToResponse } from './feedback.mapper.js';
import {
  createFeedback,
  getAllFeedback,
  markFeedbackAsReviewed,
} from './feedback.service.js';

function getFeedbackId(id: string | string[] | undefined): string {
  if (typeof id !== 'string') {
    throw new AppError(
      400,
      'El identificador de la valoración es obligatorio',
      'FEEDBACK_ID_REQUIRED',
    );
  }

  return id;
}

export const getAllFeedbackController = asyncHandler(
  async (_request, response) => {
    const feedback = await getAllFeedback();

    response.status(200).json({
      success: true,
      data: feedback.map(mapFeedbackToResponse),
    });
  },
);

export const createFeedbackController = asyncHandler(
  async (request, response) => {
    const feedback = await createFeedback(request.body);

    response.status(201).json({
      success: true,
      data: mapFeedbackToResponse(feedback),
    });
  },
);

export const markFeedbackAsReviewedController = asyncHandler(
  async (request, response) => {
    const id = getFeedbackId(request.params.id);
    const feedback = await markFeedbackAsReviewed(id);

    response.status(200).json({
      success: true,
      data: mapFeedbackToResponse(feedback),
    });
  },
);
