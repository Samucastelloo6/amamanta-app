import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapContactToResponse } from './contact.mapper.js';
import { getContactInformation } from './contact.service.js';

export const getContactInformationController = asyncHandler(
  async (_request, response) => {
    const contact = await getContactInformation();

    response.status(200).json({
      success: true,
      data: mapContactToResponse(contact),
    });
  },
);
