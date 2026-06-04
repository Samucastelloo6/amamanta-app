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

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 39.4699, lng: -0.3763 };
  zoom = 12;

  mapOptions: google.maps.MapOptions = {
    gestureHandling: 'greedy',
    clickableIcons: false
  };

  resourcePoints: ResourcePoint[] = [];
  markers: MapMarker[] = [];

  selectedResource: ResourcePoint | null = null;
  selectedType: 'all' | 'lactation_room' | 'friendly_space'| 'workshop' = 'all';

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


    this.resourcePoints = this.resourceService.getResources();


    this.loadMarkers();
  }

  ngAfterViewInit(): void {



    this.directionsService = new google.maps.DirectionsService();

  }

  private loadMarkers(): void {


    const filteredResources = this.resourcePoints.filter(resource => {
      if (this.selectedType === 'all') {
        return true;
      }

      return resource.type === this.selectedType;
    });



    this.markers = filteredResources.map(resource =>
      this.createMarker(resource)
    );


  }

private createMarker(resource: ResourcePoint): MapMarker {
  let image = '/espacio-amigo.png';

  if (resource.type === 'lactation_room') {
    image = '/espacio-universidad.png';
  }

  if (resource.type === 'workshop') {
    image = '/taller-lactancia.png';
  }

  return {
    position: {
      lat: resource.latitude,
      lng: resource.longitude
    },
    title: resource.name,
    content: this.createMarkerContent(image),
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

 changeFilter(type: 'all' | 'lactation_room' | 'friendly_space' | 'workshop'): void {
  this.selectedType = type;
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
