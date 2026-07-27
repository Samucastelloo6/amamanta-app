import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapCollaborateToResponse } from './collaborate.mapper.js';
import { getCollaborateInformation } from './collaborate.service.js';

export const getCollaborateInformationController = asyncHandler(
  async (_request, response) => {
    const collaborate = await getCollaborateInformation();

    response.status(200).json({
      success: true,
      data: mapCollaborateToResponse(collaborate),
    });
  },
);
