import { asyncHandler } from '../../shared/utils/async-handler.js';
import { isCountableVisitor } from '../../shared/utils/visitor.js';
import {
  getAnalyticsSummary,
  registerPageView,
  registerVisit,
} from './analytics.service.js';

/*
 * Solo se contabiliza lo que llega desde un navegador real. Los rastreadores y
 * las herramientas automáticas reciben la misma respuesta, pero no suman.
 */
export const registerVisitController = asyncHandler(
  async (request, response) => {
    const userAgent = request.get('user-agent') ?? '';

    if (isCountableVisitor(userAgent)) {
      await registerVisit(request.ip ?? '', userAgent);
    }

    response.status(201).json({
      success: true,
      data: null,
    });
  },
);

export const registerPageViewController = asyncHandler(
  async (request, response) => {
    const userAgent = request.get('user-agent') ?? '';

    if (isCountableVisitor(userAgent)) {
      await registerPageView(request.body);
    }

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
