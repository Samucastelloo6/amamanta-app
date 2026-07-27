import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  getAnalyticsSummary,
  registerPageView,
  registerVisit,
} from './analytics.service.js';

export const registerVisitController = asyncHandler(
  async (_request, response) => {
    await registerVisit();

    response.status(201).json({
      success: true,
      data: null,
    });
  },
);

export const registerPageViewController = asyncHandler(
  async (request, response) => {
    await registerPageView(request.body);

    response.status(201).json({
      success: true,
      data: null,
    });
  },
);

export const getAnalyticsSummaryController = asyncHandler(
  async (request, response) => {
    const { year, month } = request.query;

    const summary = await getAnalyticsSummary({
      year: Number(year),
      ...(month !== undefined
        ? {
            month: Number(month),
          }
        : {}),
    });

    response.status(200).json({
      success: true,
      data: summary,
    });
  },
);
