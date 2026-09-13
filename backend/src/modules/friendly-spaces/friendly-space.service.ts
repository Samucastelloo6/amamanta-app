import { isValidObjectId } from 'mongoose';

import { AppError } from '../../shared/errors/app-error.js';
import { renamePlaceInExperiences } from '../experiences/experience.places.js';
import { FriendlySpaceCategoryModel } from '../friendly-space-categories/friendly-space-category.model.js';
import { FriendlySpaceModel } from './friendly-space.model.js';
import type {
  CreateFriendlySpaceDto,
  UpdateFriendlySpaceDto,
} from './friendly-space.types.js';

export async function getAllFriendlySpaces() {
  return FriendlySpaceModel.find()
    .sort({
      name: 1,
    })
    .exec();
}

export async function getFriendlySpaceById(id: string) {
  validateFriendlySpaceId(id);

  const space = await FriendlySpaceModel.findById(id).exec();

  if (!space) {
    throw new AppError(
      404,
      'El espacio amigo no existe',
      'FRIENDLY_SPACE_NOT_FOUND',
    );
  }

  return space;
}

export async function createFriendlySpace(data: CreateFriendlySpaceDto) {
  await ensureCategoryExists(data.categoryId);

  return FriendlySpaceModel.create({
    ...data,
    categoryKey: data.categoryId,
  });
}

export async function updateFriendlySpace(
  id: string,
  data: UpdateFriendlySpaceDto,
) {
  validateFriendlySpaceId(id);

  if (data.categoryId) {
    await ensureCategoryExists(data.categoryId);
  }

  const { categoryId, ...rest } = data;

  const updateData = {
    ...rest,
    ...(categoryId
      ? {
          categoryKey: categoryId,
        }
      : {}),
  };

  const space = await FriendlySpaceModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();

  if (!space) {
    throw new AppError(
      404,
      'El espacio amigo no existe',
      'FRIENDLY_SPACE_NOT_FOUND',
    );
  }

  if (data.name !== undefined) {
    await renamePlaceInExperiences(space._id, space.name);
  }

  return space;
}

export async function deleteFriendlySpace(id: string) {
  validateFriendlySpaceId(id);

  const space = await FriendlySpaceModel.findByIdAndDelete(id).exec();

  if (!space) {
    throw new AppError(
      404,
      'El espacio amigo no existe',
      'FRIENDLY_SPACE_NOT_FOUND',
    );
  }

  return space;
}

async function ensureCategoryExists(categoryKey: string): Promise<void> {
  const category = await FriendlySpaceCategoryModel.findOne({
    key: categoryKey,
  }).exec();

  if (!category) {
    throw new AppError(
      400,
      'La categoría seleccionada no existe',
      'FRIENDLY_SPACE_CATEGORY_NOT_FOUND',
    );
  }

  if (!category.isActive) {
    throw new AppError(
      400,
      'La categoría seleccionada está desactivada',
      'FRIENDLY_SPACE_CATEGORY_INACTIVE',
    );
  }
}

function validateFriendlySpaceId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(
      400,
      'El identificador del espacio amigo no es válido',
      'INVALID_FRIENDLY_SPACE_ID',
    );
  }
}
