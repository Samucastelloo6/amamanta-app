import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';

import {
  CreateWorkshopRequest,
  Workshop,
} from '../../../../core/models/workshop';
import { WorkshopService } from '../../../../core/services/workshop.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { WorkshopFormComponent } from '../../components/workshop-form/workshop-form.component';

@Component({
  selector: 'app-admin-workshops',
  imports: [
    NgClass,
    AppModalComponent,
    WorkshopFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './admin-workshops.component.html',
  styleUrl: './admin-workshops.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminWorkshopsComponent implements OnInit {
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

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  readonly workshops = signal<Workshop[]>([]);

  ngOnInit(): void {
    this.workshopService.loadWorkshops().subscribe({
      next: () => {
        this.refreshWorkshops();
      },
      error: () => {
        this.showError(
          'No se han podido cargar los talleres',
          'Ha ocurrido un error al obtener los talleres. Inténtalo de nuevo más tarde.',
        );
      },
    });
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

  saveWorkshop(workshop: Workshop | CreateWorkshopRequest): void {
    const selectedWorkshop = this.selectedWorkshop();
    const payload = this.getWorkshopPayload(workshop);

    if (selectedWorkshop) {
      this.workshopService
        .updateWorkshop(selectedWorkshop.id, payload)
        .subscribe({
          next: () => {
            this.refreshWorkshops();
            this.closeWorkshopForm();

            this.showSuccess(
              'Taller actualizado',
              'El taller se ha actualizado correctamente.',
            );
          },
          error: () => {
            this.showError(
              'No se ha podido actualizar el taller',
              'Los cambios no se han guardado. Inténtalo de nuevo.',
            );
          },
        });

      return;
    }

    this.workshopService.addWorkshop(payload).subscribe({
      next: () => {
        this.refreshWorkshops();
        this.closeWorkshopForm();

        this.showSuccess(
          'Taller creado',
          'El taller se ha creado correctamente.',
        );
      },
      error: () => {
        this.showError(
          'No se ha podido crear el taller',
          'Revisa los datos e inténtalo de nuevo.',
        );
      },
    });
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

    this.workshopService.deleteWorkshop(workshop.id).subscribe({
      next: () => {
        this.refreshWorkshops();
        this.closeDeleteConfirm();

        this.showSuccess(
          'Taller eliminado',
          'El taller se ha eliminado correctamente.',
        );
      },
      error: () => {
        this.showError(
          'No se ha podido eliminar el taller',
          'El taller no se ha eliminado. Inténtalo de nuevo.',
        );
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }

  private getWorkshopPayload(
    workshop: Workshop | CreateWorkshopRequest,
  ): CreateWorkshopRequest {
    if ('id' in workshop) {
      const { id: _id, ...payload } = workshop;

      return payload;
    }

    return workshop;
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

        return (
          this.getScheduleMinutes(a.schedule) -
          this.getScheduleMinutes(b.schedule)
        );
      },
    );

    this.workshops.set(workshops);
  }

  private getScheduleMinutes(schedule: string): number {
    const match = schedule.match(/(\d{1,2}):(\d{2})/);

    if (!match) {
      return Number.MAX_SAFE_INTEGER;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    return hours * 60 + minutes;
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
