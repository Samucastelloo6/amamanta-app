import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-error-modal',
  imports: [],
  templateUrl: './error-modal.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ErrorModalComponent {
  @Input() title = 'Ha ocurrido un error';
  @Input() message = 'No se ha podido completar la acción.';
  @Input() buttonText = 'Aceptar';

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
