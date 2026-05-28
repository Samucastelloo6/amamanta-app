import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ResourcePoint } from '../../../../core/models/resource';
import { ResourceService } from '../../../../core/services/resource.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-map',
  imports: [FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  private userLatitude?: number;
  private userLongitude?: number;

  private readonly resourcePoints: ResourcePoint[];

  showLactationRooms = true;
  showFriendlySpaces = true;
  selectedSector: ResourcePoint['sector'] | 'all' = 'all';

  private readonly universityIcon = L.divIcon({
    html: `
      <div class="custom-map-icon">
        <img src="/espacio-universidad.png" alt="Sala universidad">
      </div>
    `,
    className: 'custom-map-icon-wrapper',
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26]
  });

  private readonly friendlySpaceIcon = L.divIcon({
    html: `
      <div class="custom-map-icon">
        <img src="/espacio-amigo.png" alt="Espacio amigo">
      </div>
    `,
    className: 'custom-map-icon-wrapper',
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26]
  });

  constructor(private readonly resourceService: ResourceService) {
    this.resourcePoints = this.resourceService.getResources();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addTileLayer();
    this.markersLayer.addTo(this.map);

    this.locateUser();
    this.refreshMarkers();
  }

  private initMap(): void {
    this.map = L.map('map', {
      maxZoom: 21
    }).setView([39.4699, -0.3763], 12);
  }

  private addTileLayer(): void {
    L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 21
    }).addTo(this.map);
  }

  private locateUser(): void {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.userLatitude = position.coords.latitude;
      this.userLongitude = position.coords.longitude;

      L.circleMarker([this.userLatitude, this.userLongitude], {
        radius: 9,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.9
      })
        .addTo(this.map)
        .bindPopup('Tu ubicación');

      this.refreshMarkers();
    });
  }

  refreshMarkers(): void {
    this.markersLayer.clearLayers();

    const filteredResources = this.getFilteredResources();

    filteredResources.forEach((point) => {
      L.marker([point.latitude, point.longitude], {
        icon: this.getMarkerIcon(point.type)
      })
        .bindPopup(this.buildResourcePopup(point))
        .addTo(this.markersLayer);
    });

    this.fitMapToResources(filteredResources);
  }

  private getFilteredResources(): ResourcePoint[] {
    return this.resourcePoints.filter((point) => {
      const matchesType =
        (point.type === 'lactation_room' && this.showLactationRooms) ||
        (point.type === 'friendly_space' && this.showFriendlySpaces);

      const matchesSector =
        this.selectedSector === 'all' || point.sector === this.selectedSector;

      return point.isActive && matchesType && matchesSector;
    });
  }

  private fitMapToResources(resources: ResourcePoint[]): void {
    if (resources.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(
      resources.map((point) => [point.latitude, point.longitude])
    );

    this.map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 15
    });
  }

  private getMarkerIcon(type: ResourcePoint['type']): L.DivIcon {
    switch (type) {
      case 'friendly_space':
        return this.friendlySpaceIcon;

      case 'lactation_room':
      default:
        return this.universityIcon;
    }
  }

  private buildResourcePopup(point: ResourcePoint): string {
    const distanceText = this.getDistanceText(point);
    const directionsUrl = this.buildDirectionsUrl(point);

    return `
      <div style="min-width: 240px;">
        <strong>${point.name}</strong><br>
        ${point.address}<br>
        <small>${point.description ?? ''}</small><br><br>
        <strong>${distanceText}</strong><br><br>

        <a href="${point.googleMapsUrl}" target="_blank">
          Ver ubicación
        </a>
        &nbsp;|&nbsp;
        <a href="${directionsUrl}" target="_blank">
          Cómo llegar
        </a>
      </div>
    `;
  }

  private getDistanceText(point: ResourcePoint): string {
    if (!this.userLatitude || !this.userLongitude) {
      return 'Distancia no disponible';
    }

    const distanceKm = this.calculateDistanceKm(
      this.userLatitude,
      this.userLongitude,
      point.latitude,
      point.longitude
    );

    return `${distanceKm.toFixed(1)} km`;
  }

  private buildDirectionsUrl(point: ResourcePoint): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
  }

  private calculateDistanceKm(
    userLat: number,
    userLng: number,
    resourceLat: number,
    resourceLng: number
  ): number {
    const earthRadiusKm = 6371;

    const latDistance = this.degreesToRadians(resourceLat - userLat);
    const lngDistance = this.degreesToRadians(resourceLng - userLng);

    const a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(this.degreesToRadians(userLat)) *
        Math.cos(this.degreesToRadians(resourceLat)) *
        Math.sin(lngDistance / 2) *
        Math.sin(lngDistance / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
