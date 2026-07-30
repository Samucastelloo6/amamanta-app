import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-location-help-modal',
  standalone: true,
  templateUrl: './location-help-modal.component.html',
  styleUrl: './location-help-modal.component.scss',
})
export class LocationHelpModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
