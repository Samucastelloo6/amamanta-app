import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly swUpdate = inject(SwUpdate);

  readonly updateAvailable = signal(false);
  readonly updating = signal(false);

  ngOnInit(): void {
    this.listenForUpdates();
    void this.checkForUpdates();
  }

  updateApplication(): void {
    if (this.updating()) {
      return;
    }

    this.updating.set(true);
    window.location.reload();
  }

  private listenForUpdates(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter(
          (event): event is VersionReadyEvent => event.type === 'VERSION_READY',
        ),
      )
      .subscribe(() => {
        this.updateAvailable.set(true);
      });
  }

  private async checkForUpdates(): Promise<void> {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    try {
      await this.swUpdate.checkForUpdate();
    } catch (error) {
      console.error('No se ha podido comprobar si hay actualizaciones:', error);
    }
  }
}
