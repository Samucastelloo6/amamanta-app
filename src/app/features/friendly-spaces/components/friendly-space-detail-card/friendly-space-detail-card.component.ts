import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';

export type FriendlySpaceDetailVariant = 'mobile' | 'desktop';

@Component({
  selector: 'app-friendly-space-detail-card',
  imports: [RouterLink],
  templateUrl: './friendly-space-detail-card.component.html',
})
export class FriendlySpaceDetailCardComponent {
  @Input({ required: true }) space!: FriendlySpace;
  @Input({ required: true }) categories: FriendlySpaceCategory[] = [];

  @Input() routeActive = false;
  @Input() variant: FriendlySpaceDetailVariant = 'desktop';

  @Output() close = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  get categoryName(): string {
    return (
      this.categories.find((category) => category.id === this.space.categoryId)
        ?.name ?? 'Espacio amigo'
    );
  }

  openGoogleMaps(): void {
    const destination = `${this.space.latitude},${this.space.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      '_blank',
    );
  }

  openAppleMaps(): void {
    const destination = `${this.space.latitude},${this.space.longitude}`;

    window.location.href = `maps://?saddr=Current%20Location&daddr=${destination}&dirflg=d`;
  }
}
