export interface FriendlySpaceCategoryResponse {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
}

export interface CreateFriendlySpaceCategoryDto {
  name: string;
  isActive?: boolean;
}

export type UpdateFriendlySpaceCategoryDto =
  Partial<CreateFriendlySpaceCategoryDto>;
