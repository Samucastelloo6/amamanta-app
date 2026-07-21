import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { Workshop } from '../../../../core/models/workshop';
import { WorkshopService } from '../../../../core/services/workshop.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { WorkshopFormComponent } from '../../components/workshop-form/workshop-form.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-workshops',
  imports: [
    NgClass,
    AppModalComponent,
    WorkshopFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
  ],
  templateUrl: './admin-workshops.component.html',
  styleUrl: './admin-workshops.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminWorkshopsComponent {
  private readonly workshopService = inject(WorkshopService);

  @ViewChild(WorkshopFormComponent)
  private workshopForm?: WorkshopFormComponent;

  readonly showWorkshopForm = signal(false);
  readonly selectedWorkshop = signal<Workshop | null>(null);

  readonly showDeleteConfirm = signal(false);
  readonly workshopToDelete = signal<Workshop | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly workshops = signal<Workshop[]>([]);

  constructor() {
    this.refreshWorkshops();
  }

  openCreateWorkshop(): void {
    this.selectedWorkshop.set(null);
    this.showWorkshopForm.set(true);
  }

  openEditWorkshop(workshop: Workshop): void {
    this.selectedWorkshop.set(workshop);
    this.showWorkshopForm.set(true);
  }

  closeWorkshopForm(): void {
    this.workshopForm?.reset();
    this.showWorkshopForm.set(false);
    this.selectedWorkshop.set(null);
  }

  saveWorkshop(workshop: Workshop): void {
    const isEditing = !!this.selectedWorkshop();

    if (isEditing) {
      this.workshopService.updateWorkshop(workshop);
    } else {
      this.workshopService.addWorkshop(workshop);
    }

    this.refreshWorkshops();
    this.closeWorkshopForm();

    this.showSuccess(
      isEditing ? 'Taller actualizado' : 'Taller creado',
      isEditing
        ? 'El taller se ha actualizado correctamente.'
        : 'El taller se ha creado correctamente.',
    );
  }

  openDeleteConfirm(workshop: Workshop): void {
    this.workshopToDelete.set(workshop);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.workshopToDelete.set(null);
  }

  deleteSelectedWorkshop(): void {
    const workshop = this.workshopToDelete();

    if (!workshop) {
      return;
    }

    this.workshopService.deleteWorkshop(workshop.id);

    this.refreshWorkshops();
    this.closeDeleteConfirm();

    this.showSuccess(
      'Taller eliminado',
      'El taller se ha eliminado correctamente.',
    );
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  private refreshWorkshops(): void {
    const dayOrder: Record<Workshop['day'], number> = {
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
    };

    const workshops = [...this.workshopService.getAdminWorkshops()].sort(
      (a, b) => {
        const dayDifference = dayOrder[a.day] - dayOrder[b.day];

        if (dayDifference !== 0) {
          return dayDifference;
        }

        if (a.time !== b.time) {
          return a.time === 'morning' ? -1 : 1;
        }

        return a.schedule.localeCompare(b.schedule);
      },
    );

    this.workshops.set(workshops);
  }

  private showSuccess(title: string, message: string): void {
    this.successTitle.set(title);
    this.successMessage.set(message);
    this.showSuccessModal.set(true);
  }
}
