import { AppError } from '../../shared/errors/app-error.js';
import { FriendlySpaceModel } from '../friendly-spaces/friendly-space.model.js';
import { FriendlySpaceCategoryModel } from './friendly-space-category.model.js';
import type {
  CreateFriendlySpaceCategoryDto,
  UpdateFriendlySpaceCategoryDto,
} from './friendly-space-category.types.js';

export async function getAllFriendlySpaceCategories() {
  return FriendlySpaceCategoryModel.find()
    .sort({
      name: 1,
    })
    .exec();
}

export async function getFriendlySpaceCategoryByKey(key: string) {
  const category = await FriendlySpaceCategoryModel.findOne({
    key,
  }).exec();

  if (!category) {
    throw new AppError(
      404,
      'La categoría no existe',
      'FRIENDLY_SPACE_CATEGORY_NOT_FOUND',
    );
  }

  return category;
}

export async function createFriendlySpaceCategory(
  data: CreateFriendlySpaceCategoryDto,
) {
  const key = await generateUniqueCategoryKey(data.name);

  return FriendlySpaceCategoryModel.create({
    ...data,
    key,
  });
}

export async function updateFriendlySpaceCategory(
  key: string,
  data: UpdateFriendlySpaceCategoryDto,
) {
  const category = await FriendlySpaceCategoryModel.findOneAndUpdate(
    {
      key,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  ).exec();

  if (!category) {
    throw new AppError(
      404,
      'La categoría no existe',
      'FRIENDLY_SPACE_CATEGORY_NOT_FOUND',
    );
  }

  return category;
}

export async function deleteFriendlySpaceCategory(key: string) {
  const hasAssociatedSpaces = await FriendlySpaceModel.exists({
    categoryKey: key,
  });

  if (hasAssociatedSpaces) {
    throw new AppError(
      409,
      'No puedes eliminar una categoría que tenga espacios asociados',
      'CATEGORY_HAS_FRIENDLY_SPACES',
    );
  }

  const category = await FriendlySpaceCategoryModel.findOneAndDelete({
    key,
  }).exec();

  if (!category) {
    throw new AppError(
      404,
      'La categoría no existe',
      'FRIENDLY_SPACE_CATEGORY_NOT_FOUND',
    );
  }

  return category;
}

async function generateUniqueCategoryKey(name: string): Promise<string> {
  const baseKey = normalizeCategoryKey(name) || `categoria-${Date.now()}`;

  let key = baseKey;
  let suffix = 2;

  while (
    await FriendlySpaceCategoryModel.exists({
      key,
    })
  ) {
    key = `${baseKey}-${suffix}`;
    suffix++;
  }

  return key;
}

function normalizeCategoryKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
