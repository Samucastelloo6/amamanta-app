import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  EXPERIENCE_TEXT_MAX_LENGTH,
  Experience,
  ExperienceType,
  UpdateExperienceRequest,
} from '../../../../core/models/experiencies';
import { getWorkshopLabel, Workshop } from '../../../../core/models/workshop';
import { ExperienceService } from '../../../../core/services/experience.service';
import { WorkshopService } from '../../../../core/services/workshop.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';

type ExperienceFilter = 'all' | ExperienceType;

interface WorkshopOption {
  id: string;
  name: string;
  count: number;
}

interface ExperienceEditForm {
  workshopId: string;
  rating: number;
  text: string;
  improvement: string;
}

@Component({
  selector: 'app-admin-experiences',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    NgClass,
    AppModalComponent,
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
  private readonly workshopService = inject(WorkshopService);

  readonly maxTextLength = EXPERIENCE_TEXT_MAX_LENGTH;

  readonly selectedFilter = signal<ExperienceFilter>('all');

  readonly selectedWorkshopKey = signal<string>('all');

  readonly experiences = signal<Experience[]>([]);

  readonly workshops = signal<Workshop[]>([]);

  readonly experienceToEdit = signal<Experience | null>(null);
  readonly isSavingEdit = signal(false);
  readonly editError = signal<string | null>(null);

  editForm: ExperienceEditForm = {
    workshopId: '',
    rating: 0,
    text: '',
    improvement: '',
  };

  readonly showDeleteConfirm = signal(false);
  readonly experienceToDelete = signal<Experience | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  readonly workshopOptions = computed<WorkshopOption[]>(() => {
    const options = new Map<string, WorkshopOption>();

    for (const experience of this.experiences()) {
      if (experience.type !== 'workshops' || !experience.workshopId) {
        continue;
      }

      const existing = options.get(experience.workshopId);

      if (existing) {
        existing.count += 1;
        continue;
      }

      options.set(experience.workshopId, {
        id: experience.workshopId,
        name: experience.workshopName ?? 'Taller sin nombre',
        count: 1,
      });
    }

    return [...options.values()].sort((optionA, optionB) =>
      optionA.name.localeCompare(optionB.name, 'es'),
    );
  });

  readonly withoutWorkshopCount = computed(
    () =>
      this.experiences().filter(
        (experience) =>
          experience.type === 'workshops' && !experience.workshopId,
      ).length,
  );

  readonly filteredExperiences = computed(() => {
    const filter = this.selectedFilter();

    const byType =
      filter === 'all'
        ? this.experiences()
        : this.experiences().filter((experience) => experience.type === filter);

    if (filter !== 'workshops') {
      return byType;
    }

    const workshopKey = this.selectedWorkshopKey();

    if (workshopKey === 'all') {
      return byType;
    }

    if (workshopKey === 'none') {
      return byType.filter((experience) => !experience.workshopId);
    }

    return byType.filter((experience) => experience.workshopId === workshopKey);
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

    this.workshopService.loadWorkshops().subscribe({
      next: () => {
        this.workshops.set(this.workshopService.getWorkshops());
      },
      error: () => {
        this.workshops.set([]);
      },
    });
  }

  changeFilter(filter: ExperienceFilter): void {
    this.selectedFilter.set(filter);
    this.selectedWorkshopKey.set('all');
  }

  changeWorkshop(workshopKey: string): void {
    this.selectedWorkshopKey.set(workshopKey);
  }

  showOnlyWithoutWorkshop(): void {
    this.selectedFilter.set('workshops');
    this.selectedWorkshopKey.set('none');
  }

  getWorkshopLabel(workshop: Workshop): string {
    return getWorkshopLabel(workshop);
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

  getEditButtonLabel(experience: Experience): string {
    return experience.type === 'workshops' && !experience.workshopId
      ? 'Asignar taller'
      : 'Editar';
  }

  getRemainingCharacters(value: string): number {
    return this.maxTextLength - value.length;
  }

  isNearCharacterLimit(value: string): boolean {
    return this.getRemainingCharacters(value) <= 100;
  }

  openEdit(experience: Experience): void {
    this.editForm = {
      workshopId: experience.workshopId ?? '',
      rating: experience.rating,
      text: experience.text ?? '',
      improvement: experience.improvement ?? '',
    };

    this.editError.set(null);
    this.experienceToEdit.set(experience);
  }

  closeEdit(): void {
    if (this.isSavingEdit()) {
      return;
    }

    this.experienceToEdit.set(null);
    this.editError.set(null);
  }

  setEditRating(rating: number): void {
    this.editForm.rating = rating;
    this.editError.set(null);
  }

  saveEdit(): void {
    const experience = this.experienceToEdit();

    if (!experience || this.isSavingEdit()) {
      return;
    }

    const isWorkshopExperience = experience.type === 'workshops';

    if (isWorkshopExperience && !this.editForm.workshopId) {
      this.editError.set(
        'Selecciona el taller al que corresponde esta experiencia.',
      );

      return;
    }

    if (this.editForm.rating < 1 || this.editForm.rating > 5) {
      this.editError.set('Selecciona una valoración entre una y cinco estrellas.');

      return;
    }

    const text = this.cleanText(this.editForm.text);
    const improvement = this.cleanText(this.editForm.improvement);

    if (
      text.length > this.maxTextLength ||
      improvement.length > this.maxTextLength
    ) {
      this.editError.set(
        `Los textos no pueden superar los ${this.maxTextLength} caracteres.`,
      );

      return;
    }

    const workshopChanged =
      isWorkshopExperience &&
      this.editForm.workshopId !== (experience.workshopId ?? '');

    const payload: UpdateExperienceRequest = {
      rating: this.editForm.rating,
      text,
      improvement,

      ...(workshopChanged
        ? {
            workshopId: this.editForm.workshopId,
          }
        : {}),
    };

    this.isSavingEdit.set(true);

    this.experienceService.updateExperience(experience.id, payload).subscribe({
      next: () => {
        this.isSavingEdit.set(false);
        this.refreshExperiences();
        this.experienceToEdit.set(null);
        this.editError.set(null);

        this.showSuccess(
          'Experiencia actualizada',
          'Los cambios se han guardado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.isSavingEdit.set(false);

        this.editError.set(
          error.error?.error?.message ??
            'No se han podido guardar los cambios. Inténtalo de nuevo.',
        );
      },
    });
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

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
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
