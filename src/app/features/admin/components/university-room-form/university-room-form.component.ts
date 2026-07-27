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
  CreateUniversityRoomRequest,
  UniversityRoom,
} from '../../../../core/models/university-room';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

type UniversityRoomFormValue = Omit<UniversityRoom, 'id'> & {
  id?: string;
};

@Component({
  selector: 'app-university-room-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './university-room-form.component.html',
})
export class UniversityRoomFormComponent implements OnChanges {
  @Input() room: UniversityRoom | null = null;

  @Output() saved = new EventEmitter<
    UniversityRoom | CreateUniversityRoomRequest
  >();

  @Output() cancelled = new EventEmitter<void>();

  form: UniversityRoomFormValue = this.getEmptyForm();

  coordinates = '';

  fieldErrors: Partial<Record<keyof UniversityRoom, string>> = {};

  showWarningModal = false;
  warningMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room']) {
      this.loadForm();
    }
  }

  save(): void {
    const cleanRoom = this.getCleanRoom();

    this.fieldErrors = this.getFieldErrors(cleanRoom);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.warningMessage =
        'Hay campos obligatorios sin completar. Revisa los campos marcados en rojo.';

      this.showWarningModal = true;

      return;
    }

    this.saved.emit(cleanRoom);
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  reset(): void {
    this.resetForm();
  }

  clearFieldError(field: keyof UniversityRoom): void {
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
    const normalizedErrors: Partial<Record<keyof UniversityRoom, string>> = {};

    for (const [backendField, message] of Object.entries(fields)) {
      const rootField = backendField.split('.')[0];

      const formField = rootField === 'longitude' ? 'latitude' : rootField;

      if (this.isUniversityRoomField(formField)) {
        normalizedErrors[formField] = message;
      }
    }

    this.fieldErrors = {
      ...this.fieldErrors,
      ...normalizedErrors,
    };

    return (
      Object.values(normalizedErrors)[0] ??
      'Revisa los datos de la sala universitaria.'
    );
  }

  focusFirstError(): void {
    this.focusFirstInvalidField();
  }

  private loadForm(): void {
    if (this.room) {
      this.form = {
        ...this.room,
      };

      this.coordinates = `${this.room.latitude}, ${this.room.longitude}`;
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

  private getEmptyForm(): UniversityRoomFormValue {
    return {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      googleMapsUrl: '',
      description: '',
      isActive: true,
    };
  }

  private getCleanRoom(): UniversityRoom | CreateUniversityRoomRequest {
    const coordinates = this.parseCoordinates();

    const payload: CreateUniversityRoomRequest = {
      name: this.cleanText(this.form.name),
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
    room: CreateUniversityRoomRequest,
  ): Partial<Record<keyof UniversityRoom, string>> {
    const errors: Partial<Record<keyof UniversityRoom, string>> = {};

    if (!room.name) {
      errors.name = 'Escribe el nombre de la sala.';
    }

    if (!room.address) {
      errors.address = 'Escribe la dirección de la sala.';
    }

    if (!this.parseCoordinates()) {
      errors.latitude = 'Pega las coordenadas con el formato: 39.4699, -0.3763';
    }

    if (!room.googleMapsUrl) {
      errors.googleMapsUrl = 'Pega el enlace de Google Maps.';
    }

    if (!room.description) {
      errors.description = 'Escribe una breve descripción de la sala.';
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
    const fieldOrder: (keyof UniversityRoom)[] = [
      'name',
      'address',
      'latitude',
      'googleMapsUrl',
      'description',
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

  private isUniversityRoomField(value: string): value is keyof UniversityRoom {
    const fields: (keyof UniversityRoom)[] = [
      'id',
      'name',
      'address',
      'latitude',
      'longitude',
      'googleMapsUrl',
      'description',
      'isActive',
    ];

    return fields.includes(value as keyof UniversityRoom);
  }
}
