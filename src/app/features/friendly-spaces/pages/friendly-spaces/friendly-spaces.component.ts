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

type SectorFilter =
  | 'all'
  | 'food'
  | 'fashion'
  | 'books_gifts'
  | 'beauty'
  | 'health'
  | 'restaurants'
  | 'financial'
  | 'others';

@Component({
  selector: 'app-friendly-spaces',
  imports: [GoogleMapsModule],
  templateUrl: './friendly-spaces.component.html',
  styleUrl: './friendly-spaces.component.scss'
})
export class FriendlySpacesComponent implements AfterViewInit {

  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 39.1667, lng: -0.2525 };
zoom = 14;

  mapOptions: google.maps.MapOptions = {
    gestureHandling: 'greedy',
    clickableIcons: false
  };

  resourcePoints: ResourcePoint[] = [];
  markers: MapMarker[] = [];

  sidebarCollapsed = false;

  selectedResource: ResourcePoint | null = null;
  selectedSector: SectorFilter = 'all';
  searchText = '';
  showCategoryMenu = false;

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
      .filter(resource => resource.type === 'friendly_space' && resource.isActive);

    this.loadMarkers();
  }

  ngAfterViewInit(): void {
    this.directionsService = new google.maps.DirectionsService();

    this.locateUser();

  setTimeout(() => {
  if (this.filteredResources.length > 0) {
    this.fitMapToMarkers();
  }
}, 300);
  }

get filteredResources(): ResourcePoint[] {
  const search = this.searchText.trim().toLowerCase();

  return this.resourcePoints
    .filter(resource => {
      const matchesSector =
        this.selectedSector === 'all' || resource.sector === this.selectedSector;

      const matchesSearch =
        search === '' ||
        resource.name.toLowerCase().includes(search) ||
        resource.address.toLowerCase().includes(search) ||
        resource.description?.toLowerCase().includes(search);

      return matchesSector && matchesSearch;
    })
    .sort((a, b) => {
      if (!this.userPosition) {
        return 0;
      }

      return this.getDistance(a) - this.getDistance(b);
    });
}

  private loadMarkers(): void {
    this.markers = this.filteredResources.map(resource =>
      this.createMarker(resource)
    );
  }

private createMarker(resource: ResourcePoint): MapMarker {
  const isSelected = this.selectedResource?.id === resource.id;

  return {
    position: {
      lat: resource.latitude,
      lng: resource.longitude
    },
    title: resource.name,
    content: this.createMarkerContent('/espacio-amigo.png', isSelected),
    resource
  };
}

 private createMarkerContent(image: string, isSelected: boolean = false): HTMLElement {
  const marker = document.createElement('div');

  marker.style.width = isSelected ? '56px' : '46px';
  marker.style.height = isSelected ? '56px' : '46px';
  marker.style.borderRadius = '50%';
  marker.style.overflow = 'hidden';
  marker.style.border = isSelected ? '4px solid #22c55e' : '3px solid #7e22ce';
  marker.style.background = 'white';
  marker.style.display = 'flex';
  marker.style.alignItems = 'center';
  marker.style.justifyContent = 'center';
  marker.style.boxShadow = isSelected
    ? '0 0 0 6px rgba(34, 197, 94, 0.30), 0 6px 16px rgba(0,0,0,.30)'
    : '0 4px 10px rgba(0,0,0,.25)';
  marker.style.cursor = 'pointer';

  const img = document.createElement('img');
  img.src = image;
  img.style.width = isSelected ? '58px' : '50px';
  img.style.height = isSelected ? '58px' : '50px';
  img.style.objectFit = 'contain';

  marker.appendChild(img);

  return marker;
}

  changeSector(sector: SectorFilter): void {
    this.selectedSector = sector;
    this.selectedResource = null;

    this.clearRoute();
    this.loadMarkers();

    setTimeout(() => {
      this.fitMapToMarkers();
    });
  }

selectResource(resource: ResourcePoint): void {
  this.selectedResource = resource;
  this.clearRoute();

  this.center = {
    lat: resource.latitude,
    lng: resource.longitude
  };

  this.zoom = 18;

  this.googleMap.googleMap?.panTo(this.center);
  this.googleMap.googleMap?.setZoom(18);

  this.loadMarkers();
}

 viewSpaceOnMap(resource: ResourcePoint): void {
  this.selectResource(resource);
}

  closeCard(): void {
    this.selectedResource = null;
    this.clearRoute();
  }

private fitMapToMarkers(): void {
  if (!this.googleMap?.googleMap || this.markers.length === 0) {
    return;
  }

  const bounds = new google.maps.LatLngBounds();

  this.markers.forEach(marker => {
    bounds.extend(marker.position);
  });

  this.googleMap.googleMap.fitBounds(bounds, 80);

  setTimeout(() => {
    const currentZoom = this.googleMap.googleMap?.getZoom();

    if (currentZoom && currentZoom < 14) {
      this.googleMap.googleMap?.setZoom(14);
    }
  }, 300);
}

  locateUser(): void {
    this.getUserLocation(position => {
      this.userPosition = position;
      this.userMarkerContent = this.createUserMarkerContent();

      this.loadMarkers();

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

    const dLat = this.toRadians(resource.latitude - this.userPosition.lat);
    const dLng = this.toRadians(resource.longitude - this.userPosition.lng);

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

  toggleSidebar(): void {
  this.sidebarCollapsed = !this.sidebarCollapsed;
}
onSearchChange(event: Event): void {
  const input = event.target as HTMLInputElement;

  this.searchText = input.value;
  this.selectedResource = null;
  this.clearRoute();
  this.loadMarkers();

  setTimeout(() => {
    this.fitMapToMarkers();
  });
}
toggleCategoryMenu(): void {
  this.showCategoryMenu = !this.showCategoryMenu;
}

selectCategory(sector: SectorFilter): void {
  this.changeSector(sector);
  this.showCategoryMenu = false;
}

getSelectedSectorLabel(): string {
  switch (this.selectedSector) {
    case 'food':
      return 'Alimentación';
    case 'fashion':
      return 'Ropa y complementos';
    case 'books_gifts':
      return 'Librerías y regalos';
    case 'beauty':
      return 'Estética';
    case 'health':
      return 'Salud';
    case 'restaurants':
      return 'Cafés y restaurantes';
    case 'financial':
      return 'Servicios financieros';
    case 'others':
      return 'Otros';
    default:
      return 'Categorías';
  }
}
getSectorIcon(sector?: string): string {
  switch (sector) {
    case 'food':
      return '🥖';
    case 'fashion':
      return '👕';
    case 'books_gifts':
      return '📚';
    case 'beauty':
      return '💄';
    case 'health':
      return '🏥';
    case 'restaurants':
      return '☕';
    case 'financial':
      return '💳';
    case 'others':
      return '🔧';
    default:
      return '🤱';
  }
}
}
