import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { Hospital } from '../../../../core/models/hospital';
import { HospitalService } from '../../../../core/services/hospital.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { HospitalFormComponent } from '../../components/hospital-form/hospital-form.component';

@Component({
  selector: 'app-admin-hospitals',
  imports: [
    AppModalComponent,
    HospitalFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
  ],
  templateUrl: './admin-hospitals.component.html',
  styleUrl: './admin-hospitals.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminHospitalsComponent {
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

  constructor() {
    this.refreshHospitals();
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

  saveHospital(hospital: Hospital): void {
    const isEditing = !!this.selectedHospital();

    if (isEditing) {
      this.hospitalService.updateHospital(hospital);
    } else {
      this.hospitalService.addHospital(hospital);
    }

    this.refreshHospitals();
    this.closeHospitalForm();

    this.showSuccess(
      isEditing ? 'Hospital actualizado' : 'Hospital creado',
      isEditing
        ? 'El hospital se ha actualizado correctamente.'
        : 'El hospital se ha creado correctamente.',
    );
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

    this.hospitalService.deleteHospital(hospital.id);

    this.refreshHospitals();
    this.closeDeleteConfirm();

    this.showSuccess(
      'Hospital eliminado',
      'El hospital se ha eliminado correctamente.',
    );
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
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
}
