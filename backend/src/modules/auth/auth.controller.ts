import { asyncHandler } from '../../shared/utils/async-handler.js';
import { loginAdmin } from './auth.service.js';

export const loginController = asyncHandler(async (request, response) => {
  const result = await loginAdmin(request.body);

  response.status(200).json({
    success: true,
    data: result,
  });
});
