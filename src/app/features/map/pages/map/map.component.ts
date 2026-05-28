import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
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
export class MapComponent {
  center: google.maps.LatLngLiteral = {
    lat: 39.4699,
    lng: -0.3763
  };

  zoom = 12;

  mapOptions: google.maps.MapOptions = {
    gestureHandling: 'greedy',
    clickableIcons: false
  };

  resourcePoints: ResourcePoint[];

  markers: MapMarker[] = [];

  selectedResource: ResourcePoint | null = null;

  constructor(private readonly resourceService: ResourceService) {
    this.resourcePoints = this.resourceService.getResources();

    this.markers = this.resourcePoints.map(resource =>
      this.createMarker(resource)
    );
  }

  private createMarker(resource: ResourcePoint): MapMarker {
    const image =
      resource.type === 'lactation_room'
        ? '/espacio-universidad.png'
        : '/espacio-amigo.png';

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
    img.style.width = '28px';
    img.style.height = '28px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';

    marker.appendChild(img);

    return marker;
  }

  selectResource(resource: ResourcePoint): void {
    this.selectedResource = resource;
  }

  closeCard(): void {
    this.selectedResource = null;
  }
}
