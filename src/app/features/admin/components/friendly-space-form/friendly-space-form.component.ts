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
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

@Component({
  selector: 'app-friendly-space-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './friendly-space-form.component.html',
})
export class FriendlySpaceFormComponent implements OnChanges {
  @Input() space: FriendlySpace | null = null;
  @Input() categories: FriendlySpaceCategory[] = [];

  @Output() saved = new EventEmitter<FriendlySpace>();
  @Output() cancelled = new EventEmitter<void>();

  form: FriendlySpace = this.getEmptyForm();

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
    this.resetForm();
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

  private getEmptyForm(): FriendlySpace {
    return {
      id: '',
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

  private getCleanSpace(): FriendlySpace {
    const name = this.cleanText(this.form.name);
    const coordinates = this.parseCoordinates();

    return {
      ...this.form,
      id: this.form.id || this.generateId(name),
      name,
      categoryId: this.form.categoryId,
      address: this.cleanText(this.form.address),
      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,
      googleMapsUrl: this.form.googleMapsUrl.trim(),
      description: this.cleanText(this.form.description ?? ''),
      isActive: !!this.form.isActive,
    };
  }

  private getFieldErrors(
    space: FriendlySpace,
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

  private generateId(name: string): string {
    const normalizedName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `espacio-${normalizedName}-${Date.now()}`;
  }
}
