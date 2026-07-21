import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './app-modal.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = 'solar:widget-5-bold';
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }
}
