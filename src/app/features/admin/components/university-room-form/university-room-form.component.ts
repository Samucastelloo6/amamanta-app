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

import { UniversityRoom } from '../../../../core/models/university-room';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

@Component({
  selector: 'app-university-room-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './university-room-form.component.html',
})
export class UniversityRoomFormComponent implements OnChanges {
  @Input() room: UniversityRoom | null = null;

  @Output() saved = new EventEmitter<UniversityRoom>();
  @Output() cancelled = new EventEmitter<void>();

  form: UniversityRoom = this.getEmptyForm();

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
    this.resetForm();
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

  private getEmptyForm(): UniversityRoom {
    return {
      id: '',
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      googleMapsUrl: '',
      description: '',
      isActive: true,
    };
  }

  private getCleanRoom(): UniversityRoom {
    const name = this.cleanText(this.form.name);
    const coordinates = this.parseCoordinates();

    return {
      ...this.form,
      id: this.form.id || this.generateId(name),
      name,
      address: this.cleanText(this.form.address),
      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,
      googleMapsUrl: this.form.googleMapsUrl.trim(),
      description: this.cleanText(this.form.description ?? ''),
      isActive: !!this.form.isActive,
    };
  }

  private getFieldErrors(
    room: UniversityRoom,
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

  private generateId(name: string): string {
    const normalizedName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `sala-${normalizedName}-${Date.now()}`;
  }
}
