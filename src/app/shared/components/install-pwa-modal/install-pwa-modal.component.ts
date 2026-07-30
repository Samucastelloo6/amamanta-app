import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

interface InstallationStep {
  number: number;
  title: string;
  description: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-install-pwa-modal',
  imports: [],
  templateUrl: './install-pwa-modal.component.html',
  styleUrl: './install-pwa-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InstallPwaModalComponent implements OnDestroy {
  @Input()
  isSamsungInternet = false;

  @Output()
  readonly close = new EventEmitter<void>();

  readonly applicationUrl = 'https://app.amamanta.es';

  readonly installationSteps: InstallationStep[] = [
    {
      number: 1,
      title: 'Abre el menú del navegador',
      description:
        'Pulsa el botón de los tres puntos situado en la parte inferior.',
      image: '/install-ios/paso-1.webp',
      alt: 'Menú de Safari con el botón de tres puntos señalado',
    },
    {
      number: 2,
      title: 'Pulsa «Compartir»',
      description: 'Selecciona la opción Compartir dentro del menú.',
      image: '/install-ios/paso-2.webp',
      alt: 'Opción Compartir de Safari señalada',
    },
    {
      number: 3,
      title: 'Añádela a la pantalla de inicio',
      description: 'Busca y pulsa «Añadir a pantalla de inicio».',
      image: '/install-ios/paso-3.webp',
      alt: 'Opción Añadir a pantalla de inicio señalada',
    },
    {
      number: 4,
      title: 'Confirma la instalación',
      description: 'Pulsa «Añadir» para terminar.',
      image: '/install-ios/paso-4.webp',
      alt: 'Botón Añadir señalado en la pantalla de confirmación',
    },
  ];

  showCopyToast = false;

  private copyToastTimeout?: ReturnType<typeof setTimeout>;

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  openInChrome(): void {
    window.location.href =
      'intent://app.amamanta.es#Intent;scheme=https;package=com.android.chrome;end';
  }

  async copyApplicationUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.applicationUrl);
      this.showCopiedToast();
    } catch {
      this.copyWithFallback();
    }
  }

  ngOnDestroy(): void {
    if (this.copyToastTimeout) {
      clearTimeout(this.copyToastTimeout);
    }
  }

  private copyWithFallback(): void {
    const textarea = document.createElement('textarea');

    textarea.value = this.applicationUrl;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const copied = document.execCommand('copy');

      if (copied) {
        this.showCopiedToast();
      }
    } finally {
      document.body.removeChild(textarea);
    }
  }

  private showCopiedToast(): void {
    if (this.copyToastTimeout) {
      clearTimeout(this.copyToastTimeout);
    }

    this.showCopyToast = true;

    this.copyToastTimeout = setTimeout(() => {
      this.showCopyToast = false;
    }, 2200);
  }
}
