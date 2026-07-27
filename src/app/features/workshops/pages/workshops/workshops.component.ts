import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class WorkshopsComponent implements OnInit, AfterViewInit {
  @ViewChild(ResourceMapComponent)
  private resourceMap?: ResourceMapComponent<Workshop>;

  readonly initialMapCenter: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763,
  };

  workshops: Workshop[] = [];
  mapWorkshops: Workshop[] = [];

  selectedResource: Workshop | null = null;
  userPosition: google.maps.LatLngLiteral | null = null;
  routeActive = false;

  private viewInitialized = false;
  private workshopIdFromRoute: string | null = null;

  constructor(
    private readonly workshopService: WorkshopService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.workshopIdFromRoute =
      this.route.snapshot.queryParamMap.get('workshopId');

    this.loadWorkshops();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.openWorkshopFromRouteWhenReady();
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

  private loadWorkshops(): void {
    this.workshopService.loadWorkshops().subscribe({
      next: () => {
        this.workshops = this.workshopService.getWorkshops();

        this.mapWorkshops = this.workshops.filter(
          (workshop) => workshop.mode !== 'online',
        );

        this.openWorkshopFromRouteWhenReady();
      },
    });
  }

  private openWorkshopFromRouteWhenReady(): void {
    if (
      !this.viewInitialized ||
      !this.workshopIdFromRoute ||
      this.workshops.length === 0
    ) {
      return;
    }

    const workshopId = this.workshopIdFromRoute;

    this.workshopIdFromRoute = null;

    setTimeout(() => {
      this.openWorkshopFromEvent(workshopId);
    });
  }

  private openWorkshopFromEvent(workshopId: string): void {
    const workshop = this.workshops.find((item) => item.id === workshopId);

    if (!workshop) {
      this.resourceMap?.fitMapToMarkers();
      return;
    }

    this.viewWorkshopOnMap(workshop);
  }
}
