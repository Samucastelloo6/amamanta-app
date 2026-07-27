import { Component, OnInit, ViewChild } from '@angular/core';

import { Hospital } from '../../../../core/models/hospital';
import { HospitalService } from '../../../../core/services/hospital.service';
import { ResourceMapComponent } from '../../../../shared/components/resource-map/resource-map.component';
import { HospitalDetailCardComponent } from '../../components/hospital-detail-card/hospital-detail-card.component';
import { HospitalListComponent } from '../../components/hospital-list/hospital-list.component';

@Component({
  selector: 'app-hospitals',
  imports: [
    ResourceMapComponent,
    HospitalListComponent,
    HospitalDetailCardComponent,
  ],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.scss',
})
export class HospitalsComponent implements OnInit {
  @ViewChild(ResourceMapComponent)
  private resourceMap?: ResourceMapComponent<Hospital>;

  readonly initialMapCenter: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763,
  };

  hospitals: Hospital[] = [];

  selectedResource: Hospital | null = null;
  userPosition: google.maps.LatLngLiteral | null = null;
  routeActive = false;

  constructor(private readonly hospitalService: HospitalService) {}

  ngOnInit(): void {
    this.hospitalService.loadHospitals().subscribe({
      next: () => {
        this.hospitals = this.hospitalService.getHospitals();
      },
    });
  }

  selectResource(hospital: Hospital): void {
    this.selectedResource = hospital;
    this.routeActive = false;
  }

  viewHospitalOnMap(hospital: Hospital): void {
    this.selectedResource = hospital;
    this.routeActive = false;

    document.querySelector('app-resource-map')?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });

    requestAnimationFrame(() => {
      this.resourceMap?.focusResource(hospital, 17);
    });
  }

  closeCard(): void {
    this.selectedResource = null;
    this.routeActive = false;

    this.resourceMap?.clearRoute();
  }

  navigateToResource(): void {
    if (!this.selectedResource) {
      return;
    }

    this.routeActive = true;

    this.resourceMap?.navigateToResource(this.selectedResource);
  }

  updateUserPosition(position: google.maps.LatLngLiteral): void {
    this.userPosition = position;
  }
}
