import { Component } from '@angular/core';

import { CollaborateOption } from '../../../../core/models/collaborate';
import { CollaborateService } from '../../../../core/services/collaborate.service';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';

@Component({
  selector: 'app-collaborate',
  imports: [SuccessModalComponent, ErrorModalComponent],
  templateUrl: './collaborate.component.html',
  styleUrl: './collaborate.component.scss',
})
export class CollaborateComponent {
  options: CollaborateOption[] = [];

  showSuccessModal = false;
  showErrorModal = false;

  constructor(private readonly collaborateService: CollaborateService) {
    this.options = this.collaborateService.getOptions();
  }

  openOption(option: CollaborateOption): void {
    if (!option.url) {
      return;
    }

    if (option.url.startsWith('mailto:') || option.url.startsWith('tel:')) {
      window.location.href = option.url;
      return;
    }

    window.open(option.url, '_blank', 'noopener,noreferrer');
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);

      this.showSuccessModal = true;
    } catch (error) {
      console.error('No se ha podido copiar al portapapeles:', error);

      this.showErrorModal = true;
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }
}
