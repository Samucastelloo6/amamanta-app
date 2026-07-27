import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { mapFriendlySpaceCategoryToResponse } from './friendly-space-category.mapper.js';
import {
  createFriendlySpaceCategory,
  deleteFriendlySpaceCategory,
  getAllFriendlySpaceCategories,
  getFriendlySpaceCategoryByKey,
  updateFriendlySpaceCategory,
} from './friendly-space-category.service.js';

function getCategoryKey(key: string | string[] | undefined): string {
  if (typeof key !== 'string') {
    throw new AppError(
      400,
      'El identificador de la categoría es obligatorio',
      'FRIENDLY_SPACE_CATEGORY_KEY_REQUIRED',
    );
  }

  return key;
}

export const getAllFriendlySpaceCategoriesController = asyncHandler(
  async (_request, response) => {
    const categories = await getAllFriendlySpaceCategories();

    response.status(200).json({
      success: true,
      data: categories.map(mapFriendlySpaceCategoryToResponse),
    });
  },
);

export const getFriendlySpaceCategoryByKeyController = asyncHandler(
  async (request, response) => {
    const key = getCategoryKey(request.params.key);
    const category = await getFriendlySpaceCategoryByKey(key);

    response.status(200).json({
      success: true,
      data: mapFriendlySpaceCategoryToResponse(category),
    });
  },
);

export const createFriendlySpaceCategoryController = asyncHandler(
  async (request, response) => {
    const category = await createFriendlySpaceCategory(request.body);

    response.status(201).json({
      success: true,
      data: mapFriendlySpaceCategoryToResponse(category),
    });
  },
);

export const updateFriendlySpaceCategoryController = asyncHandler(
  async (request, response) => {
    const key = getCategoryKey(request.params.key);

    const category = await updateFriendlySpaceCategory(key, request.body);

    response.status(200).json({
      success: true,
      data: mapFriendlySpaceCategoryToResponse(category),
    });
  },
);

export const deleteFriendlySpaceCategoryController = asyncHandler(
  async (request, response) => {
    const key = getCategoryKey(request.params.key);
    const category = await deleteFriendlySpaceCategory(key);

    response.status(200).json({
      success: true,
      data: mapFriendlySpaceCategoryToResponse(category),
    });
  },
);
