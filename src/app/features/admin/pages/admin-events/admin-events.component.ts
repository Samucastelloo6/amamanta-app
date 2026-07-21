import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventsService } from '../../../../core/services/events.service';
import { AmamantaEvent } from '../../../../core/models/amamanta-event';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    DatePipe,
    AppModalComponent,
    EventFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
  ],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminEventsComponent {
  private readonly eventsService = inject(EventsService);

  @ViewChild(EventFormComponent)
  private eventForm?: EventFormComponent;

  readonly selectedDate = signal(new Date());

  readonly showEventForm = signal(false);
  readonly selectedEvent = signal<AmamantaEvent | null>(null);

  readonly showDeleteConfirm = signal(false);
  readonly eventToDelete = signal<AmamantaEvent | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly monthLabel = computed(() =>
    this.selectedDate().toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    }),
  );

  readonly events = computed(() => {
    const selected = this.selectedDate();
    const month = selected.getMonth();
    const year = selected.getFullYear();

    return this.eventsService
      .getAdminEvents()
      .filter((event) => {
        const eventDate = new Date(event.date);

        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      })
      .sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
      );
  });

  previousMonth(): void {
    const current = this.selectedDate();

    this.selectedDate.set(
      new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  }

  nextMonth(): void {
    const current = this.selectedDate();

    this.selectedDate.set(
      new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  }

  goToCurrentMonth(): void {
    this.selectedDate.set(new Date());
  }

  openCreateEvent(): void {
    this.selectedEvent.set(null);
    this.showEventForm.set(true);
  }

  openEditEvent(event: AmamantaEvent): void {
    this.selectedEvent.set(event);
    this.showEventForm.set(true);
  }

  closeEventForm(): void {
    this.eventForm?.reset();

    this.showEventForm.set(false);
    this.selectedEvent.set(null);
  }

  saveEvent(event: AmamantaEvent): void {
    const isEditing = !!this.selectedEvent();

    if (isEditing) {
      this.eventsService.updateEvent(event);
    } else {
      this.eventsService.addEvent(event);
    }

    this.closeEventForm();

    this.showSuccess(
      isEditing ? 'Evento actualizado' : 'Evento creado',
      isEditing
        ? 'El evento se ha actualizado correctamente.'
        : 'El evento se ha creado correctamente.',
    );
  }

  openDeleteConfirm(event: AmamantaEvent): void {
    this.eventToDelete.set(event);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.eventToDelete.set(null);
  }

  deleteSelectedEvent(): void {
    const event = this.eventToDelete();

    if (!event) return;

    this.eventsService.deleteEvent(event.id);

    this.closeDeleteConfirm();

    this.showSuccess(
      'Evento eliminado',
      'El evento se ha eliminado correctamente.',
    );
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }
  private showSuccess(title: string, message: string): void {
    this.successTitle.set(title);
    this.successMessage.set(message);
    this.showSuccessModal.set(true);
  }
}
