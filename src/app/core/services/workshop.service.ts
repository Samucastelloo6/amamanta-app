import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Workshop,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
} from '../models/workshop';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class WorkshopService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/workshops`;

  private readonly workshops = signal<Workshop[]>([]);

  loadWorkshops() {
    return this.http
      .get<ApiResponse<Workshop[]>>(this.apiUrl)
      .pipe(tap((response) => this.workshops.set(response.data)));
  }

  getWorkshops(): Workshop[] {
    return this.workshops().filter((workshop) => workshop.isActive);
  }

  getAdminWorkshops(): Workshop[] {
    return this.workshops();
  }

  addWorkshop(workshop: CreateWorkshopRequest) {
    return this.http
      .post<ApiResponse<Workshop>>(this.apiUrl, workshop)
      .pipe(
        tap((response) =>
          this.workshops.update((workshops) => [...workshops, response.data]),
        ),
      );
  }

  updateWorkshop(id: string, payload: UpdateWorkshopRequest) {
    return this.http
      .patch<ApiResponse<Workshop>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((response) =>
          this.workshops.update((workshops) =>
            workshops.map((workshop) =>
              workshop.id === id ? response.data : workshop,
            ),
          ),
        ),
      );
  }

  deleteWorkshop(id: string) {
    return this.http
      .delete<ApiResponse<Workshop>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() =>
          this.workshops.update((workshops) =>
            workshops.filter((workshop) => workshop.id !== id),
          ),
        ),
      );
  }
}
