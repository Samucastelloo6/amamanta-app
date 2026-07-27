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
  CreateWorkshopRequest,
  Workshop,
  WorkshopContact,
} from '../../../../core/models/workshop';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

type WorkshopFormValue = Omit<Workshop, 'id'> & {
  id?: string;
};

@Component({
  selector: 'app-workshop-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './workshop-form.component.html',
})
export class WorkshopFormComponent implements OnChanges {
  @Input() workshop: Workshop | null = null;

  @Output() saved = new EventEmitter<Workshop | CreateWorkshopRequest>();

  @Output() cancelled = new EventEmitter<void>();

  showWarningModal = false;
  warningMessage = '';

  coordinates = '';

  fieldErrors: Partial<Record<keyof Workshop, string>> = {};

  form: WorkshopFormValue = this.getEmptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workshop']) {
      this.loadForm();
    }
  }

  save(): void {
    const cleanWorkshop = this.getCleanWorkshop();

    this.fieldErrors = this.getFieldErrors(cleanWorkshop);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.warningMessage =
        'Hay campos obligatorios sin completar. Revisa los campos marcados en rojo.';

      this.showWarningModal = true;

      return;
    }

    this.saved.emit(cleanWorkshop);
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  reset(): void {
    this.resetForm();
  }

  addContact(): void {
    this.form.contacts = [
      ...this.form.contacts,
      {
        name: '',
        phone: '',
      },
    ];
  }

  removeContact(index: number): void {
    this.form.contacts = this.form.contacts.filter(
      (_, contactIndex) => contactIndex !== index,
    );

    this.clearFieldError('contacts');
  }

  clearFieldError(field: keyof Workshop): void {
    delete this.fieldErrors[field];
  }

  clearCoordinatesError(): void {
    delete this.fieldErrors.latitude;
    delete this.fieldErrors.longitude;
  }
  applyServerErrors(fields: Record<string, string>): string {
    const normalizedErrors: Partial<Record<keyof Workshop, string>> = {};

    for (const [backendField, message] of Object.entries(fields)) {
      const rootField = backendField.split('.')[0];

      const formField =
        rootField === 'longitude'
          ? 'latitude'
          : rootField.startsWith('contacts')
            ? 'contacts'
            : rootField;

      if (this.isWorkshopField(formField)) {
        normalizedErrors[formField] = message;
      }
    }

    this.fieldErrors = {
      ...this.fieldErrors,
      ...normalizedErrors,
    };

    return Object.values(normalizedErrors)[0] ?? 'Revisa los datos del taller.';
  }

  focusFirstError(): void {
    this.focusFirstInvalidField();
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
    this.focusFirstInvalidField();
  }

  onModeChange(): void {
    this.clearFieldError('mode');

    if (this.form.mode === 'online') {
      this.form.address = 'Online mediante Zoom';
      this.form.latitude = 0;
      this.form.longitude = 0;
      this.form.googleMapsUrl = '';
      this.coordinates = '';

      this.clearFieldError('address');
      this.clearCoordinatesError();

      return;
    }

    if (this.form.address === 'Online mediante Zoom') {
      this.form.address = '';
    }
  }

  onStatusChange(): void {
    this.clearFieldError('status');

    if (this.form.status === 'temporarily_closed') {
      this.form.closureType ??= 'specific_days';

      return;
    }

    this.form.closureType = undefined;
    this.form.closureMessage = '';

    this.clearFieldError('closureMessage');
  }

  private loadForm(): void {
    if (!this.workshop) {
      this.form = this.getEmptyForm();
      this.coordinates = '';
    } else {
      this.form = {
        ...this.workshop,
        mode: this.workshop.mode ?? 'presential',
        status: this.workshop.status ?? 'open',

        closureType:
          this.workshop.status === 'temporarily_closed'
            ? (this.workshop.closureType ?? 'specific_days')
            : undefined,

        closureMessage: this.workshop.closureMessage ?? '',

        contacts: this.workshop.contacts.map((contact) => ({
          ...contact,
        })),
      };

      this.coordinates =
        this.form.mode === 'online'
          ? ''
          : `${this.form.latitude}, ${this.form.longitude}`;
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

  private getEmptyForm(): WorkshopFormValue {
    return {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      googleMapsUrl: '',
      day: 'lunes',
      time: 'morning',
      schedule: '',
      contacts: [],
      notes: '',
      mode: 'presential',
      status: 'open',
      closureType: undefined,
      closureMessage: '',
      isActive: true,
    };
  }

  private getCleanWorkshop(): Workshop | CreateWorkshopRequest {
    const name = this.cleanText(this.form.name);
    const mode = this.form.mode ?? 'presential';
    const status = this.form.status ?? 'open';

    const parsedCoordinates =
      mode === 'online' ? null : this.parseCoordinates();

    const contacts: WorkshopContact[] = this.form.contacts
      .map((contact) => ({
        name: this.cleanText(contact.name),
        phone: contact.phone.replace(/\s+/g, ''),
      }))
      .filter((contact) => contact.name || contact.phone);

    const payload: CreateWorkshopRequest = {
      name,

      address:
        mode === 'online'
          ? 'Online mediante Zoom'
          : this.cleanText(this.form.address),

      latitude: mode === 'online' ? 0 : (parsedCoordinates?.latitude ?? 0),

      longitude: mode === 'online' ? 0 : (parsedCoordinates?.longitude ?? 0),

      googleMapsUrl: mode === 'online' ? '' : this.form.googleMapsUrl.trim(),

      day: this.form.day,
      time: this.form.time,
      schedule: this.cleanText(this.form.schedule),

      contacts,

      notes: this.cleanText(this.form.notes ?? ''),

      mode,
      status,

      closureType:
        status === 'temporarily_closed'
          ? (this.form.closureType ?? 'specific_days')
          : undefined,

      closureMessage:
        status === 'temporarily_closed'
          ? this.cleanText(this.form.closureMessage ?? '')
          : '',

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
    workshop: CreateWorkshopRequest,
  ): Partial<Record<keyof Workshop, string>> {
    const errors: Partial<Record<keyof Workshop, string>> = {};

    if (!workshop.name) {
      errors.name = 'Escribe el nombre del taller.';
    }

    if (!workshop.schedule) {
      errors.schedule = 'Escribe el horario del taller.';
    }

    if (!workshop.day) {
      errors.day = 'Selecciona el día del taller.';
    }

    if (!workshop.time) {
      errors.time = 'Selecciona la franja horaria.';
    }

    if (!workshop.mode) {
      errors.mode = 'Selecciona la modalidad del taller.';
    }

    if (workshop.mode !== 'online' && !workshop.address) {
      errors.address = 'Escribe la dirección del taller.';
    }

    if (workshop.mode !== 'online' && !this.parseCoordinates()) {
      errors.latitude =
        'Pega las coordenadas con el formato: 39.57551017026134, -0.3264927077590832';
    }

    const hasIncompleteContact = workshop.contacts.some(
      (contact) => !contact.name || !contact.phone,
    );

    if (hasIncompleteContact) {
      errors.contacts = 'Completa el nombre y teléfono de cada responsable.';
    }

    if (workshop.status === 'temporarily_closed' && !workshop.closureMessage) {
      errors.closureMessage =
        'Indica el motivo o los días en los que permanecerá cerrado.';
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
    const fieldOrder: (keyof Workshop)[] = [
      'name',
      'mode',
      'day',
      'time',
      'schedule',
      'address',
      'latitude',
      'googleMapsUrl',
      'contacts',
      'closureType',
      'closureMessage',
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

  private isWorkshopField(value: string): value is keyof Workshop {
    const workshopFields: (keyof Workshop)[] = [
      'id',
      'name',
      'address',
      'latitude',
      'longitude',
      'googleMapsUrl',
      'day',
      'time',
      'schedule',
      'contacts',
      'notes',
      'mode',
      'status',
      'closureType',
      'closureMessage',
      'isActive',
    ];

    return workshopFields.includes(value as keyof Workshop);
  }
}
