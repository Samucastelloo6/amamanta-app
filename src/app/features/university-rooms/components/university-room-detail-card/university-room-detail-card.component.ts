import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UniversityRoom } from '../../../../core/models/university-room';

export type UniversityRoomDetailVariant = 'mobile' | 'desktop';

@Component({
  selector: 'app-university-room-detail-card',
  imports: [RouterLink],
  templateUrl: './university-room-detail-card.component.html',
})
export class UniversityRoomDetailCardComponent {
  @Input({ required: true }) room!: UniversityRoom;
  @Input() routeActive = false;
  @Input() variant: UniversityRoomDetailVariant = 'desktop';

  @Output() close = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  openGoogleMaps(): void {
    const destination = `${this.room.latitude},${this.room.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      '_blank',
    );
  }

  openAppleMaps(): void {
    const destination = `${this.room.latitude},${this.room.longitude}`;

    window.location.href = `maps://?saddr=Current%20Location&daddr=${destination}&dirflg=d`;
  }
}
