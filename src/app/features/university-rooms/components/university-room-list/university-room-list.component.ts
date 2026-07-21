import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UniversityRoom } from '../../../../core/models/university-room';

@Component({
  selector: 'app-university-room-list',
  imports: [],
  templateUrl: './university-room-list.component.html',
})
export class UniversityRoomListComponent {
  @Input({ required: true }) rooms: UniversityRoom[] = [];
  @Input() userPosition: google.maps.LatLngLiteral | null = null;
  @Input() selectedRoomId: string | null = null;

  @Output() roomSelected = new EventEmitter<UniversityRoom>();

  get orderedRooms(): UniversityRoom[] {
    return [...this.rooms].sort((a, b) => {
      if (!this.userPosition) {
        return 0;
      }

      return this.getDistance(a) - this.getDistance(b);
    });
  }

  selectRoom(room: UniversityRoom): void {
    this.roomSelected.emit(room);
  }

  private getDistance(room: UniversityRoom): number {
    if (!this.userPosition) {
      return Number.MAX_SAFE_INTEGER;
    }

    const earthRadius = 6371;

    const dLat = this.toRadians(room.latitude - this.userPosition.lat);

    const dLng = this.toRadians(room.longitude - this.userPosition.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.userPosition.lat)) *
        Math.cos(this.toRadians(room.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
