import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import {
  CreateUniversityRoomRequest,
  UniversityRoom,
} from '../../../../core/models/university-room';
import { UniversityRoomService } from '../../../../core/services/universityRoom.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { UniversityRoomFormComponent } from '../../components/university-room-form/university-room-form.component';

interface UniversityRoomApiError {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
}

@Component({
  selector: 'app-admin-university-rooms',
  imports: [
    AppModalComponent,
    UniversityRoomFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './admin-university-rooms.component.html',
  styleUrl: './admin-university-rooms.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminUniversityRoomsComponent implements OnInit {
  private readonly universityRoomService = inject(UniversityRoomService);

  @ViewChild(UniversityRoomFormComponent)
  private universityRoomForm?: UniversityRoomFormComponent;

  readonly rooms = signal<UniversityRoom[]>([]);

  readonly showRoomForm = signal(false);
  readonly selectedRoom = signal<UniversityRoom | null>(null);

  readonly showDeleteConfirm = signal(false);
  readonly roomToDelete = signal<UniversityRoom | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  private focusFormAfterError = false;

  ngOnInit(): void {
    this.universityRoomService.loadUniversityRooms().subscribe({
      next: () => {
        this.refreshRooms();
      },
      error: () => {
        this.showError(
          'No se han podido cargar las salas',
          'Ha ocurrido un error al obtener las salas universitarias. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }

  openCreateRoom(): void {
    this.selectedRoom.set(null);
    this.showRoomForm.set(true);
  }

  openEditRoom(room: UniversityRoom): void {
    this.selectedRoom.set(room);
    this.showRoomForm.set(true);
  }

  closeRoomForm(): void {
    this.universityRoomForm?.reset();

    this.showRoomForm.set(false);
    this.selectedRoom.set(null);
  }

  saveRoom(room: UniversityRoom | CreateUniversityRoomRequest): void {
    const selectedRoom = this.selectedRoom();
    const payload = this.getRoomPayload(room);

    if (selectedRoom) {
      this.universityRoomService
        .updateUniversityRoom(selectedRoom.id, payload)
        .subscribe({
          next: () => {
            this.refreshRooms();
            this.closeRoomForm();

            this.showSuccess(
              'Sala actualizada',
              'La sala universitaria se ha actualizado correctamente.',
            );
          },
          error: (error: HttpErrorResponse) => {
            this.handleFormError(
              error,
              'No se ha podido actualizar la sala',
              'Los cambios no se han guardado. Revisa los datos e inténtalo de nuevo.',
            );
          },
        });

      return;
    }

    this.universityRoomService.addUniversityRoom(payload).subscribe({
      next: () => {
        this.refreshRooms();
        this.closeRoomForm();

        this.showSuccess(
          'Sala creada',
          'La sala universitaria se ha creado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.handleFormError(
          error,
          'No se ha podido crear la sala',
          'Revisa los datos e inténtalo de nuevo.',
        );
      },
    });
  }

  openDeleteConfirm(room: UniversityRoom): void {
    this.roomToDelete.set(room);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.roomToDelete.set(null);
  }

  deleteSelectedRoom(): void {
    const room = this.roomToDelete();

    if (!room) {
      return;
    }

    this.universityRoomService.deleteUniversityRoom(room.id).subscribe({
      next: () => {
        this.refreshRooms();
        this.closeDeleteConfirm();

        this.showSuccess(
          'Sala eliminada',
          'La sala universitaria se ha eliminado correctamente.',
        );
      },
      error: () => {
        this.showError(
          'No se ha podido eliminar la sala',
          'La sala no se ha eliminado. Inténtalo de nuevo.',
        );
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);

    if (!this.focusFormAfterError) {
      return;
    }

    this.focusFormAfterError = false;

    setTimeout(() => {
      this.universityRoomForm?.focusFirstError();
    });
  }

  private getRoomPayload(
    room: UniversityRoom | CreateUniversityRoomRequest,
  ): CreateUniversityRoomRequest {
    if ('id' in room) {
      const { id: _id, ...payload } = room;

      return payload;
    }

    return room;
  }

  private handleFormError(
    error: HttpErrorResponse,
    title: string,
    fallbackMessage: string,
  ): void {
    const apiError = error.error as UniversityRoomApiError | undefined;
    const fields = apiError?.error?.fields;

    this.focusFormAfterError = !!fields;

    const message =
      fields && this.universityRoomForm
        ? this.universityRoomForm.applyServerErrors(fields)
        : apiError?.error?.message || fallbackMessage;

    this.showError(title, message);
  }

  private refreshRooms(): void {
    const rooms = [
      ...this.universityRoomService.getAdminUniversityRooms(),
    ].sort((a, b) => a.name.localeCompare(b.name, 'es'));

    this.rooms.set(rooms);
  }

  private showSuccess(title: string, message: string): void {
    this.successTitle.set(title);
    this.successMessage.set(message);
    this.showSuccessModal.set(true);
  }

  private showError(title: string, message: string): void {
    this.errorTitle.set(title);
    this.errorMessage.set(message);
    this.showErrorModal.set(true);
  }
}
