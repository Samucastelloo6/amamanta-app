import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';

type CategoryFilter = 'all' | string;

@Component({
  selector: 'app-friendly-space-filters-list',
  imports: [],
  templateUrl: './friendly-space-filters-list.component.html',
})
export class FriendlySpaceFiltersListComponent implements OnChanges {
  @Input({ required: true }) spaces: FriendlySpace[] = [];
  @Input({ required: true }) categories: FriendlySpaceCategory[] = [];

  @Input() userPosition: google.maps.LatLngLiteral | null = null;
  @Input() selectedSpaceId: string | null = null;

  @Output() spaceSelected = new EventEmitter<FriendlySpace>();

  @Output() filteredSpacesChanged = new EventEmitter<FriendlySpace[]>();

  selectedCategory: CategoryFilter = 'all';
  searchText = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spaces'] || changes['categories'] || changes['userPosition']) {
      this.emitFilteredSpaces();
    }
  }

  get filteredSpaces(): FriendlySpace[] {
    const search = this.searchText.trim().toLowerCase();

    return this.spaces
      .filter((space) => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          space.categoryId === this.selectedCategory;

        const matchesSearch =
          search === '' ||
          space.name.toLowerCase().includes(search) ||
          space.address.toLowerCase().includes(search) ||
          space.description?.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (!this.userPosition) {
          return 0;
        }

        return this.getDistance(a) - this.getDistance(b);
      });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchText = input.value;
    this.emitFilteredSpaces();
  }

  selectCategory(categoryId: CategoryFilter): void {
    this.selectedCategory = categoryId;
    this.emitFilteredSpaces();
  }

  selectSpace(space: FriendlySpace): void {
    this.spaceSelected.emit(space);
  }

  getCategoryName(categoryId: string): string {
    return (
      this.categories.find((category) => category.id === categoryId)?.name ??
      'Espacio amigo'
    );
  }

  private emitFilteredSpaces(): void {
    this.filteredSpacesChanged.emit(this.filteredSpaces);
  }

  private getDistance(space: FriendlySpace): number {
    if (!this.userPosition) {
      return Number.MAX_SAFE_INTEGER;
    }

    const earthRadius = 6371;

    const dLat = this.toRadians(space.latitude - this.userPosition.lat);

    const dLng = this.toRadians(space.longitude - this.userPosition.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.userPosition.lat)) *
        Math.cos(this.toRadians(space.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
