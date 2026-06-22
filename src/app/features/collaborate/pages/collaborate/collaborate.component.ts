import { Component } from '@angular/core';
import { CollaborateOption } from '../../../../core/models/collaborate';
import { CollaborateService } from '../../../../core/services/collaborate.service';

@Component({
  selector: 'app-collaborate',
  imports: [],
  templateUrl: './collaborate.component.html',
  styleUrl: './collaborate.component.scss'
})
export class CollaborateComponent {

  options: CollaborateOption[] = [];

  constructor(private readonly collaborateService: CollaborateService) {
    this.options = this.collaborateService.getOptions();
  }

 openOption(option: CollaborateOption): void {

  if (!option.url) {
    return;
  }

  if (
    option.url.startsWith('mailto:') ||
    option.url.startsWith('tel:')
  ) {
    window.location.href = option.url;
    return;
  }

  window.open(option.url, '_blank');

}
copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Copiado al portapapeles');
    })
    .catch(() => {
      alert('No se ha podido copiar');
    });
}
}
