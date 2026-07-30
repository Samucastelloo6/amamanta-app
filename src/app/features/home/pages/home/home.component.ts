import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { PwaInstallService } from '../../../../core/services/pwa-install.service';
import { InstallPwaModalComponent } from '../../../../shared/components/install-pwa-modal/install-pwa-modal.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, InstallPwaModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  private readonly swUpdate = inject(SwUpdate);
  readonly pwaInstallService = inject(PwaInstallService);

  readonly updateAvailable = signal(false);
  readonly updating = signal(false);
  readonly showIosInstallInstructions = signal(false);
  readonly installing = signal(false);

  ngOnInit(): void {
    this.listenForUpdates();
    void this.checkForUpdates();
  }

  get shouldShowInstallCard(): boolean {
    if (this.pwaInstallService.isInstalled()) {
      return false;
    }

    return (
      this.pwaInstallService.canInstall() || this.pwaInstallService.isIos()
    );
  }

  updateApplication(): void {
    if (this.updating()) {
      return;
    }

    this.updating.set(true);
    window.location.reload();
  }

  async installApplication(): Promise<void> {
    if (this.installing()) {
      return;
    }

    if (this.pwaInstallService.isIos()) {
      this.showIosInstallInstructions.set(true);
      return;
    }

    this.installing.set(true);

    try {
      await this.pwaInstallService.install();
    } finally {
      this.installing.set(false);
    }
  }

  closeIosInstallInstructions(): void {
    this.showIosInstallInstructions.set(false);
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
