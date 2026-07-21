import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConfirmModalComponent {
  @Input() title = 'Confirmar acción';
  @Input() message = '';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  confirmAction(): void {
    this.confirm.emit();
  }

  cancelAction(): void {
    this.cancel.emit();
  }
}
