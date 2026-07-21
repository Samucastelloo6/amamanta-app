import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  imports: [],
  templateUrl: './warning-modal.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WarningModalComponent {
  @Input() title = 'Atención';
  @Input() message = '';
  @Input() buttonText = 'Aceptar';

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
