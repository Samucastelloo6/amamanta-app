import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-install-pwa-modal',
  standalone: true,
  imports: [],
  templateUrl: './install-pwa-modal.component.html',
})
export class InstallPwaModalComponent {
  @Output()
  close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
