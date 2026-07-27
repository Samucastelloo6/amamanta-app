import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AnalyticsSection } from './analytics.models';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsTrackerService {
  private readonly router = inject(Router);
  private readonly analyticsService = inject(AnalyticsService);

  private readonly visitStorageKey = 'amamanta_analytics_visit';

  startTracking(): void {
    this.registerVisitOnce();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        const section = this.getSectionFromUrl(event.urlAfterRedirects);

        if (!section) {
          return;
        }

        this.analyticsService.registerPageView(section).subscribe({
          error: () => {
            // La analítica nunca debe interrumpir el uso de la app.
          },
        });
      });
  }

  private registerVisitOnce(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    const visitRegistered = sessionStorage.getItem(this.visitStorageKey);

    if (visitRegistered) {
      return;
    }

    sessionStorage.setItem(this.visitStorageKey, 'true');

    this.analyticsService.registerVisit().subscribe({
      error: () => {
        sessionStorage.removeItem(this.visitStorageKey);
      },
    });
  }

  private getSectionFromUrl(rawUrl: string): AnalyticsSection | null {
    const url = rawUrl.split('?')[0].split('#')[0];

    if (url.startsWith('/admin')) {
      return null;
    }

    if (url === '/' || url === '/inicio') {
      return 'home';
    }

    if (url.startsWith('/eventos')) {
      return 'events';
    }

    if (url.startsWith('/talleres')) {
      return 'workshops';
    }

    if (url.startsWith('/salas-universitarias')) {
      return 'universityRooms';
    }

    if (url.startsWith('/hospitales')) {
      return 'hospitals';
    }

    if (url.startsWith('/espacios-amigos')) {
      return 'friendlySpaces';
    }

    if (url.startsWith('/contacto')) {
      return 'contact';
    }

    if (url.startsWith('/colabora')) {
      return 'collaborate';
    }

    if (url.startsWith('/valora')) {
      return 'feedback';
    }

    return null;
  }
}
