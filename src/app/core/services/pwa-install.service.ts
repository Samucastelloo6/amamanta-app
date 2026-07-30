import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;

  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  readonly canInstall = signal(false);
  readonly isInstalled = signal(false);
  readonly isIos = signal(false);
  readonly isSamsungInternet = signal(false);

  constructor() {
    this.detectDevice();
    this.listenForInstallPrompt();
    this.listenForInstallation();
  }

  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    await this.deferredPrompt.prompt();

    const choice = await this.deferredPrompt.userChoice;
    const installed = choice.outcome === 'accepted';

    this.deferredPrompt = null;
    this.canInstall.set(false);

    if (installed) {
      this.isInstalled.set(true);
    }

    return installed;
  }

  private detectDevice(): void {
    const userAgent = window.navigator.userAgent.toLowerCase();

    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isSamsungBrowser = /samsungbrowser/.test(userAgent);

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone ===
          true);

    this.isIos.set(isIosDevice);
    this.isSamsungInternet.set(isSamsungBrowser);
    this.isInstalled.set(isStandalone);
  }

  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();

      this.deferredPrompt = event as BeforeInstallPromptEvent;

      if (!this.isInstalled()) {
        this.canInstall.set(true);
      }
    });
  }

  private listenForInstallation(): void {
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.canInstall.set(false);
      this.isInstalled.set(true);
    });

    const standaloneQuery = window.matchMedia('(display-mode: standalone)');

    standaloneQuery.addEventListener('change', (event) => {
      if (event.matches) {
        this.canInstall.set(false);
        this.isInstalled.set(true);
      }
    });
  }
}
