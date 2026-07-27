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

import {
  CreateFriendlySpaceCategoryRequest,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';

type FriendlySpaceCategoryFormValue = Omit<FriendlySpaceCategory, 'id'> & {
  id?: string;
};

@Component({
  selector: 'app-friendly-space-category-form',
  imports: [FormsModule, NgClass, WarningModalComponent],
  templateUrl: './friendly-space-category-form.component.html',
})
export class FriendlySpaceCategoryFormComponent implements OnChanges {
  @Input() category: FriendlySpaceCategory | null = null;

  @Output() saved = new EventEmitter<
    FriendlySpaceCategory | CreateFriendlySpaceCategoryRequest
  >();

  @Output() cancelled = new EventEmitter<void>();

  form: FriendlySpaceCategoryFormValue = this.getEmptyForm();

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
    this.focusFirstInvalidField();
  }

  applyServerErrors(fields: Record<string, string>): string {
    const normalizedErrors: Partial<
      Record<keyof FriendlySpaceCategory, string>
    > = {};

    for (const [backendField, message] of Object.entries(fields)) {
      const rootField = backendField.split('.')[0];

      if (this.isCategoryField(rootField)) {
        normalizedErrors[rootField] = message;
      }
    }

    this.fieldErrors = {
      ...this.fieldErrors,
      ...normalizedErrors,
    };

    return (
      Object.values(normalizedErrors)[0] ?? 'Revisa los datos de la categoría.'
    );
  }

  focusFirstError(): void {
    this.focusFirstInvalidField();
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

  private getEmptyForm(): FriendlySpaceCategoryFormValue {
    return {
      name: '',
      isActive: true,
    };
  }

  private getCleanCategory():
    | FriendlySpaceCategory
    | CreateFriendlySpaceCategoryRequest {
    const payload: CreateFriendlySpaceCategoryRequest = {
      name: this.cleanText(this.form.name),
      isActive: !!this.form.isActive,
    };

    return this.form.id
      ? {
          id: this.form.id,
          ...payload,
        }
      : payload;
  }

  private getFieldErrors(
    category: CreateFriendlySpaceCategoryRequest,
  ): Partial<Record<keyof FriendlySpaceCategory, string>> {
    const errors: Partial<Record<keyof FriendlySpaceCategory, string>> = {};

    if (!category.name) {
      errors.name = 'Escribe el nombre de la categoría.';
    }

    return errors;
  }

  private focusFirstInvalidField(): void {
    const firstInvalidField = (
      ['name'] as (keyof FriendlySpaceCategory)[]
    ).find((field) => this.fieldErrors[field]);

    if (!firstInvalidField) {
      return;
    }

    setTimeout(() => {
      const element = document.querySelector<HTMLElement>(
        `[name="${firstInvalidField}"]`,
      );

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      element?.focus();
    });
  }

  private cleanText(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([,.])/g, '$1');
  }

  private isCategoryField(value: string): value is keyof FriendlySpaceCategory {
    const fields: (keyof FriendlySpaceCategory)[] = ['id', 'name', 'isActive'];

    return fields.includes(value as keyof FriendlySpaceCategory);
  }
}
