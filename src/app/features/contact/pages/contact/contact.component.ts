import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import {
  ContactEmail,
  ContactLocation,
  ContactPhone,
} from '../../../../core/models/contact';
import { ContactService } from '../../../../core/services/contact.service';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';

@Component({
  selector: 'app-contact',
  imports: [ErrorModalComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactComponent implements OnInit {
  emails: ContactEmail[] = [];
  phones: ContactPhone[] = [];
  location: ContactLocation | null = null;

  showErrorModal = false;

  constructor(private readonly contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContactInformation().subscribe({
      next: (response) => {
        this.emails = response.data.emails;
        this.phones = response.data.phones;
        this.location = response.data.location;
      },
      error: () => {
        this.showErrorModal = true;
      },
    });
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  call(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openLocation(): void {
    if (!this.location) {
      return;
    }

    const destination = `${this.location.latitude},${this.location.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }
}
