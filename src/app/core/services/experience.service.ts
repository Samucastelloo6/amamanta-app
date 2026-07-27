import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateExperienceRequest,
  Experience,
  ExperienceType,
} from '../models/experiencies';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/experiences`;

  private readonly experiences = signal<Experience[]>([]);

  loadExperiences(type?: ExperienceType) {
    let params = new HttpParams();

    if (type) {
      params = params.set('type', type);
    }

    return this.http
      .get<ApiResponse<Experience[]>>(this.apiUrl, {
        params,
      })
      .pipe(
        tap((response) => {
          this.experiences.set(response.data);
        }),
      );
  }

  getByType(type: ExperienceType): Experience[] {
    return this.experiences()
      .filter((experience) => experience.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getAdminExperiences(): Experience[] {
    return [...this.experiences()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  addExperience(payload: CreateExperienceRequest) {
    return this.http.post<ApiResponse<Experience>>(this.apiUrl, payload);
  }

  deleteExperience(experienceId: string) {
    return this.http
      .delete<ApiResponse<Experience>>(`${this.apiUrl}/${experienceId}`)
      .pipe(
        tap(() => {
          this.experiences.update((experiences) =>
            experiences.filter((experience) => experience.id !== experienceId),
          );
        }),
      );
  }
}
