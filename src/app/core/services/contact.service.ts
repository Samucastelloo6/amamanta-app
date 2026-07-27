import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ContactEmail, ContactLocation, ContactPhone } from '../models/contact';

export interface ContactInformation {
  emails: ContactEmail[];
  phones: ContactPhone[];
  location: ContactLocation;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/contact`;

  getContactInformation() {
    return this.http.get<ApiResponse<ContactInformation>>(this.apiUrl);
  }
}
