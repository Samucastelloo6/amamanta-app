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
  CreateHospitalRequest,
  Hospital,
} from '../../../../core/models/hospital';
import { HospitalService } from '../../../../core/services/hospital.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { HospitalFormComponent } from '../../components/hospital-form/hospital-form.component';

interface HospitalApiError {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
}

@Component({
  selector: 'app-admin-hospitals',
  imports: [
    AppModalComponent,
    HospitalFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './admin-hospitals.component.html',
  styleUrl: './admin-hospitals.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminHospitalsComponent implements OnInit {
  private readonly hospitalService = inject(HospitalService);

  @ViewChild(HospitalFormComponent)
  private hospitalForm?: HospitalFormComponent;

  readonly hospitals = signal<Hospital[]>([]);

  readonly showHospitalForm = signal(false);
  readonly selectedHospital = signal<Hospital | null>(null);

  readonly showDeleteConfirm = signal(false);
  readonly hospitalToDelete = signal<Hospital | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  private focusFormAfterError = false;

  ngOnInit(): void {
    this.hospitalService.loadHospitals().subscribe({
      next: () => {
        this.refreshHospitals();
      },
      error: () => {
        this.showError(
          'No se han podido cargar los hospitales',
          'Ha ocurrido un error al obtener los hospitales. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }

  openCreateHospital(): void {
    this.selectedHospital.set(null);
    this.showHospitalForm.set(true);
  }

  openEditHospital(hospital: Hospital): void {
    this.selectedHospital.set(hospital);
    this.showHospitalForm.set(true);
  }

  closeHospitalForm(): void {
    this.hospitalForm?.reset();

    this.showHospitalForm.set(false);
    this.selectedHospital.set(null);
  }

  saveHospital(hospital: Hospital | CreateHospitalRequest): void {
    const selectedHospital = this.selectedHospital();
    const payload = this.getHospitalPayload(hospital);

    if (selectedHospital) {
      this.hospitalService
        .updateHospital(selectedHospital.id, payload)
        .subscribe({
          next: () => {
            this.refreshHospitals();
            this.closeHospitalForm();

            this.showSuccess(
              'Hospital actualizado',
              'El hospital se ha actualizado correctamente.',
            );
          },
          error: (error: HttpErrorResponse) => {
            this.handleFormError(
              error,
              'No se ha podido actualizar el hospital',
              'Los cambios no se han guardado. Revisa los datos e inténtalo de nuevo.',
            );
          },
        });

      return;
    }

    this.hospitalService.addHospital(payload).subscribe({
      next: () => {
        this.refreshHospitals();
        this.closeHospitalForm();

        this.showSuccess(
          'Hospital creado',
          'El hospital se ha creado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.handleFormError(
          error,
          'No se ha podido crear el hospital',
          'Revisa los datos e inténtalo de nuevo.',
        );
      },
    });
  }

  openDeleteConfirm(hospital: Hospital): void {
    this.hospitalToDelete.set(hospital);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.hospitalToDelete.set(null);
  }

  deleteSelectedHospital(): void {
    const hospital = this.hospitalToDelete();

    if (!hospital) {
      return;
    }

    this.hospitalService.deleteHospital(hospital.id).subscribe({
      next: () => {
        this.refreshHospitals();
        this.closeDeleteConfirm();

        this.showSuccess(
          'Hospital eliminado',
          'El hospital se ha eliminado correctamente.',
        );
      },
      error: () => {
        this.showError(
          'No se ha podido eliminar el hospital',
          'El hospital no se ha eliminado. Inténtalo de nuevo.',
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
      this.hospitalForm?.focusFirstError();
    });
  }

  private getHospitalPayload(
    hospital: Hospital | CreateHospitalRequest,
  ): CreateHospitalRequest {
    if ('id' in hospital) {
      const { id: _id, ...payload } = hospital;

      return payload;
    }

    return hospital;
  }

  private handleFormError(
    error: HttpErrorResponse,
    title: string,
    fallbackMessage: string,
  ): void {
    const apiError = error.error as HospitalApiError | undefined;
    const fields = apiError?.error?.fields;

    this.focusFormAfterError = !!fields;

    const message =
      fields && this.hospitalForm
        ? this.hospitalForm.applyServerErrors(fields)
        : apiError?.error?.message || fallbackMessage;

    this.showError(title, message);
  }

  private refreshHospitals(): void {
    const hospitals = [...this.hospitalService.getAdminHospitals()].sort(
      (a, b) => a.name.localeCompare(b.name, 'es'),
    );

    this.hospitals.set(hospitals);
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
