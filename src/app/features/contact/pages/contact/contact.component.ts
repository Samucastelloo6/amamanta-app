import { Component } from '@angular/core';
import { ContactEmail, ContactLocation, ContactPhone } from '../../../../core/models/contact';
import { ContactService } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
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
    window.open(this.location.googleMapsUrl, '_blank');
  }
}
