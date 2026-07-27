import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateUniversityRoomRequest,
  UniversityRoom,
  UpdateUniversityRoomRequest,
} from '../models/university-room';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UniversityRoomService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/university-rooms`;

  private readonly universityRooms = signal<UniversityRoom[]>([]);

  loadUniversityRooms() {
    return this.http.get<ApiResponse<UniversityRoom[]>>(this.apiUrl).pipe(
      tap((response) => {
        this.universityRooms.set(response.data);
      }),
    );
  }

  getUniversityRooms(): UniversityRoom[] {
    return this.universityRooms().filter((room) => room.isActive);
  }

  getAdminUniversityRooms(): UniversityRoom[] {
    return this.universityRooms();
  }

  addUniversityRoom(payload: CreateUniversityRoomRequest) {
    return this.http
      .post<ApiResponse<UniversityRoom>>(this.apiUrl, payload)
      .pipe(
        tap((response) => {
          this.universityRooms.update((rooms) => [...rooms, response.data]);
        }),
      );
  }

  updateUniversityRoom(id: string, payload: UpdateUniversityRoomRequest) {
    return this.http
      .patch<ApiResponse<UniversityRoom>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((response) => {
          this.universityRooms.update((rooms) =>
            rooms.map((room) => (room.id === id ? response.data : room)),
          );
        }),
      );
  }

  deleteUniversityRoom(id: string) {
    return this.http
      .delete<ApiResponse<UniversityRoom>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.universityRooms.update((rooms) =>
            rooms.filter((room) => room.id !== id),
          );
        }),
      );
  }
}
