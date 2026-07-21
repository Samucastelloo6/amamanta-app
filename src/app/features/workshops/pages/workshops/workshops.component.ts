import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Workshop } from '../../../../core/models/workshop';
import { WorkshopService } from '../../../../core/services/workshop.service';
import { ResourceMapComponent } from '../../../../shared/components/resource-map/resource-map.component';
import { WorkshopDetailCardComponent } from '../../components/workshop-detail-card/workshop-detail-card.component';
import { WorkshopOnlinePanelComponent } from '../../components/workshop-online-panel/workshop-online-panel.component';
import { WorkshopWeekCalendarComponent } from '../../components/workshop-week-calendar/workshop-week-calendar.component';

@Component({
  selector: 'app-workshops',
  imports: [
    ResourceMapComponent,
    WorkshopWeekCalendarComponent,
    WorkshopDetailCardComponent,
    WorkshopOnlinePanelComponent,
  ],
  templateUrl: './workshops.component.html',
  styleUrl: './workshops.component.scss',
})
export class WorkshopsComponent implements AfterViewInit {
  @ViewChild(ResourceMapComponent)
  private resourceMap?: ResourceMapComponent<Workshop>;

  readonly initialMapCenter: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763,
  };

  readonly workshops: Workshop[];
  readonly mapWorkshops: Workshop[];

  selectedResource: Workshop | null = null;
  userPosition: google.maps.LatLngLiteral | null = null;
  routeActive = false;

  constructor(
    private readonly workshopService: WorkshopService,
    private readonly route: ActivatedRoute,
  ) {
    this.workshops = this.workshopService.getWorkshops();

    this.mapWorkshops = this.workshops.filter(
      (workshop) => workshop.mode !== 'online',
    );
  }

  ngAfterViewInit(): void {
    const workshopId = this.route.snapshot.queryParamMap.get('workshopId');

    if (!workshopId) {
      return;
    }

    setTimeout(() => {
      this.openWorkshopFromEvent(workshopId);
    });
  }

  selectResource(workshop: Workshop): void {
    this.selectedResource = workshop;
    this.routeActive = false;
  }

  viewWorkshopOnMap(workshop: Workshop): void {
    this.selectedResource = workshop;
    this.routeActive = false;

    if (workshop.mode === 'online') {
      this.resourceMap?.clearRoute();

      setTimeout(() => {
        document.querySelector('#workshop-detail')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      return;
    }

    document.querySelector('app-resource-map')?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });

    requestAnimationFrame(() => {
      this.resourceMap?.focusResource(workshop, 16);
    });
  }
  closeCard(): void {
    this.selectedResource = null;
    this.routeActive = false;

    this.resourceMap?.clearRoute();
  }

  navigateToResource(): void {
    if (
      !this.selectedResource ||
      this.selectedResource.mode === 'online' ||
      this.selectedResource.status === 'temporarily_closed'
    ) {
      return;
    }

    this.routeActive = true;

    this.resourceMap?.navigateToResource(this.selectedResource);
  }

  updateUserPosition(position: google.maps.LatLngLiteral): void {
    this.userPosition = position;
  }

  private openWorkshopFromEvent(workshopId: string): void {
    const workshop = this.workshops.find((item) => item.id === workshopId);

    if (!workshop) {
      console.warn('No se ha encontrado el taller:', workshopId);

      this.resourceMap?.fitMapToMarkers();
      return;
    }

    this.viewWorkshopOnMap(workshop);
  }
}
