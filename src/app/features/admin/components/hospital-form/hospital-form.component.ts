import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CreateHospitalRequest,
  Hospital,
} from '../../../../core/models/hospital';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

type HospitalFormValue = Omit<Hospital, 'id'> & {
  id?: string;
};

@Component({
  selector: 'app-hospital-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './hospital-form.component.html',
})
export class HospitalFormComponent implements OnChanges {
  @Input() hospital: Hospital | null = null;

  @Output() saved = new EventEmitter<Hospital | CreateHospitalRequest>();

  @Output() cancelled = new EventEmitter<void>();

  form: HospitalFormValue = this.getEmptyForm();

  coordinates = '';

  fieldErrors: Partial<Record<keyof Hospital, string>> = {};

  showWarningModal = false;
  warningMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hospital']) {
      this.loadForm();
    }
  }

  save(): void {
    const cleanHospital = this.getCleanHospital();

    this.fieldErrors = this.getFieldErrors(cleanHospital);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.warningMessage =
        'Hay campos obligatorios sin completar. Revisa los campos marcados en rojo.';

      this.showWarningModal = true;

      return;
    }

    this.saved.emit(cleanHospital);
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  reset(): void {
    this.resetForm();
  }

  clearFieldError(field: keyof Hospital): void {
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
    const normalizedErrors: Partial<Record<keyof Hospital, string>> = {};

    for (const [backendField, message] of Object.entries(fields)) {
      const rootField = backendField.split('.')[0];

      const formField = rootField === 'longitude' ? 'latitude' : rootField;

      if (this.isHospitalField(formField)) {
        normalizedErrors[formField] = message;
      }
    }

    this.fieldErrors = {
      ...this.fieldErrors,
      ...normalizedErrors,
    };

    return (
      Object.values(normalizedErrors)[0] ?? 'Revisa los datos del hospital.'
    );
  }

  focusFirstError(): void {
    this.focusFirstInvalidField();
  }

  private loadForm(): void {
    if (this.hospital) {
      this.form = {
        ...this.hospital,
      };

      this.coordinates = `${this.hospital.latitude}, ${this.hospital.longitude}`;
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

  private getEmptyForm(): HospitalFormValue {
    return {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      googleMapsUrl: '',
      schedule: '',
      description: '',
      isActive: true,
    };
  }

  private getCleanHospital(): Hospital | CreateHospitalRequest {
    const coordinates = this.parseCoordinates();

    const payload: CreateHospitalRequest = {
      name: this.cleanText(this.form.name),
      address: this.cleanText(this.form.address),

      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,

      googleMapsUrl: this.form.googleMapsUrl.trim(),

      schedule: this.cleanText(this.form.schedule),

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
    hospital: CreateHospitalRequest,
  ): Partial<Record<keyof Hospital, string>> {
    const errors: Partial<Record<keyof Hospital, string>> = {};

    if (!hospital.name) {
      errors.name = 'Escribe el nombre del hospital.';
    }

    if (!hospital.address) {
      errors.address = 'Escribe la dirección del hospital.';
    }

    if (!this.parseCoordinates()) {
      errors.latitude = 'Pega las coordenadas con el formato: 39.4699, -0.3763';
    }

    if (!hospital.googleMapsUrl) {
      errors.googleMapsUrl = 'Pega el enlace de Google Maps.';
    }

    if (!hospital.schedule) {
      errors.schedule = 'Escribe el horario del voluntariado.';
    }

    if (!hospital.description) {
      errors.description =
        'Escribe una breve descripción del voluntariado hospitalario.';
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
    const fieldOrder: (keyof Hospital)[] = [
      'name',
      'address',
      'latitude',
      'googleMapsUrl',
      'schedule',
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

  private isHospitalField(value: string): value is keyof Hospital {
    const fields: (keyof Hospital)[] = [
      'id',
      'name',
      'address',
      'latitude',
      'longitude',
      'googleMapsUrl',
      'schedule',
      'description',
      'isActive',
    ];

    return fields.includes(value as keyof Hospital);
  }
}
