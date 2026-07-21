import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Workshop } from '../../../../core/models/workshop';

export type WorkshopDetailVariant = 'mobile' | 'desktop';

@Component({
  selector: 'app-workshop-detail-card',
  imports: [RouterLink],
  templateUrl: './workshop-detail-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkshopDetailCardComponent {
  @Input({ required: true })
  workshop!: Workshop;

  @Input()
  routeActive = false;

  @Input()
  variant: WorkshopDetailVariant = 'desktop';

  @Output()
  close = new EventEmitter<void>();

  @Output()
  navigate = new EventEmitter<void>();

  openGoogleMaps(): void {
    const destination = `${this.workshop.latitude},${this.workshop.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      '_blank',
    );
  }

  openAppleMaps(): void {
    const destination = `${this.workshop.latitude},${this.workshop.longitude}`;

    window.location.href = `maps://?saddr=Current%20Location&daddr=${destination}&dirflg=d`;
  }
}
