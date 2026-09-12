import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  signal,
  ViewChild,
  OnInit,
} from '@angular/core';
import { EventsService } from '../../../../core/services/events.service';
import {
  AmamantaEvent,
  CreateEventRequest,
  getEventPlatformLabel,
} from '../../../../core/models/amamanta-event';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    AppModalComponent,
    EventFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminEventsComponent implements OnInit {
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

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

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

  getModeLabel(event: AmamantaEvent): string {
    return event.mode === 'online'
      ? `Online · ${getEventPlatformLabel(event.onlinePlatform)}`
      : event.location;
  }

  ngOnInit(): void {
    this.eventsService.loadEvents().subscribe();
  }
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

  saveEvent(event: AmamantaEvent | CreateEventRequest): void {
    const selectedEvent = this.selectedEvent();

    if (selectedEvent) {
      const { id: _id, ...payload } = event as AmamantaEvent;

      this.eventsService.updateEvent(selectedEvent.id, payload).subscribe({
        next: () => {
          this.closeEventForm();

          this.showSuccess(
            'Evento actualizado',
            'El evento se ha actualizado correctamente.',
          );
        },
        error: (error) => {
          console.error('Error al actualizar el evento:', error);

          this.showError(
            'No se ha podido actualizar el evento',
            'Los cambios no se han guardado. Inténtalo de nuevo.',
          );
        },
      });

      return;
    }

    this.eventsService.addEvent(event as CreateEventRequest).subscribe({
      next: () => {
        this.closeEventForm();

        this.showSuccess(
          'Evento creado',
          'El evento se ha creado correctamente.',
        );
      },
      error: (error) => {
        console.error('Error al crear el evento:', error);

        this.showError(
          'No se ha podido crear el evento',
          'Revisa los datos e inténtalo de nuevo.',
        );
      },
    });
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

    if (!event) {
      return;
    }

    this.eventsService.deleteEvent(event.id).subscribe({
      next: () => {
        this.closeDeleteConfirm();

        this.showSuccess(
          'Evento eliminado',
          'El evento se ha eliminado correctamente.',
        );
      },
      error: (error) => {
        console.error('Error al eliminar el evento:', error);

        this.showError(
          'No se ha podido eliminar el evento',
          'El evento no se ha eliminado. Inténtalo de nuevo.',
        );
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }
  private showSuccess(title: string, message: string): void {
    this.successTitle.set(title);
    this.successMessage.set(message);
    this.showSuccessModal.set(true);
  }
  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }

  private showError(title: string, message: string): void {
    this.errorTitle.set(title);
    this.errorMessage.set(message);
    this.showErrorModal.set(true);
  }
}
