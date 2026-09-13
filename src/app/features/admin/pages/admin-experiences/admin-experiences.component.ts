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
  EXPERIENCE_PLACE_NAMES,
  EXPERIENCE_PLACE_NAMES_WITH_ARTICLE,
  experienceUsesPlaceList,
  PlaceOption,
} from '../../../../core/models/experience-place';
import {
  EXPERIENCE_ANONYMOUS_LABEL,
  EXPERIENCE_AUTHOR_MAX_LENGTH,
  EXPERIENCE_PLACE_NAME_MAX_LENGTH,
  EXPERIENCE_TEXT_MAX_LENGTH,
  Experience,
  ExperienceType,
  UpdateExperienceRequest,
} from '../../../../core/models/experiencies';
import { ExperiencePlaceService } from '../../../../core/services/experience-place.service';
import { ExperienceService } from '../../../../core/services/experience.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { PlacePickerComponent } from '../../../../shared/components/place-picker/place-picker.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';

type ExperienceFilter = 'all' | ExperienceType;

interface PlaceFilterOption {
  id: string;
  name: string;
  count: number;
}

interface ExperienceEditForm {
  placeId: string;
  /* Espacios amigos: el nombre del sitio es texto libre. */
  placeName: string;
  authorName: string;
  rating: number;
  text: string;
  improvement: string;
}

/* Le falta el sitio y es de un tipo en el que hay que asignarlo. */
function isPendingPlace(experience: Experience): boolean {
  return experienceUsesPlaceList(experience.type) && !experience.placeId;
}

const EMPTY_PLACES: Record<ExperienceType, PlaceOption[]> = {
  workshops: [],
  hospitals: [],
  rooms: [],
  'friendly-spaces': [],
};

@Component({
  selector: 'app-admin-experiences',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    NgClass,
    AppModalComponent,
    PlacePickerComponent,
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
  private readonly placeService = inject(ExperiencePlaceService);

  readonly maxTextLength = EXPERIENCE_TEXT_MAX_LENGTH;
  readonly maxAuthorLength = EXPERIENCE_AUTHOR_MAX_LENGTH;
  readonly maxPlaceNameLength = EXPERIENCE_PLACE_NAME_MAX_LENGTH;
  readonly anonymousLabel = EXPERIENCE_ANONYMOUS_LABEL;

  readonly selectedFilter = signal<ExperienceFilter>('all');

  readonly selectedPlaceKey = signal<string>('all');

  readonly experiences = signal<Experience[]>([]);

  /* Listas de sitios de los cuatro tipos, para el desplegable de edición. */
  readonly placesByType =
    signal<Record<ExperienceType, PlaceOption[]>>(EMPTY_PLACES);

  readonly experienceToEdit = signal<Experience | null>(null);
  readonly isSavingEdit = signal(false);
  readonly editError = signal<string | null>(null);

  editForm: ExperienceEditForm = {
    placeId: '',
    placeName: '',
    authorName: '',
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

  /* Las valoraciones del tipo seleccionado, antes de filtrar por sitio. */
  private readonly experiencesByType = computed(() => {
    const filter = this.selectedFilter();

    return filter === 'all'
      ? this.experiences()
      : this.experiences().filter((experience) => experience.type === filter);
  });

  readonly placeOptions = computed<PlaceFilterOption[]>(() => {
    const options = new Map<string, PlaceFilterOption>();

    for (const experience of this.experiencesByType()) {
      if (!experience.placeId) {
        continue;
      }

      const existing = options.get(experience.placeId);

      if (existing) {
        existing.count += 1;
        continue;
      }

      options.set(experience.placeId, {
        id: experience.placeId,
        name: experience.placeName ?? 'Sitio sin nombre',
        count: 1,
      });
    }

    return [...options.values()].sort((optionA, optionB) =>
      optionA.name.localeCompare(optionB.name, 'es'),
    );
  });

  /*
   * Solo cuentan como «sin asignar» las de los tipos que eligen el sitio de
   * una lista. En espacios amigos no hay nada que asignar.
   */
  readonly withoutPlaceCount = computed(
    () => this.experiencesByType().filter(isPendingPlace).length,
  );

  /* Opciones del filtro de sitio, ya con su recuento. */
  readonly placeFilterOptions = computed<PlaceOption[]>(() => [
    {
      id: 'all',
      label: `Todos los sitios (${this.experiencesByType().length})`,
    },

    ...this.placeOptions().map((option) => ({
      id: option.id,
      label: `${option.name} (${option.count})`,
    })),

    ...(this.withoutPlaceCount() > 0
      ? [
          {
            id: 'none',
            label: `Sin sitio indicado (${this.withoutPlaceCount()})`,
          },
        ]
      : []),
  ]);

  readonly filteredExperiences = computed(() => {
    const byType = this.experiencesByType();

    const placeKey = this.selectedPlaceKey();

    if (placeKey === 'all') {
      return byType;
    }

    if (placeKey === 'none') {
      return byType.filter(isPendingPlace);
    }

    return byType.filter((experience) => experience.placeId === placeKey);
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

  /* Los sitios que se pueden elegir para la valoración que se está editando. */
  readonly editPlaceOptions = computed<PlaceOption[]>(() => {
    const experience = this.experienceToEdit();

    if (!experience) {
      return [];
    }

    return this.placesByType()[experience.type];
  });

  /* «Taller», «Hospital»... para la etiqueta del campo en el modal. */
  readonly editPlaceLabel = computed(() => {
    const experience = this.experienceToEdit();

    const name = experience
      ? EXPERIENCE_PLACE_NAMES[experience.type]
      : 'sitio';

    return name.charAt(0).toUpperCase() + name.slice(1);
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

    this.placeService.loadAllPlaces().subscribe({
      next: (places) => {
        this.placesByType.set(places);
      },
      error: () => {
        this.placesByType.set(EMPTY_PLACES);
      },
    });
  }

  changeFilter(filter: ExperienceFilter): void {
    this.selectedFilter.set(filter);
    this.selectedPlaceKey.set('all');
  }

  changePlace(placeKey: string): void {
    this.selectedPlaceKey.set(placeKey);
  }

  showOnlyWithoutPlace(): void {
    this.selectedPlaceKey.set('none');
  }

  getAuthorLabel(experience: Experience): string {
    return experience.authorName ?? this.anonymousLabel;
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

  usesPlaceList(experience: Experience): boolean {
    return experienceUsesPlaceList(experience.type);
  }

  /* Le falta el sitio y hay que asignárselo. */
  isPendingPlace(experience: Experience): boolean {
    return isPendingPlace(experience);
  }

  getEditButtonLabel(experience: Experience): string {
    return isPendingPlace(experience) ? 'Asignar sitio' : 'Editar';
  }

  getPlacePrompt(experience: Experience): string {
    return `Selecciona ${EXPERIENCE_PLACE_NAMES_WITH_ARTICLE[experience.type]}`;
  }

  getRemainingCharacters(value: string): number {
    return this.maxTextLength - value.length;
  }

  isNearCharacterLimit(value: string): boolean {
    return this.getRemainingCharacters(value) <= 100;
  }

  openEdit(experience: Experience): void {
    this.editForm = {
      placeId: experience.placeId ?? '',
      placeName: experience.placeName ?? '',
      authorName: experience.authorName ?? '',
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

    const usesList = experienceUsesPlaceList(experience.type);

    if (usesList && !this.editForm.placeId) {
      this.editError.set(
        `${this.getPlacePrompt(experience)} al que corresponde esta valoración.`,
      );

      return;
    }

    if (this.editForm.rating < 1 || this.editForm.rating > 5) {
      this.editError.set('Selecciona una valoración entre una y cinco estrellas.');

      return;
    }

    const authorName = this.cleanText(this.editForm.authorName);
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

    if (authorName.length > this.maxAuthorLength) {
      this.editError.set(
        `El nombre no puede superar los ${this.maxAuthorLength} caracteres.`,
      );

      return;
    }

    const placeChanged = this.editForm.placeId !== (experience.placeId ?? '');

    /*
     * El nombre y los textos se envían siempre, también vacíos: así es como se
     * borran (un nombre vacío deja la valoración como anónima).
     *
     * En espacios amigos el sitio es texto libre, así que va por el mismo
     * camino; en el resto solo se manda el identificador si ha cambiado.
     */
    const payload: UpdateExperienceRequest = {
      rating: this.editForm.rating,
      authorName,
      text,
      improvement,

      ...(usesList
        ? placeChanged
          ? {
              placeId: this.editForm.placeId,
            }
          : {}
        : {
            placeName: this.cleanText(this.editForm.placeName),
          }),
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
