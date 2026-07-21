import { Component, ViewChild } from '@angular/core';

import { UniversityRoom } from '../../../../core/models/university-room';
import { UniversityRoomService } from '../../../../core/services/universityRoom.service';
import { ResourceMapComponent } from '../../../../shared/components/resource-map/resource-map.component';
import { UniversityRoomDetailCardComponent } from '../../components/university-room-detail-card/university-room-detail-card.component';
import { UniversityRoomListComponent } from '../../components/university-room-list/university-room-list.component';

@Component({
  selector: 'app-university-rooms',
  imports: [
    ResourceMapComponent,
    UniversityRoomListComponent,
    UniversityRoomDetailCardComponent,
  ],
  templateUrl: './university-rooms.component.html',
  styleUrl: './university-rooms.component.scss',
})
export class UniversityRoomsComponent {
  @ViewChild(ResourceMapComponent)
  private resourceMap!: ResourceMapComponent<UniversityRoom>;

  readonly initialMapCenter: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763,
  };

  readonly rooms: UniversityRoom[];

  selectedResource: UniversityRoom | null = null;
  userPosition: google.maps.LatLngLiteral | null = null;
  routeActive = false;

  constructor(private readonly universityRoomsService: UniversityRoomService) {
    this.rooms = this.universityRoomsService.getUniversityRooms();
  }

  selectResource(room: UniversityRoom): void {
    this.selectedResource = room;
    this.routeActive = false;
  }

  viewRoomOnMap(room: UniversityRoom): void {
    this.selectedResource = room;
    this.routeActive = false;

    document.querySelector('app-resource-map')?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });

    requestAnimationFrame(() => {
      this.resourceMap.focusResource(room, 17);
    });
  }

  closeCard(): void {
    this.selectedResource = null;
    this.routeActive = false;

    this.resourceMap.clearRoute();
  }

  navigateToResource(): void {
    if (!this.selectedResource) {
      return;
    }

    this.routeActive = true;
    this.resourceMap.navigateToResource(this.selectedResource);
  }

  updateUserPosition(position: google.maps.LatLngLiteral): void {
    this.userPosition = position;
  }
}
