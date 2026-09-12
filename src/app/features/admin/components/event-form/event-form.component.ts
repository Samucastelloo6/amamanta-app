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
  EventMode,
  eventOnlinePlatforms,
  EventOnlinePlatform,
  getEventPlatformLabel,
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

  readonly platforms = eventOnlinePlatforms;

  showWarningModal = false;
  warningMessage = '';

  fieldErrors: Partial<Record<keyof AmamantaEvent, string>> = {};

  form: EventFormValue = this.getEmptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.loadForm();
    }
  }

  get isOnline(): boolean {
    return this.form.mode === 'online';
  }

  setMode(mode: EventMode): void {
    if (this.form.mode === mode) {
      return;
    }

    this.form.mode = mode;
    this.fieldErrors = {};
  }

  getPlatformLabel(platform: EventOnlinePlatform): string {
    return getEventPlatformLabel(platform);
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
      'onlinePlatform',
      'onlineUrl',
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
      mode: 'presential',
      location: '',
      googleMapsUrl: '',
      onlinePlatform: 'zoom',
      onlineUrl: '',
      onlineCode: '',
      description: '',
      requiresRegistration: false,
      isActive: true,
    };
  }

  private getCleanEvent(): AmamantaEvent | CreateEventRequest {
    const title = this.cleanText(this.form.title);
    const startTime = this.form.startTime.trim();
    const description = this.cleanText(this.form.description);

    const isOnline = this.form.mode === 'online';

    const payload: CreateEventRequest = {
      title,
      date: this.form.date,
      startTime,
      mode: this.form.mode,

      location: isOnline ? '' : this.cleanText(this.form.location),
      googleMapsUrl: isOnline ? '' : this.form.googleMapsUrl.trim(),

      onlineUrl: isOnline ? this.form.onlineUrl.trim() : '',
      onlineCode: isOnline ? this.cleanText(this.form.onlineCode) : '',

      ...(isOnline && this.form.onlinePlatform
        ? {
            onlinePlatform: this.form.onlinePlatform,
          }
        : {}),

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

    if (event.mode === 'online') {
      if (!event.onlinePlatform) {
        errors.onlinePlatform = 'Selecciona la plataforma de la reunión.';
      }

      if (!event.onlineUrl) {
        errors.onlineUrl = 'Añade el enlace de la reunión.';
      } else if (!this.isHttpUrl(event.onlineUrl)) {
        errors.onlineUrl = 'El enlace debe empezar por http:// o https://';
      }
    } else {
      if (!event.location) {
        errors.location = 'Escribe el lugar donde se realizará la actividad.';
      }

      if (!event.googleMapsUrl) {
        errors.googleMapsUrl = 'Añade el enlace de Google Maps.';
      } else if (!this.isHttpUrl(event.googleMapsUrl)) {
        errors.googleMapsUrl = 'El enlace debe empezar por http:// o https://';
      }
    }

    if (!event.description) {
      errors.description = 'Escribe una breve descripción de la actividad.';
    }

    return errors;
  }

  private isHttpUrl(value: string): boolean {
    try {
      const url = new URL(value);

      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }
}
