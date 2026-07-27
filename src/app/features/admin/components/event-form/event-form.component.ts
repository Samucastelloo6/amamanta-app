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
  AmamantaEvent,
  CreateEventRequest,
} from '../../../../core/models/amamanta-event';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

type EventFormValue = Omit<AmamantaEvent, 'id'> & {
  id?: string;
};

@Component({
  selector: 'app-event-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnChanges {
  @Input() event: AmamantaEvent | null = null;

  @Output() saved = new EventEmitter<AmamantaEvent | CreateEventRequest>();
  @Output() cancelled = new EventEmitter<void>();

  showWarningModal = false;
  warningMessage = '';

  fieldErrors: Partial<Record<keyof AmamantaEvent, string>> = {};

  form: EventFormValue = this.getEmptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.loadForm();
    }
  }

  save(): void {
    const cleanEvent = this.getCleanEvent();

    this.fieldErrors = this.getFieldErrors(cleanEvent);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.warningMessage =
        'Hay campos obligatorios sin completar. Revisa los campos marcados en rojo.';
      this.showWarningModal = true;
      return;
    }

    this.saved.emit(cleanEvent);
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
    this.focusFirstInvalidField();
  }
  reset(): void {
    this.resetForm();
  }

  clearFieldError(field: keyof AmamantaEvent): void {
    delete this.fieldErrors[field];
  }
  private focusFirstInvalidField(): void {
    const fieldOrder: (keyof AmamantaEvent)[] = [
      'title',
      'date',
      'location',
      'googleMapsUrl',
      'description',
    ];

    const firstInvalidField = fieldOrder.find(
      (field) => this.fieldErrors[field],
    );

    if (!firstInvalidField) return;

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

  private loadForm(): void {
    this.form = this.event ? { ...this.event } : this.getEmptyForm();
    this.fieldErrors = {};
    this.warningMessage = '';
    this.showWarningModal = false;
  }

  private resetForm(): void {
    this.form = this.getEmptyForm();
    this.fieldErrors = {};
    this.warningMessage = '';
    this.showWarningModal = false;
  }

  private getEmptyForm(): EventFormValue {
    return {
      title: '',
      date: '',
      startTime: '',
      location: '',
      googleMapsUrl: '',
      description: '',
      requiresRegistration: false,
      isActive: true,
    };
  }

  private getCleanEvent(): AmamantaEvent | CreateEventRequest {
    const title = this.cleanText(this.form.title);
    const startTime = this.form.startTime.trim();
    const location = this.cleanText(this.form.location);
    const googleMapsUrl = this.form.googleMapsUrl.trim();
    const description = this.cleanText(this.form.description);

    const payload: CreateEventRequest = {
      title,
      date: this.form.date,
      startTime,
      location,
      googleMapsUrl,
      description,
      requiresRegistration: !!this.form.requiresRegistration,
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
    event: CreateEventRequest,
  ): Partial<Record<keyof AmamantaEvent, string>> {
    const errors: Partial<Record<keyof AmamantaEvent, string>> = {};

    if (!event.title) {
      errors.title = 'Escribe el título de la actividad.';
    }

    if (!event.date) {
      errors.date = 'Selecciona la fecha de la actividad.';
    }

    if (!event.location) {
      errors.location = 'Escribe el lugar donde se realizará la actividad.';
    }

    if (!event.googleMapsUrl) {
      errors.googleMapsUrl = 'Añade el enlace de Google Maps.';
    }

    if (!event.description) {
      errors.description = 'Escribe una breve descripción de la actividad.';
    }

    return errors;
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }
}
