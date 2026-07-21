import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { UniversityRoom } from '../../../../core/models/university-room';
import { UniversityRoomService } from '../../../../core/services/universityRoom.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { UniversityRoomFormComponent } from '../../components/university-room-form/university-room-form.component';

@Component({
  selector: 'app-admin-university-rooms',
  imports: [
    AppModalComponent,
    UniversityRoomFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
  ],
  templateUrl: './admin-university-rooms.component.html',
  styleUrl: './admin-university-rooms.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminUniversityRoomsComponent {
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

  constructor() {
    this.refreshRooms();
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

  saveRoom(room: UniversityRoom): void {
    const isEditing = !!this.selectedRoom();

    if (isEditing) {
      this.universityRoomService.updateUniversityRoom(room);
    } else {
      this.universityRoomService.addUniversityRoom(room);
    }

    this.refreshRooms();
    this.closeRoomForm();

    this.showSuccess(
      isEditing ? 'Sala actualizada' : 'Sala creada',
      isEditing
        ? 'La sala universitaria se ha actualizado correctamente.'
        : 'La sala universitaria se ha creado correctamente.',
    );
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

    this.universityRoomService.deleteUniversityRoom(room.id);

    this.refreshRooms();
    this.closeDeleteConfirm();

    this.showSuccess(
      'Sala eliminada',
      'La sala universitaria se ha eliminado correctamente.',
    );
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
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
}
