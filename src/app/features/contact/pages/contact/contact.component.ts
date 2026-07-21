import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ContactEmail,
  ContactLocation,
  ContactPhone,
} from '../../../../core/models/contact';
import { ContactService } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactComponent {
  emails: ContactEmail[] = [];
  phones: ContactPhone[] = [];
  location!: ContactLocation;

  constructor(private readonly contactService: ContactService) {
    this.emails = this.contactService.getEmails();
    this.phones = this.contactService.getPhones();
    this.location = this.contactService.getLocation();
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  call(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openLocation(): void {
    const destination = `${this.location.latitude},${this.location.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      '_blank',
    );
  }
}
