import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly pendingOperations = signal(0);

  readonly isLoading = computed(() => this.pendingOperations() > 0);

  show(): void {
    this.pendingOperations.update((operations) => operations + 1);
  }

  hide(): void {
    this.pendingOperations.update((operations) => Math.max(0, operations - 1));
  }

  reset(): void {
    this.pendingOperations.set(0);
  }
}
