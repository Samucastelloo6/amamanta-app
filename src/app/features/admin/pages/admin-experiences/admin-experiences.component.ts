import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  Experience,
  ExperienceType,
} from '../../../../core/models/experiencies';
import { ExperienceService } from '../../../../core/services/experience.service';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';

type ExperienceFilter = 'all' | ExperienceType;

@Component({
  selector: 'app-admin-experiences',
  imports: [
    DatePipe,
    DecimalPipe,
    NgClass,
    ConfirmModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './admin-experiences.component.html',
  styleUrl: './admin-experiences.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminExperiencesComponent implements OnInit {
  private readonly experienceService = inject(ExperienceService);

  readonly selectedFilter = signal<ExperienceFilter>('all');

  readonly experiences = signal<Experience[]>([]);

  readonly showDeleteConfirm = signal(false);
  readonly experienceToDelete = signal<Experience | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  readonly filteredExperiences = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'all') {
      return this.experiences();
    }

    return this.experiences().filter(
      (experience) => experience.type === filter,
    );
  });

  readonly averageRating = computed(() => {
    const experiences = this.filteredExperiences();

    if (experiences.length === 0) {
      return 0;
    }

    const total = experiences.reduce(
      (sum, experience) => sum + experience.rating,
      0,
    );

    return total / experiences.length;
  });

  ngOnInit(): void {
    this.experienceService.loadExperiences().subscribe({
      next: () => {
        this.refreshExperiences();
      },
      error: () => {
        this.showError(
          'No se han podido cargar las experiencias',
          'Ha ocurrido un error al obtener las experiencias. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }

  changeFilter(filter: ExperienceFilter): void {
    this.selectedFilter.set(filter);
  }

  getTypeLabel(type: ExperienceType): string {
    switch (type) {
      case 'workshops':
        return 'Talleres LM';

      case 'rooms':
        return 'Salas lactancia UV';

      case 'friendly-spaces':
        return 'Espacios amigos LM';

      case 'hospitals':
        return 'Voluntariado hospitalario';
    }
  }

  getRatingText(rating: number): string {
    switch (rating) {
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
        return '';
    }
  }

  openDeleteConfirm(experience: Experience): void {
    this.experienceToDelete.set(experience);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.experienceToDelete.set(null);
  }

  deleteSelectedExperience(): void {
    const experience = this.experienceToDelete();

    if (!experience) {
      return;
    }

    this.experienceService.deleteExperience(experience.id).subscribe({
      next: () => {
        this.refreshExperiences();
        this.closeDeleteConfirm();

        this.showSuccess(
          'Experiencia eliminada',
          'La experiencia se ha eliminado correctamente.',
        );
      },
      error: () => {
        this.closeDeleteConfirm();

        this.showError(
          'No se ha podido eliminar la experiencia',
          'La experiencia no se ha eliminado. Inténtalo de nuevo.',
        );
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }

  private refreshExperiences(): void {
    this.experiences.set(this.experienceService.getAdminExperiences());
  }

  private showSuccess(title: string, message: string): void {
    this.successTitle.set(title);
    this.successMessage.set(message);
    this.showSuccessModal.set(true);
  }

  private showError(title: string, message: string): void {
    this.errorTitle.set(title);
    this.errorMessage.set(message);
    this.showErrorModal.set(true);
  }
}
