import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateFriendlySpaceCategoryRequest,
  FriendlySpaceCategory,
  UpdateFriendlySpaceCategoryRequest,
} from '../models/friendly-space';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class FriendlySpaceCategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/friendly-space-categories`;

  private readonly categories = signal<FriendlySpaceCategory[]>([]);

  loadCategories() {
    return this.http
      .get<ApiResponse<FriendlySpaceCategory[]>>(this.apiUrl)
      .pipe(
        tap((response) => {
          this.categories.set(response.data);
        }),
      );
  }

  getCategories(): FriendlySpaceCategory[] {
    return this.categories().filter((category) => category.isActive);
  }

  getAdminCategories(): FriendlySpaceCategory[] {
    return this.categories();
  }

  addCategory(payload: CreateFriendlySpaceCategoryRequest) {
    return this.http
      .post<ApiResponse<FriendlySpaceCategory>>(this.apiUrl, payload)
      .pipe(
        tap((response) => {
          this.categories.update((categories) => [
            ...categories,
            response.data,
          ]);
        }),
      );
  }

  updateCategory(id: string, payload: UpdateFriendlySpaceCategoryRequest) {
    return this.http
      .patch<
        ApiResponse<FriendlySpaceCategory>
      >(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((response) => {
          this.categories.update((categories) =>
            categories.map((category) =>
              category.id === id ? response.data : category,
            ),
          );
        }),
      );
  }

  deleteCategory(id: string) {
    return this.http
      .delete<ApiResponse<FriendlySpaceCategory>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.categories.update((categories) =>
            categories.filter((category) => category.id !== id),
          );
        }),
      );
  }
}
