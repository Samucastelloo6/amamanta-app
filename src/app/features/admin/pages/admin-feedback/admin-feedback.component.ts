import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';

import { AppFeedback } from '../../../../core/models/app-feedback';
import { FeedbackService } from '../../../../core/services/feedback.service';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';

type FeedbackFilter = 'all' | 'pending' | 'reviewed';

@Component({
  selector: 'app-admin-feedback',
  imports: [DatePipe, DecimalPipe, NgClass, SuccessModalComponent],
  templateUrl: './admin-feedback.component.html',
  styleUrl: './admin-feedback.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminFeedbackComponent {
  private readonly feedbackService = inject(FeedbackService);

  readonly selectedFilter = signal<FeedbackFilter>('all');

  readonly feedback = signal<AppFeedback[]>([]);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly filteredFeedback = computed(() => {
    switch (this.selectedFilter()) {
      case 'pending':
        return this.feedback().filter((item) => !item.isReviewed);

      case 'reviewed':
        return this.feedback().filter((item) => item.isReviewed);

      default:
        return this.feedback();
    }
  });

  readonly averageRating = computed(() => {
    const feedback = this.filteredFeedback();

    if (feedback.length === 0) {
      return 0;
    }

    const total = feedback.reduce((sum, item) => sum + item.rating, 0);

    return total / feedback.length;
  });

  readonly pendingCount = computed(
    () => this.feedback().filter((item) => !item.isReviewed).length,
  );

  constructor() {
    this.refreshFeedback();
  }

  changeFilter(filter: FeedbackFilter): void {
    this.selectedFilter.set(filter);
  }

  getRatingText(rating: number): string {
    switch (rating) {
      case 1:
        return 'Todavía necesita mejoras.';

      case 2:
        return 'Puede mejorar en algunos aspectos.';

      case 3:
        return 'Me ha resultado útil.';

      case 4:
        return 'Me ha ayudado mucho.';

      case 5:
        return 'Me ha encantado y la recomendaría a otras madres.';

      default:
        return '';
    }
  }

  markAsReviewed(feedback: AppFeedback): void {
    this.feedbackService.markAsReviewed(feedback.id);

    this.refreshFeedback();

    this.successTitle.set('Valoración revisada');
    this.successMessage.set(
      'La valoración se ha marcado como revisada correctamente.',
    );

    this.showSuccessModal.set(true);
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  private refreshFeedback(): void {
    this.feedback.set(this.feedbackService.getAdminFeedback());
  }
}
