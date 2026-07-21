import { Injectable, signal } from '@angular/core';
import { FriendlySpaceCategory } from '../models/friendly-space';

@Injectable({
  providedIn: 'root',
})
export class FriendlySpaceCategoryService {
  private readonly categories = signal<FriendlySpaceCategory[]>([
    {
      id: 'food',
      name: 'Alimentación',
      isActive: true,
    },
    {
      id: 'fashion',
      name: 'Moda',
      isActive: true,
    },
    {
      id: 'books_gifts',
      name: 'Librerías y regalos',
      isActive: true,
    },
    {
      id: 'beauty',
      name: 'Belleza',
      isActive: true,
    },
    {
      id: 'health',
      name: 'Salud',
      isActive: true,
    },
    {
      id: 'restaurants',
      name: 'Cafés y restaurantes',
      isActive: true,
    },
    {
      id: 'others',
      name: 'Otros',
      isActive: true,
    },
  ]);

  getCategories(): FriendlySpaceCategory[] {
    return this.categories().filter((category) => category.isActive);
  }

  getAdminCategories(): FriendlySpaceCategory[] {
    return this.categories();
  }

  addCategory(category: FriendlySpaceCategory): void {
    this.categories.update((categories) => [...categories, category]);
  }

  updateCategory(updatedCategory: FriendlySpaceCategory): void {
    this.categories.update((categories) =>
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      ),
    );
  }

  deleteCategory(categoryId: string): void {
    this.categories.update((categories) =>
      categories.filter((category) => category.id !== categoryId),
    );
  }

  generateCategoryId(name: string): string {
    const baseId = name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let id = baseId;
    let suffix = 2;

    while (this.categories().some((category) => category.id === id)) {
      id = `${baseId}-${suffix}`;
      suffix++;
    }

    return id;
  }
}
