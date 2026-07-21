import { Component, ViewChild } from '@angular/core';

import {
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';
import { FriendlySpaceCategoryService } from '../../../../core/services/friendly-space-category.service';
import { FriendlySpacesService } from '../../../../core/services/friendlySpace.service';
import { ResourceMapComponent } from '../../../../shared/components/resource-map/resource-map.component';
import { FriendlySpaceDetailCardComponent } from '../../components/friendly-space-detail-card/friendly-space-detail-card.component';
import { FriendlySpaceFiltersListComponent } from '../../components/friendly-space-filters-list/friendly-space-filters-list.component';

@Component({
  selector: 'app-friendly-spaces',
  imports: [
    ResourceMapComponent,
    FriendlySpaceFiltersListComponent,
    FriendlySpaceDetailCardComponent,
  ],
  templateUrl: './friendly-spaces.component.html',
  styleUrl: './friendly-spaces.component.scss',
})
export class FriendlySpacesComponent {
  @ViewChild(ResourceMapComponent)
  private resourceMap!: ResourceMapComponent<FriendlySpace>;

  readonly initialMapCenter: google.maps.LatLngLiteral = {
    lat: 39.1667,
    lng: -0.2525,
  };

  readonly spaces: FriendlySpace[];
  readonly categories: FriendlySpaceCategory[];

  displayedSpaces: FriendlySpace[];

  selectedResource: FriendlySpace | null = null;
  userPosition: google.maps.LatLngLiteral | null = null;
  routeActive = false;

  constructor(
    private readonly friendlySpacesService: FriendlySpacesService,
    private readonly categoryService: FriendlySpaceCategoryService,
  ) {
    this.spaces = this.friendlySpacesService.getFriendlySpaces();
    this.displayedSpaces = [...this.spaces];
    this.categories = this.categoryService.getCategories();
  }

  onFilteredSpacesChanged(spaces: FriendlySpace[]): void {
    this.displayedSpaces = spaces;

    if (
      this.selectedResource &&
      !spaces.some((space) => space.id === this.selectedResource?.id)
    ) {
      this.resetSelection();
    }
  }

  selectResource(space: FriendlySpace): void {
    this.selectedResource = space;
    this.routeActive = false;
  }

  viewSpaceOnMap(space: FriendlySpace): void {
    this.selectedResource = space;
    this.routeActive = false;

    document.querySelector('app-resource-map')?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });

    requestAnimationFrame(() => {
      this.resourceMap.focusResource(space, 17);
    });
  }

  closeCard(): void {
    this.resetSelection();
  }

  navigateToResource(): void {
    if (!this.selectedResource) {
      return;
    }

    this.routeActive = true;
    this.resourceMap.navigateToResource(this.selectedResource);
  }

  updateUserPosition(position: google.maps.LatLngLiteral): void {
    this.userPosition = position;
  }

  private resetSelection(): void {
    this.selectedResource = null;
    this.routeActive = false;

    this.resourceMap?.clearRoute();
  }
}
