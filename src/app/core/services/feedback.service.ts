import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppFeedback, CreateFeedbackRequest } from '../models/app-feedback';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/feedback`;

  private readonly feedback = signal<AppFeedback[]>([]);

  loadAdminFeedback() {
    return this.http.get<ApiResponse<AppFeedback[]>>(this.apiUrl).pipe(
      tap((response) => {
        this.feedback.set(response.data);
      }),
    );
  }

  getAdminFeedback(): AppFeedback[] {
    return [...this.feedback()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  addFeedback(payload: CreateFeedbackRequest) {
    return this.http.post<ApiResponse<AppFeedback>>(this.apiUrl, payload);
  }

  markAsReviewed(feedbackId: string) {
    return this.http
      .patch<
        ApiResponse<AppFeedback>
      >(`${this.apiUrl}/${feedbackId}/reviewed`, {})
      .pipe(
        tap((response) => {
          this.feedback.update((currentFeedback) =>
            currentFeedback.map((feedback) =>
              feedback.id === feedbackId ? response.data : feedback,
            ),
          );
        }),
      );
  }
}
