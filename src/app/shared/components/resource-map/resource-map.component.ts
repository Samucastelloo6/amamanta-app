import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

import { MapMarker } from '../../../core/models/map-marker';
import { MapResource } from '../../../core/models/map-resource';
import { ErrorModalComponent } from '../status-modals/error-modal/error-modal.component';
import { WarningModalComponent } from '../status-modals/warning-modal/warning-modal.component';

@Component({
  selector: 'app-resource-map',
  standalone: true,
  imports: [GoogleMapsModule, WarningModalComponent, ErrorModalComponent],
  templateUrl: './resource-map.component.html',
  styleUrl: './resource-map.component.scss',
})
export class ResourceMapComponent<T extends MapResource>
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  @Input({ required: true }) resources: T[] = [];
  @Input() selectedResource: T | null = null;
  @Input() minimumFitZoom: number | null = null;

  @Input({ required: true }) markerImage = '';

  @Input() mapId = 'DEMO_MAP_ID';
  @Input() mapHeight = '560px';

  @Input() initialCenter: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763,
  };

  @Input() initialZoom = 11;
  @Input() selectedZoom = 15;
  @Input() boundsPadding = 80;

  @Input() locateUserOnInit = true;
  @Input() fitMarkersOnInit = true;
  @Input() highlightSelectedMarker = true;

  @Output() resourceSelected = new EventEmitter<T>();

  @Output() userPositionChanged = new EventEmitter<google.maps.LatLngLiteral>();

  center: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763,
  };

  zoom = 11;

  readonly mapOptions: google.maps.MapOptions = {
    gestureHandling: 'greedy',
    clickableIcons: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  };

  markers: MapMarker<T>[] = [];

  userPosition: google.maps.LatLngLiteral | null = null;
  userMarkerContent: HTMLElement | null = null;

  showOnlySelectedResource = false;

  showWarningModal = false;
  warningTitle = '';
  warningMessage = '';

  showErrorModal = false;
  errorTitle = '';
  errorMessage = '';

  closeWarningModal(): void {
    this.showWarningModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  private showWarning(title: string, message: string): void {
    this.warningTitle = title;
    this.warningMessage = message;
    this.showWarningModal = true;
  }

  private showError(title: string, message: string): void {
    this.errorTitle = title;
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  private directionsService: google.maps.DirectionsService | null = null;
  private routePolyline: google.maps.Polyline | null = null;

  private viewInitialized = false;

  private zoomAnimationTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCenter']) {
      this.center = { ...this.initialCenter };
    }

    if (changes['initialZoom']) {
      this.zoom = this.initialZoom;
    }

    if (
      changes['resources'] ||
      changes['selectedResource'] ||
      changes['markerImage'] ||
      changes['highlightSelectedMarker']
    ) {
      this.loadMarkers();
    }

    const resourcesChanged =
      changes['resources'] && !changes['resources'].firstChange;

    const canFitResources =
      !this.selectedResource && !this.showOnlySelectedResource;

    if (this.viewInitialized && resourcesChanged && canFitResources) {
      setTimeout(() => {
        this.fitMapToMarkers();
      });
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.directionsService = new google.maps.DirectionsService();

    this.loadMarkers();

    if (this.locateUserOnInit) {
      this.locateUser();
    }

    if (this.fitMarkersOnInit) {
      setTimeout(() => {
        this.fitMapToMarkers();
      }, 300);
    }
  }

  ngOnDestroy(): void {
    this.cancelZoomAnimation();
    this.removeRoutePolyline();
  }

  get visibleMarkers(): MapMarker<T>[] {
    if (!this.showOnlySelectedResource || !this.selectedResource) {
      return this.markers;
    }

    return this.markers.filter(
      (marker) => marker.resource.id === this.selectedResource?.id,
    );
  }

  onMarkerClick(resource: T): void {
    this.showOnlySelectedResource = false;
    this.removeRoutePolyline();

    this.focusResource(resource);
    this.resourceSelected.emit(resource);
  }

  focusResource(resource: T, targetZoom: number = this.selectedZoom): void {
    this.cancelZoomAnimation();

    this.showOnlySelectedResource = false;
    this.removeRoutePolyline();

    const map = this.googleMap?.googleMap;

    if (!map) {
      return;
    }

    const position = this.getResourcePosition(resource);

    const currentZoom = Math.round(map.getZoom() ?? this.initialZoom);

    const zoomDifference = Math.abs(targetZoom - currentZoom);

    if (zoomDifference > 4) {
      this.center = position;
      this.zoom = targetZoom;

      map.moveCamera({
        center: position,
        zoom: targetZoom,
      });

      return;
    }

    map.panTo(position);

    this.animateZoom(currentZoom, targetZoom, position);
  }

  locateUser(centerMap = false): void {
    this.getUserLocation((position) => {
      this.userPosition = position;
      this.userMarkerContent = this.createUserMarkerContent();

      this.userPositionChanged.emit(position);

      if (centerMap) {
        this.cancelZoomAnimation();

        this.center = position;
        this.zoom = 14;

        this.googleMap?.googleMap?.moveCamera({
          center: position,
          zoom: 14,
        });
      }

      this.cdr.detectChanges();
    });
  }

  navigateToResource(resource: T): void {
    if (!this.directionsService) {
      return;
    }

    this.cancelZoomAnimation();
    this.showOnlySelectedResource = true;

    this.getUserLocation((origin) => {
      this.userPosition = origin;
      this.userMarkerContent = this.createUserMarkerContent();

      this.userPositionChanged.emit(origin);

      const destination = this.getResourcePosition(resource);

      this.calculateRoute(origin, destination);
    });
  }

  clearRoute(): void {
    this.cancelZoomAnimation();
    this.removeRoutePolyline();
    this.showOnlySelectedResource = false;
  }

  resetMap(): void {
    this.clearRoute();
    this.loadMarkers();

    setTimeout(() => {
      this.fitMapToMarkers();
    });
  }

  fitMapToMarkers(): void {
    const map = this.googleMap?.googleMap;

    if (!map || this.markers.length === 0) {
      return;
    }

    this.cancelZoomAnimation();

    const bounds = new google.maps.LatLngBounds();

    this.markers.forEach((marker) => {
      bounds.extend(marker.position);
    });

    map.fitBounds(bounds, this.boundsPadding);

    if (this.minimumFitZoom === null) {
      return;
    }

    google.maps.event.addListenerOnce(map, 'idle', () => {
      const currentZoom = map.getZoom();

      if (currentZoom !== undefined && currentZoom < this.minimumFitZoom!) {
        map.setZoom(this.minimumFitZoom!);
      }
    });
  }

  private animateZoom(
    currentZoom: number,
    targetZoom: number,
    position: google.maps.LatLngLiteral,
  ): void {
    const map = this.googleMap?.googleMap;

    if (!map) {
      this.zoomAnimationTimeout = null;
      return;
    }

    if (currentZoom === targetZoom) {
      this.center = position;
      this.zoom = targetZoom;

      map.moveCamera({
        center: position,
        zoom: targetZoom,
      });

      this.zoomAnimationTimeout = null;
      return;
    }

    const direction = currentZoom < targetZoom ? 1 : -1;
    const nextZoom = currentZoom + direction;

    map.setZoom(nextZoom);

    this.zoomAnimationTimeout = setTimeout(() => {
      this.animateZoom(nextZoom, targetZoom, position);
    }, 120);
  }

  private cancelZoomAnimation(): void {
    if (!this.zoomAnimationTimeout) {
      return;
    }

    clearTimeout(this.zoomAnimationTimeout);
    this.zoomAnimationTimeout = null;
  }

  private loadMarkers(): void {
    this.markers = this.resources.map((resource) =>
      this.createMarker(resource),
    );
  }

  private createMarker(resource: T): MapMarker<T> {
    const isSelected =
      this.highlightSelectedMarker && this.selectedResource?.id === resource.id;

    return {
      position: this.getResourcePosition(resource),
      title: resource.name,
      content: this.createMarkerContent(isSelected),
      resource,
    };
  }

  private getResourcePosition(resource: T): google.maps.LatLngLiteral {
    return {
      lat: resource.latitude,
      lng: resource.longitude,
    };
  }

  private createMarkerContent(isSelected: boolean): HTMLElement {
    const marker = document.createElement('div');

    marker.style.width = isSelected ? '56px' : '46px';
    marker.style.height = isSelected ? '56px' : '46px';
    marker.style.borderRadius = '50%';
    marker.style.overflow = 'hidden';
    marker.style.border = isSelected
      ? '4px solid #22c55e'
      : '3px solid #8f50c4';
    marker.style.backgroundColor = '#ffffff';
    marker.style.display = 'flex';
    marker.style.alignItems = 'center';
    marker.style.justifyContent = 'center';
    marker.style.boxShadow = isSelected
      ? '0 0 0 6px rgba(34, 197, 94, 0.30), 0 6px 16px rgba(0, 0, 0, 0.30)'
      : '0 4px 10px rgba(0, 0, 0, 0.25)';
    marker.style.cursor = 'pointer';

    const image = document.createElement('img');

    image.src = this.markerImage;
    image.alt = '';
    image.style.width = isSelected ? '58px' : '50px';
    image.style.height = isSelected ? '58px' : '50px';
    image.style.objectFit = 'contain';

    marker.appendChild(image);

    return marker;
  }

  private createUserMarkerContent(): HTMLElement {
    const marker = document.createElement('div');

    marker.style.width = '20px';
    marker.style.height = '20px';
    marker.style.borderRadius = '50%';
    marker.style.backgroundColor = '#2563eb';
    marker.style.border = '4px solid #ffffff';
    marker.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.25)';

    return marker;
  }

  private getUserLocation(
    callback: (position: google.maps.LatLngLiteral) => void,
  ): void {
    if (!navigator.geolocation) {
      this.showWarning(
        'Ubicación no disponible',
        'Tu navegador no permite utilizar la ubicación.',
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.ngZone.run(() => {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);

        this.ngZone.run(() => {
          const permissionDenied =
            error.code === GeolocationPositionError.PERMISSION_DENIED;

          this.showWarning(
            permissionDenied
              ? 'Permiso de ubicación denegado'
              : 'No se ha podido obtener tu ubicación',
            permissionDenied
              ? 'Activa el permiso de ubicación para esta página desde la configuración del navegador e inténtalo de nuevo.'
              : 'Comprueba que la ubicación esté activada e inténtalo de nuevo.',
          );
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  private calculateRoute(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
  ): void {
    const map = this.googleMap?.googleMap;

    if (!this.directionsService || !map) {
      return;
    }

    this.cancelZoomAnimation();
    this.removeRoutePolyline();
    this.showOnlySelectedResource = true;

    this.directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((result) => {
        const route = result.routes[0];

        if (!route) {
          throw new Error('Google Maps no ha devuelto una ruta válida.');
        }

        this.routePolyline = new google.maps.Polyline({
          path: route.overview_path,
          map,
          strokeColor: '#8f50c4',
          strokeOpacity: 1,
          strokeWeight: 6,
        });

        map.fitBounds(route.bounds, this.getRoutePadding());

        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error calculando la ruta:', error);

        this.ngZone.run(() => {
          this.showOnlySelectedResource = false;

          this.showError(
            'No se ha podido calcular la ruta',
            'Comprueba tu conexión e inténtalo de nuevo. También puedes abrir la ubicación directamente en Google Maps o Apple Maps.',
          );

          this.cdr.detectChanges();
        });
      });
  }
  private getRoutePadding(): google.maps.Padding {
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      return {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      };
    }

    return {
      top: 40,
      right: 30,
      bottom: 220,
      left: 30,
    };
  }

  private removeRoutePolyline(): void {
    if (!this.routePolyline) {
      return;
    }

    this.routePolyline.setMap(null);
    this.routePolyline = null;
  }
}
