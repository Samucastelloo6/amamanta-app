import type { FriendlySpaceCategoryHydratedDocument } from './friendly-space-category.model.js';

export interface FriendlySpaceCategoryResponse {
  id: string;
  name: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export function mapFriendlySpaceCategoryToResponse(
  category: FriendlySpaceCategoryHydratedDocument,
): FriendlySpaceCategoryResponse {
  return {
    id: category.key,
    name: category.name,
    isActive: category.isActive,

    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
