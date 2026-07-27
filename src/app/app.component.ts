import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AnalyticsTrackerService } from './core/analytics/analytics-tracker.service';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly analyticsTracker = inject(AnalyticsTrackerService);

  constructor() {
    this.analyticsTracker.startTracking();
  }
}
