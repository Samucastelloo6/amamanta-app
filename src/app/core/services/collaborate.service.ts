import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CollaborateOption } from '../models/collaborate';

export interface CollaborateInformation {
  options: CollaborateOption[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CollaborateService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/collaborate`;

  getCollaborateInformation() {
    return this.http.get<ApiResponse<CollaborateInformation>>(this.apiUrl);
  }
}
