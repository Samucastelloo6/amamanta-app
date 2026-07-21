import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  imports: [],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss',
})
export class SuccessModalComponent {
  @Input() title = '¡Todo correcto!';
  @Input() message = '';
  @Input() buttonText = 'Aceptar';

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
