import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CreateFriendlySpaceRequest,
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

type FriendlySpaceFormValue = Omit<FriendlySpace, 'id'> & {
  id?: string;
};

@Component({
  selector: 'app-friendly-space-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './friendly-space-form.component.html',
})
export class FriendlySpaceFormComponent implements OnChanges {
  @Input() space: FriendlySpace | null = null;
  @Input() categories: FriendlySpaceCategory[] = [];

  @Output() saved = new EventEmitter<
    FriendlySpace | CreateFriendlySpaceRequest
  >();

  @Output() cancelled = new EventEmitter<void>();

  form: FriendlySpaceFormValue = this.getEmptyForm();

  coordinates = '';

  fieldErrors: Partial<Record<keyof FriendlySpace, string>> = {};

  showWarningModal = false;
  warningMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['space']) {
      this.loadForm();
    }

    if (changes['categories'] && !this.form.categoryId) {
      this.form.categoryId = this.getFirstAvailableCategoryId();
    }
  }

  save(): void {
    const cleanSpace = this.getCleanSpace();

    this.fieldErrors = this.getFieldErrors(cleanSpace);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.warningMessage =
        'Hay campos obligatorios sin completar. Revisa los campos marcados en rojo.';

      this.showWarningModal = true;

      return;
    }

    this.saved.emit(cleanSpace);
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  reset(): void {
    this.resetForm();
  }

  clearFieldError(field: keyof FriendlySpace): void {
    delete this.fieldErrors[field];
  }

  clearCoordinatesError(): void {
    delete this.fieldErrors.latitude;
    delete this.fieldErrors.longitude;
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
    this.focusFirstInvalidField();
  }

  applyServerErrors(fields: Record<string, string>): string {
    const normalizedErrors: Partial<Record<keyof FriendlySpace, string>> = {};

    for (const [backendField, message] of Object.entries(fields)) {
      const rootField = backendField.split('.')[0];

      const formField = rootField === 'longitude' ? 'latitude' : rootField;

      if (this.isFriendlySpaceField(formField)) {
        normalizedErrors[formField] = message;
      }
    }

    this.fieldErrors = {
      ...this.fieldErrors,
      ...normalizedErrors,
    };

    return (
      Object.values(normalizedErrors)[0] ??
      'Revisa los datos del espacio amigo.'
    );
  }

  focusFirstError(): void {
    this.focusFirstInvalidField();
  }

  private loadForm(): void {
    if (this.space) {
      this.form = {
        ...this.space,
      };

      this.coordinates = `${this.space.latitude}, ${this.space.longitude}`;
    } else {
      this.form = this.getEmptyForm();
      this.coordinates = '';
    }

    this.fieldErrors = {};
    this.warningMessage = '';
    this.showWarningModal = false;
  }

  private resetForm(): void {
    this.form = this.getEmptyForm();
    this.coordinates = '';
    this.fieldErrors = {};
    this.warningMessage = '';
    this.showWarningModal = false;
  }

  private getEmptyForm(): FriendlySpaceFormValue {
    return {
      name: '',
      categoryId: this.getFirstAvailableCategoryId(),
      address: '',
      latitude: 0,
      longitude: 0,
      googleMapsUrl: '',
      description: '',
      isActive: true,
    };
  }

  private getFirstAvailableCategoryId(): string {
    return (
      this.categories.find((category) => category.isActive)?.id ??
      this.categories[0]?.id ??
      ''
    );
  }

  private getCleanSpace(): FriendlySpace | CreateFriendlySpaceRequest {
    const coordinates = this.parseCoordinates();

    const payload: CreateFriendlySpaceRequest = {
      name: this.cleanText(this.form.name),
      categoryId: this.form.categoryId,
      address: this.cleanText(this.form.address),

      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,

      googleMapsUrl: this.form.googleMapsUrl.trim(),

      description: this.cleanText(this.form.description ?? ''),

      isActive: !!this.form.isActive,
    };

    return this.form.id
      ? {
          id: this.form.id,
          ...payload,
        }
      : payload;
  }

  private getFieldErrors(
    space: CreateFriendlySpaceRequest,
  ): Partial<Record<keyof FriendlySpace, string>> {
    const errors: Partial<Record<keyof FriendlySpace, string>> = {};

    if (!space.name) {
      errors.name = 'Escribe el nombre del espacio.';
    }

    if (!space.categoryId) {
      errors.categoryId = 'Selecciona una categoría.';
    }

    if (!space.address) {
      errors.address = 'Escribe la dirección del espacio.';
    }

    if (!this.parseCoordinates()) {
      errors.latitude = 'Pega las coordenadas con el formato: 39.4699, -0.3763';
    }

    if (!space.googleMapsUrl) {
      errors.googleMapsUrl = 'Pega el enlace de Google Maps.';
    }

    return errors;
  }

  private parseCoordinates(): {
    latitude: number;
    longitude: number;
  } | null {
    const parts = this.coordinates.split(',').map((value) => value.trim());

    if (parts.length !== 2) {
      return null;
    }

    const latitude = Number(parts[0]);
    const longitude = Number(parts[1]);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }

  private focusFirstInvalidField(): void {
    const fieldOrder: (keyof FriendlySpace)[] = [
      'name',
      'categoryId',
      'address',
      'latitude',
      'googleMapsUrl',
    ];

    const firstInvalidField = fieldOrder.find(
      (field) => this.fieldErrors[field],
    );

    if (!firstInvalidField) {
      return;
    }

    setTimeout(() => {
      const element = document.querySelector<HTMLElement>(
        `[name="${firstInvalidField}"]`,
      );

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      element?.focus();
    });
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }

  private isFriendlySpaceField(value: string): value is keyof FriendlySpace {
    const fields: (keyof FriendlySpace)[] = [
      'id',
      'name',
      'categoryId',
      'address',
      'latitude',
      'longitude',
      'googleMapsUrl',
      'description',
      'isActive',
    ];

    return fields.includes(value as keyof FriendlySpace);
  }
}
