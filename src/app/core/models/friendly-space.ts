export interface FriendlySpaceCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface FriendlySpace {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  description?: string;
  isActive: boolean;
}

export type CreateFriendlySpaceCategoryRequest = Omit<
  FriendlySpaceCategory,
  'id'
>;

export type UpdateFriendlySpaceCategoryRequest =
  Partial<CreateFriendlySpaceCategoryRequest>;

export type CreateFriendlySpaceRequest = Omit<FriendlySpace, 'id'>;

export type UpdateFriendlySpaceRequest = Partial<CreateFriendlySpaceRequest>;
