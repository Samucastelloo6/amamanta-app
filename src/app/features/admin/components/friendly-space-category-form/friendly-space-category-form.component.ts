import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FriendlySpaceCategory } from '../../../../core/models/friendly-space';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

@Component({
  selector: 'app-friendly-space-category-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './friendly-space-category-form.component.html',
})
export class FriendlySpaceCategoryFormComponent implements OnChanges {
  @Input() category: FriendlySpaceCategory | null = null;

  @Output() saved = new EventEmitter<FriendlySpaceCategory>();
  @Output() cancelled = new EventEmitter<void>();

  form: FriendlySpaceCategory = this.getEmptyForm();

  fieldErrors: Partial<Record<keyof FriendlySpaceCategory, string>> = {};

  showWarningModal = false;
  warningMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      this.loadForm();
    }
  }

  save(): void {
    const cleanCategory = this.getCleanCategory();

    this.fieldErrors = this.getFieldErrors(cleanCategory);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.warningMessage =
        'Escribe un nombre para la categoría antes de continuar.';
      this.showWarningModal = true;
      return;
    }

    this.saved.emit(cleanCategory);
    this.resetForm();
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  reset(): void {
    this.resetForm();
  }

  clearFieldError(field: keyof FriendlySpaceCategory): void {
    delete this.fieldErrors[field];
  }

  closeWarningModal(): void {
    this.showWarningModal = false;

    setTimeout(() => {
      document.querySelector<HTMLInputElement>('[name="name"]')?.focus();
    });
  }

  private loadForm(): void {
    this.form = this.category ? { ...this.category } : this.getEmptyForm();

    this.fieldErrors = {};
    this.warningMessage = '';
    this.showWarningModal = false;
  }

  private resetForm(): void {
    this.form = this.getEmptyForm();
    this.fieldErrors = {};
    this.warningMessage = '';
    this.showWarningModal = false;
  }

  private getEmptyForm(): FriendlySpaceCategory {
    return {
      id: '',
      name: '',
      isActive: true,
    };
  }

  private getCleanCategory(): FriendlySpaceCategory {
    const name = this.cleanText(this.form.name);

    return {
      ...this.form,
      id: this.form.id || this.generateId(name),
      name,
      isActive: !!this.form.isActive,
    };
  }

  private getFieldErrors(
    category: FriendlySpaceCategory,
  ): Partial<Record<keyof FriendlySpaceCategory, string>> {
    const errors: Partial<Record<keyof FriendlySpaceCategory, string>> = {};

    if (!category.name) {
      errors.name = 'Escribe el nombre de la categoría.';
    }

    return errors;
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }

  private generateId(name: string): string {
    const normalizedName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `categoria-${normalizedName}-${Date.now()}`;
  }
}
