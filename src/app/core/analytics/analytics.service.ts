import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AnalyticsSection, AnalyticsSummary } from './analytics.models';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/analytics`;

  registerVisit() {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/visit`, {});
  }

  registerPageView(section: AnalyticsSection) {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/page-view`, {
      section,
    });
  }

  getCurrentSummary() {
    const today = new Date();

    return this.getSummary(today.getFullYear(), today.getMonth() + 1);
  }

  getHistoricalSummary(year: number, month: number) {
    return this.getSummary(year, month);
  }

  private getSummary(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);

    return this.http.get<ApiResponse<AnalyticsSummary>>(
      `${this.apiUrl}/summary`,
      {
        params,
      },
    );
  }
}
