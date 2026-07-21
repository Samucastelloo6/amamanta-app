import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AppFeedback,
  FeedbackCategory,
} from '../../../../core/models/app-feedback';
import { FeedbackService } from '../../../../core/services/feedback.service';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

@Component({
  selector: 'app-feedback',
  imports: [FormsModule, NgClass, SuccessModalComponent, WarningModalComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  private readonly router = inject(Router);
  private readonly feedbackService = inject(FeedbackService);

  rating = 0;
  selectedCategories: FeedbackCategory[] = [];
  positive = '';
  improvement = '';

  showSuccessModal = false;
  showWarningModal = false;

  readonly categories: FeedbackCategory[] = [
    'Toda la aplicación',
    'Salas universitarias',
    'Talleres',
    'Espacios amigos',
    'Eventos',
    'Facilidad de uso',
  ];

  toggleCategory(category: FeedbackCategory): void {
    if (category === 'Toda la aplicación') {
      this.selectedCategories = this.isSelected(category)
        ? []
        : ['Toda la aplicación'];

      return;
    }

    this.selectedCategories = this.selectedCategories.filter(
      (selectedCategory) => selectedCategory !== 'Toda la aplicación',
    );

    if (this.isSelected(category)) {
      this.selectedCategories = this.selectedCategories.filter(
        (selectedCategory) => selectedCategory !== category,
      );
    } else {
      this.selectedCategories = [...this.selectedCategories, category];
    }
  }

  isSelected(category: FeedbackCategory): boolean {
    return this.selectedCategories.includes(category);
  }

  setRating(value: number): void {
    this.rating = value;
    this.showWarningModal = false;
  }

  getRatingText(): string {
    switch (this.rating) {
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
        return 'Selecciona una valoración.';
    }
  }

  sendFeedback(): void {
    if (this.rating === 0) {
      this.showWarningModal = true;
      return;
    }

    const positive = this.cleanText(this.positive);
    const improvement = this.cleanText(this.improvement);

    const feedback: AppFeedback = {
      id: this.generateId(),
      rating: this.rating,
      categories: [...this.selectedCategories],
      date: new Date().toISOString(),
      isReviewed: false,
    };

    if (positive) {
      feedback.positive = positive;
    }

    if (improvement) {
      feedback.improvement = improvement;
    }

    this.feedbackService.addFeedback(feedback);
    this.showSuccessModal = true;
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.resetForm();

    this.router.navigate(['/']);
  }

  private resetForm(): void {
    this.rating = 0;
    this.selectedCategories = [];
    this.positive = '';
    this.improvement = '';
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }

  private generateId(): string {
    return `valoracion-${Date.now()}`;
  }
}
