import { Injectable, signal } from '@angular/core';

import { AppFeedback } from '../models/app-feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly feedback = signal<AppFeedback[]>([]);

  getAdminFeedback(): AppFeedback[] {
    return [...this.feedback()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  getFeedbackById(feedbackId: string): AppFeedback | undefined {
    return this.feedback().find((feedback) => feedback.id === feedbackId);
  }

  addFeedback(feedback: AppFeedback): void {
    this.feedback.update((currentFeedback) => [feedback, ...currentFeedback]);
  }

  markAsReviewed(feedbackId: string): void {
    this.feedback.update((currentFeedback) =>
      currentFeedback.map((feedback) =>
        feedback.id === feedbackId
          ? {
              ...feedback,
              isReviewed: true,
            }
          : feedback,
      ),
    );
  }
}
