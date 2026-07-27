import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateFriendlySpaceRequest,
  FriendlySpace,
  UpdateFriendlySpaceRequest,
} from '../models/friendly-space';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class FriendlySpacesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/friendly-spaces`;

  private readonly friendlySpaces = signal<FriendlySpace[]>([]);

  loadFriendlySpaces() {
    return this.http.get<ApiResponse<FriendlySpace[]>>(this.apiUrl).pipe(
      tap((response) => {
        this.friendlySpaces.set(response.data);
      }),
    );
  }

  getFriendlySpaces(): FriendlySpace[] {
    return this.friendlySpaces().filter((space) => space.isActive);
  }

  getAdminFriendlySpaces(): FriendlySpace[] {
    return this.friendlySpaces();
  }

  addFriendlySpace(payload: CreateFriendlySpaceRequest) {
    return this.http
      .post<ApiResponse<FriendlySpace>>(this.apiUrl, payload)
      .pipe(
        tap((response) => {
          this.friendlySpaces.update((spaces) => [...spaces, response.data]);
        }),
      );
  }

  updateFriendlySpace(id: string, payload: UpdateFriendlySpaceRequest) {
    return this.http
      .patch<ApiResponse<FriendlySpace>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((response) => {
          this.friendlySpaces.update((spaces) =>
            spaces.map((space) => (space.id === id ? response.data : space)),
          );
        }),
      );
  }

  deleteFriendlySpace(id: string) {
    return this.http
      .delete<ApiResponse<FriendlySpace>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.friendlySpaces.update((spaces) =>
            spaces.filter((space) => space.id !== id),
          );
        }),
      );
  }
}
