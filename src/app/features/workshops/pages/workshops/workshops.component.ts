import { AfterViewInit, ChangeDetectorRef, Component, NgZone, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { ResourcePoint } from '../../../../core/models/resource';
import { ResourceService } from '../../../../core/services/resource.service';

interface MapMarker {
  position: google.maps.LatLngLiteral;
  title: string;
  content: HTMLElement;
  resource: ResourcePoint;
}

type DayFilter = 'all' | 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes';
type TimeFilter = 'all' | 'morning' | 'afternoon';

@Component({
  selector: 'app-workshops',
  imports: [GoogleMapsModule],
  templateUrl: './workshops.component.html',
  styleUrl: './workshops.component.scss'
})
export class WorkshopsComponent implements AfterViewInit {

  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 39.4699, lng: -0.3763 };
  zoom = 9;

  mapOptions: google.maps.MapOptions = {
    gestureHandling: 'greedy',
    clickableIcons: false
  };

  resourcePoints: ResourcePoint[] = [];
  markers: MapMarker[] = [];

  selectedResource: ResourcePoint | null = null;

  selectedDay: DayFilter = 'all';
  selectedTime: TimeFilter = 'all';

  userPosition: google.maps.LatLngLiteral | null = null;
  userMarkerContent: HTMLElement | null = null;

  directionsService!: google.maps.DirectionsService;
  routePolyline: google.maps.Polyline | null = null;

  routeInfo: { distance: string; duration: string } | null = null;

  constructor(
    private readonly resourceService: ResourceService,
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.resourcePoints = this.resourceService
      .getResources()
      .filter(resource => resource.type === 'workshop' && resource.isActive);

    this.loadMarkers();
  }

ngAfterViewInit(): void {

  this.directionsService = new google.maps.DirectionsService();

  this.locateUser();

  setTimeout(() => {
    this.fitMapToMarkers();
  });

}

 private loadMarkers(): void {

  this.markers = this.filteredResources.map(resource =>
    this.createMarker(resource)
  );

}
get filteredResources(): ResourcePoint[] {
  return this.resourcePoints
    .filter(resource => {
      const description = (resource.description ?? '').toLowerCase();

      const matchesDay =
        this.selectedDay === 'all' ||
        description.includes(this.selectedDay);

      const matchesTime =
        this.selectedTime === 'all' ||
        this.matchesTimeFilter(description, this.selectedTime);

      return matchesDay && matchesTime;
    })
    .sort((a, b) => {
      if (!this.userPosition) {
        return 0;
      }

      return this.getDistance(a) - this.getDistance(b);
    });
}

  private matchesTimeFilter(description: string, timeFilter: TimeFilter): boolean {
    const timeMatch = description.match(/(\d{1,2})[:.](\d{2})h?/);

    if (!timeMatch) {
      return true;
    }

    const hour = Number(timeMatch[1]);

    if (timeFilter === 'morning') {
      return hour < 14;
    }

    if (timeFilter === 'afternoon') {
      return hour >= 14;
    }

    return true;
  }

  private createMarker(resource: ResourcePoint): MapMarker {
    return {
      position: {
        lat: resource.latitude,
        lng: resource.longitude
      },
      title: resource.name,
      content: this.createMarkerContent('/taller-lactancia.png'),
      resource
    };
  }

  private createMarkerContent(image: string): HTMLElement {
    const marker = document.createElement('div');

    marker.style.width = '46px';
    marker.style.height = '46px';
    marker.style.borderRadius = '50%';
    marker.style.overflow = 'hidden';
    marker.style.border = '3px solid #7e22ce';
    marker.style.background = 'white';
    marker.style.display = 'flex';
    marker.style.alignItems = 'center';
    marker.style.justifyContent = 'center';
    marker.style.boxShadow = '0 4px 10px rgba(0,0,0,.25)';
    marker.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = image;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'contain';

    marker.appendChild(img);

    return marker;
  }

  selectResource(resource: ResourcePoint): void {
    this.selectedResource = resource;
    this.clearRoute();

    this.center = {
      lat: resource.latitude,
      lng: resource.longitude
    };

    this.zoom = 15;

    this.googleMap.googleMap?.panTo(this.center);
  }

  closeCard(): void {
    this.selectedResource = null;
    this.clearRoute();
  }

  changeDay(day: DayFilter): void {
    this.selectedDay = day;
    this.selectedResource = null;

    this.clearRoute();
    this.loadMarkers();

    setTimeout(() => {
      this.fitMapToMarkers();
    });
  }

  changeTime(time: TimeFilter): void {
    this.selectedTime = time;
    this.selectedResource = null;

    this.clearRoute();
    this.loadMarkers();

    setTimeout(() => {
      this.fitMapToMarkers();
    });
  }

  private fitMapToMarkers(): void {
    if (!this.googleMap?.googleMap || this.markers.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    this.markers.forEach(marker => {
      bounds.extend(marker.position);
    });

    this.googleMap.googleMap.fitBounds(bounds);
  }

 locateUser(): void {
  this.getUserLocation(position => {
    this.userPosition = position;
    this.userMarkerContent = this.createUserMarkerContent();

    this.center = position;
    this.zoom = 14;

    this.loadMarkers();

    this.googleMap.googleMap?.panTo(position);

    this.cdr.detectChanges();
  });
}

  navigateToResource(): void {
    if (!this.selectedResource) {
      return;
    }

    this.getUserLocation(origin => {
      this.userPosition = origin;
      this.userMarkerContent = this.createUserMarkerContent();

      const destination: google.maps.LatLngLiteral = {
        lat: this.selectedResource!.latitude,
        lng: this.selectedResource!.longitude
      };

      this.calculateRoute(origin, destination);
    });
  }

  private getUserLocation(callback: (position: google.maps.LatLngLiteral) => void): void {
    if (!navigator.geolocation) {
      alert('Tu navegador no permite usar la ubicación.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.ngZone.run(() => {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        });
      },
      error => {
        console.error(error);
        alert('No se ha podido obtener tu ubicación.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  private calculateRoute(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral
  ): void {
    this.clearRoute();

    this.directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(result => {
      const route = result.routes[0];
      const leg = route.legs[0];

      this.routeInfo = {
        distance: leg.distance?.text ?? '',
        duration: leg.duration?.text ?? ''
      };

      this.routePolyline = new google.maps.Polyline({
        path: route.overview_path,
        map: this.googleMap.googleMap!,
        strokeColor: '#7e22ce',
        strokeOpacity: 1,
        strokeWeight: 6
      });

      this.cdr.detectChanges();
    }).catch(error => {
      console.error(error);
      alert('No se ha podido calcular la ruta.');
    });
  }

  private clearRoute(): void {
    if (this.routePolyline) {
      this.routePolyline.setMap(null);
      this.routePolyline = null;
    }

    this.routeInfo = null;
  }

  private createUserMarkerContent(): HTMLElement {
    const marker = document.createElement('div');

    marker.style.width = '20px';
    marker.style.height = '20px';
    marker.style.borderRadius = '50%';
    marker.style.background = '#2563eb';
    marker.style.border = '4px solid white';
    marker.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.25)';

    return marker;
  }

  getDistance(resource: ResourcePoint): number {

  if (!this.userPosition) {
    return 9999;
  }

  const earthRadius = 6371;

  const dLat = this.toRadians(
    resource.latitude - this.userPosition.lat
  );

  const dLng = this.toRadians(
    resource.longitude - this.userPosition.lng
  );

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRadians(this.userPosition.lat)) *
    Math.cos(this.toRadians(resource.latitude)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return earthRadius * c;
}

private toRadians(value: number): number {
  return value * Math.PI / 180;
}

viewWorkshopOnMap(workshop: ResourcePoint): void {
  this.selectResource(workshop);

  setTimeout(() => {
    document
      .querySelector('google-map')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  });
}



 openGoogleMaps(): void {
  if (!this.selectedResource) {
    return;
  }

  const destination = `${this.selectedResource.latitude},${this.selectedResource.longitude}`;

  window.open(
    `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${destination}&travelmode=driving`,
    '_blank'
  );
}

  openAppleMaps(): void {
    if (!this.selectedResource) {
      return;
    }

    const destination = `${this.selectedResource.latitude},${this.selectedResource.longitude}`;

    window.location.href =
      `maps://?saddr=Current%20Location&daddr=${destination}&dirflg=d`;
  }
}
