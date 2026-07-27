import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CreateExperienceRequest,
  ExperienceType,
} from '../../../core/models/experiencies';
import { ExperienceService } from '../../../core/services/experience.service';
import { ErrorModalComponent } from '../status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../status-modals/success-modal/success-modal.component';
import { WarningModalComponent } from '../status-modals/warning-modal/warning-modal.component';

@Component({
  selector: 'app-experience-form',
  imports: [
    FormsModule,
    NgClass,
    SuccessModalComponent,
    WarningModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss',
})
export class ExperienceFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly experienceService = inject(ExperienceService);

  type: ExperienceType = 'workshops';

  rating = 0;
  experienceText = '';
  improvement = '';

  isSubmitting = false;

  showSuccessModal = false;
  showWarningModal = false;
  showErrorModal = false;

  errorMessage = 'La experiencia no se ha podido enviar. Inténtalo de nuevo.';

  ngOnInit(): void {
    const routeType = this.route.snapshot.paramMap.get('type');

    if (this.isValidType(routeType)) {
      this.type = routeType;
    }
  }

  setRating(value: number): void {
    this.rating = value;
    this.showWarningModal = false;
  }

  getTitle(): string {
    switch (this.type) {
      case 'workshops':
        return 'Comparte tu experiencia en los talleres de lactancia materna';

      case 'rooms':
        return 'Comparte tu experiencia utilizando una sala de lactancia de la Universitat de València';

      case 'friendly-spaces':
        return 'Comparte tu experiencia en un Espacio Amigo de la Lactancia Materna';

      case 'hospitals':
        return 'Comparte tu experiencia con el voluntariado hospitalario';
    }
  }

  getSubtitle(): string {
    switch (this.type) {
      case 'workshops':
        return 'Comparte tu experiencia para ayudarnos a seguir mejorando los talleres de lactancia materna.';

      case 'rooms':
        return 'Cuéntanos cómo fue tu experiencia utilizando una sala de lactancia de la Universitat de València.';

      case 'friendly-spaces':
        return 'Comparte tu experiencia en un Espacio Amigo de la Lactancia Materna.';

      case 'hospitals':
        return 'Cuéntanos cómo fue el acompañamiento recibido por parte de las voluntarias de Amamanta durante tu estancia hospitalaria.';
    }
  }

  getPlaceholder(): string {
    switch (this.type) {
      case 'workshops':
        return 'Puedes contarnos cómo te sentiste o qué te resultó más útil...';

      case 'rooms':
        return 'Puedes contarnos cómo fue el uso de la sala...';

      case 'friendly-spaces':
        return 'Puedes contarnos cómo fue tu experiencia en el establecimiento...';

      case 'hospitals':
        return 'Puedes contarnos cómo fue el acompañamiento de las voluntarias y qué te resultó más útil...';
    }
  }

  getRatingText(): string {
    switch (this.rating) {
      case 1:
        return 'Necesita mejorar.';

      case 2:
        return 'Podría mejorar en algunos aspectos.';

      case 3:
        return 'Ha sido una experiencia correcta.';

      case 4:
        return 'Ha sido una experiencia muy positiva.';

      case 5:
        return 'Ha sido una experiencia excelente.';

      default:
        return 'Selecciona una valoración.';
    }
  }

  sendExperience(): void {
    if (this.rating === 0 || this.isSubmitting) {
      if (this.rating === 0) {
        this.showWarningModal = true;
      }

      return;
    }

    const text = this.cleanText(this.experienceText);
    const improvement = this.cleanText(this.improvement);

    const payload: CreateExperienceRequest = {
      type: this.type,
      rating: this.rating,

      ...(text
        ? {
            text,
          }
        : {}),

      ...(improvement
        ? {
            improvement,
          }
        : {}),
    };

    this.isSubmitting = true;

    this.experienceService.addExperience(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccessModal = true;
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        this.errorMessage =
          error.error?.error?.message ??
          'La experiencia no se ha podido enviar. Inténtalo de nuevo.';

        this.showErrorModal = true;
      },
    });
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.resetForm();

    this.router.navigate([this.getReturnRoute()]);
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  private resetForm(): void {
    this.rating = 0;
    this.experienceText = '';
    this.improvement = '';
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }

  private isValidType(type: string | null): type is ExperienceType {
    return (
      type === 'workshops' ||
      type === 'rooms' ||
      type === 'friendly-spaces' ||
      type === 'hospitals'
    );
  }

  private getReturnRoute(): string {
    switch (this.type) {
      case 'workshops':
        return '/talleres';

      case 'rooms':
        return '/salas-universitarias';

      case 'friendly-spaces':
        return '/espacios-amigos';

      case 'hospitals':
        return '/hospitales';
    }
  }
}
