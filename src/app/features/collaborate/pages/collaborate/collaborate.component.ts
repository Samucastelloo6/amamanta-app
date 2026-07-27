import { Component, OnInit } from '@angular/core';

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
export class CollaborateComponent implements OnInit {
  options: CollaborateOption[] = [];

  showSuccessModal = false;
  showErrorModal = false;

  constructor(private readonly collaborateService: CollaborateService) {}

  ngOnInit(): void {
    this.collaborateService.getCollaborateInformation().subscribe({
      next: (response) => {
        this.options = response.data.options;
      },
      error: () => {
        this.showErrorModal = true;
      },
    });
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
    } catch {
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
