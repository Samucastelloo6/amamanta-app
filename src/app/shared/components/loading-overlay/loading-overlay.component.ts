import { Component, inject } from '@angular/core';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  imports: [],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
})
export class LoadingOverlayComponent {
  readonly loadingService = inject(LoadingService);
}
