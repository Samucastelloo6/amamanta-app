import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hospital } from '../../../../core/models/hospital';

export type HospitalDetailVariant = 'mobile' | 'desktop';

@Component({
  selector: 'app-hospital-detail-card',
  imports: [RouterLink],
  templateUrl: './hospital-detail-card.component.html',
})
export class HospitalDetailCardComponent {
  @Input({ required: true }) hospital!: Hospital;
  @Input() routeActive = false;
  @Input() variant: HospitalDetailVariant = 'desktop';

  @Output() close = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  openGoogleMaps(): void {
    window.open(this.hospital.googleMapsUrl, '_blank');
  }

  openAppleMaps(): void {
    const destination = `${this.hospital.latitude},${this.hospital.longitude}`;

    window.location.href = `maps://?saddr=Current%20Location&daddr=${destination}&dirflg=d`;
  }
}
