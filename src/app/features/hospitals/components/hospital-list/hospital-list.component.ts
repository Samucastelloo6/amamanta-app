import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Hospital } from '../../../../core/models/hospital';

@Component({
  selector: 'app-hospital-list',
  imports: [],
  templateUrl: './hospital-list.component.html',
})
export class HospitalListComponent {
  @Input({ required: true }) hospitals: Hospital[] = [];
  @Input() userPosition: google.maps.LatLngLiteral | null = null;
  @Input() selectedHospitalId: string | null = null;

  @Output() hospitalSelected = new EventEmitter<Hospital>();

  get orderedHospitals(): Hospital[] {
    return [...this.hospitals].sort((a, b) => {
      if (!this.userPosition) {
        return 0;
      }

      return this.getDistance(a) - this.getDistance(b);
    });
  }

  selectHospital(hospital: Hospital): void {
    this.hospitalSelected.emit(hospital);
  }

  private getDistance(hospital: Hospital): number {
    if (!this.userPosition) {
      return Number.MAX_SAFE_INTEGER;
    }

    const earthRadius = 6371;

    const dLat = this.toRadians(hospital.latitude - this.userPosition.lat);

    const dLng = this.toRadians(hospital.longitude - this.userPosition.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.userPosition.lat)) *
        Math.cos(this.toRadians(hospital.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
