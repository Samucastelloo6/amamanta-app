import { MapResource } from './map-resource';

export interface MapMarker<T extends MapResource> {
  position: google.maps.LatLngLiteral;
  title: string;
  content: HTMLElement;
  resource: T;
}
