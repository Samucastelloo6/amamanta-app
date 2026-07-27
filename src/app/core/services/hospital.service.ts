import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateHospitalRequest,
  Hospital,
  UpdateHospitalRequest,
} from '../models/hospital';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/hospitals`;

  private readonly hospitals = signal<Hospital[]>([]);

  loadHospitals() {
    return this.http.get<ApiResponse<Hospital[]>>(this.apiUrl).pipe(
      tap((response) => {
        this.hospitals.set(response.data);
      }),
    );
  }

  getHospitals(): Hospital[] {
    return this.hospitals().filter((hospital) => hospital.isActive);
  }

  getAdminHospitals(): Hospital[] {
    return this.hospitals();
  }

  addHospital(payload: CreateHospitalRequest) {
    return this.http.post<ApiResponse<Hospital>>(this.apiUrl, payload).pipe(
      tap((response) => {
        this.hospitals.update((hospitals) => [...hospitals, response.data]);
      }),
    );
  }

  updateHospital(id: string, payload: UpdateHospitalRequest) {
    return this.http
      .patch<ApiResponse<Hospital>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((response) => {
          this.hospitals.update((hospitals) =>
            hospitals.map((hospital) =>
              hospital.id === id ? response.data : hospital,
            ),
          );
        }),
      );
  }

  deleteHospital(id: string) {
    return this.http.delete<ApiResponse<Hospital>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.hospitals.update((hospitals) =>
          hospitals.filter((hospital) => hospital.id !== id),
        );
      }),
    );
  }
}
