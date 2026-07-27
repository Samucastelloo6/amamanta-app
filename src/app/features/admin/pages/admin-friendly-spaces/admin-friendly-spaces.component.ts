import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  CreateFriendlySpaceCategoryRequest,
  CreateFriendlySpaceRequest,
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';
import { FriendlySpaceCategoryService } from '../../../../core/services/friendly-space-category.service';
import { FriendlySpacesService } from '../../../../core/services/friendlySpace.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';
import { FriendlySpaceCategoryFormComponent } from '../../components/friendly-space-category-form/friendly-space-category-form.component';
import { FriendlySpaceFormComponent } from '../../components/friendly-space-form/friendly-space-form.component';

type AdminFriendlySpacesTab = 'spaces' | 'categories';
type FormErrorTarget = 'space' | 'category' | null;

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
}

@Component({
  selector: 'app-admin-friendly-spaces',
  imports: [
    NgClass,
    AppModalComponent,
    FriendlySpaceFormComponent,
    FriendlySpaceCategoryFormComponent,
    ConfirmModalComponent,
    SuccessModalComponent,
    WarningModalComponent,
    ErrorModalComponent,
  ],
  templateUrl: './admin-friendly-spaces.component.html',
  styleUrl: './admin-friendly-spaces.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminFriendlySpacesComponent implements OnInit {
  private readonly friendlySpacesService = inject(FriendlySpacesService);
  private readonly categoryService = inject(FriendlySpaceCategoryService);

  @ViewChild(FriendlySpaceFormComponent)
  private friendlySpaceForm?: FriendlySpaceFormComponent;

  @ViewChild(FriendlySpaceCategoryFormComponent)
  private categoryForm?: FriendlySpaceCategoryFormComponent;

  readonly activeTab = signal<AdminFriendlySpacesTab>('spaces');

  readonly spaces = signal<FriendlySpace[]>([]);
  readonly categories = signal<FriendlySpaceCategory[]>([]);

  readonly showSpaceForm = signal(false);
  readonly selectedSpace = signal<FriendlySpace | null>(null);

  readonly showCategoryForm = signal(false);
  readonly selectedCategory = signal<FriendlySpaceCategory | null>(null);

  readonly showSpaceDeleteConfirm = signal(false);
  readonly spaceToDelete = signal<FriendlySpace | null>(null);

  readonly showCategoryDeleteConfirm = signal(false);
  readonly categoryToDelete = signal<FriendlySpaceCategory | null>(null);

  readonly showSuccessModal = signal(false);
  readonly successTitle = signal('');
  readonly successMessage = signal('');

  readonly showWarningModal = signal(false);
  readonly warningTitle = signal('');
  readonly warningMessage = signal('');

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  private formErrorTarget: FormErrorTarget = null;

  ngOnInit(): void {
    forkJoin({
      spaces: this.friendlySpacesService.loadFriendlySpaces(),
      categories: this.categoryService.loadCategories(),
    }).subscribe({
      next: () => {
        this.refreshData();
      },
      error: () => {
        this.showError(
          'No se han podido cargar los espacios amigos',
          'Ha ocurrido un error al obtener los espacios y sus categorías. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }

  changeTab(tab: AdminFriendlySpacesTab): void {
    this.activeTab.set(tab);
  }

  openCreateSpace(): void {
    const hasActiveCategories = this.categories().some(
      (category) => category.isActive,
    );

    if (!hasActiveCategories) {
      this.showWarning(
        'Primero crea una categoría',
        'Necesitas al menos una categoría activa antes de añadir un espacio amigo.',
      );

      return;
    }

    this.selectedSpace.set(null);
    this.showSpaceForm.set(true);
  }
  openEditSpace(space: FriendlySpace): void {
    this.selectedSpace.set(space);
    this.showSpaceForm.set(true);
  }

  closeSpaceForm(): void {
    this.friendlySpaceForm?.reset();

    this.showSpaceForm.set(false);
    this.selectedSpace.set(null);
  }

  saveSpace(space: FriendlySpace | CreateFriendlySpaceRequest): void {
    const selectedSpace = this.selectedSpace();
    const payload = this.getSpacePayload(space);

    if (selectedSpace) {
      this.friendlySpacesService
        .updateFriendlySpace(selectedSpace.id, payload)
        .subscribe({
          next: () => {
            this.refreshSpaces();
            this.closeSpaceForm();

            this.showSuccess(
              'Espacio actualizado',
              'El espacio amigo se ha actualizado correctamente.',
            );
          },
          error: (error: HttpErrorResponse) => {
            this.handleSpaceFormError(
              error,
              'No se ha podido actualizar el espacio',
              'Los cambios no se han guardado. Revisa los datos e inténtalo de nuevo.',
            );
          },
        });

      return;
    }

    this.friendlySpacesService.addFriendlySpace(payload).subscribe({
      next: () => {
        this.refreshSpaces();
        this.closeSpaceForm();

        this.showSuccess(
          'Espacio creado',
          'El espacio amigo se ha creado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.handleSpaceFormError(
          error,
          'No se ha podido crear el espacio',
          'Revisa los datos e inténtalo de nuevo.',
        );
      },
    });
  }

  openSpaceDeleteConfirm(space: FriendlySpace): void {
    this.spaceToDelete.set(space);
    this.showSpaceDeleteConfirm.set(true);
  }

  closeSpaceDeleteConfirm(): void {
    this.showSpaceDeleteConfirm.set(false);
    this.spaceToDelete.set(null);
  }

  deleteSelectedSpace(): void {
    const space = this.spaceToDelete();

    if (!space) {
      return;
    }

    this.friendlySpacesService.deleteFriendlySpace(space.id).subscribe({
      next: () => {
        this.refreshSpaces();
        this.closeSpaceDeleteConfirm();

        this.showSuccess(
          'Espacio eliminado',
          'El espacio amigo se ha eliminado correctamente.',
        );
      },
      error: () => {
        this.showError(
          'No se ha podido eliminar el espacio',
          'El espacio amigo no se ha eliminado. Inténtalo de nuevo.',
        );
      },
    });
  }

  openCreateCategory(): void {
    this.selectedCategory.set(null);
    this.showCategoryForm.set(true);
  }

  openEditCategory(category: FriendlySpaceCategory): void {
    this.selectedCategory.set(category);
    this.showCategoryForm.set(true);
  }

  closeCategoryForm(): void {
    this.categoryForm?.reset();

    this.showCategoryForm.set(false);
    this.selectedCategory.set(null);
  }

  saveCategory(
    category: FriendlySpaceCategory | CreateFriendlySpaceCategoryRequest,
  ): void {
    const selectedCategory = this.selectedCategory();
    const payload = this.getCategoryPayload(category);

    if (selectedCategory) {
      this.categoryService
        .updateCategory(selectedCategory.id, payload)
        .subscribe({
          next: () => {
            this.refreshCategories();
            this.closeCategoryForm();

            this.showSuccess(
              'Categoría actualizada',
              'La categoría se ha actualizado correctamente.',
            );
          },
          error: (error: HttpErrorResponse) => {
            this.handleCategoryFormError(
              error,
              'No se ha podido actualizar la categoría',
              'Los cambios no se han guardado. Revisa los datos e inténtalo de nuevo.',
            );
          },
        });

      return;
    }

    this.categoryService.addCategory(payload).subscribe({
      next: () => {
        this.refreshCategories();
        this.closeCategoryForm();

        this.showSuccess(
          'Categoría creada',
          'La categoría se ha creado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.handleCategoryFormError(
          error,
          'No se ha podido crear la categoría',
          'Revisa los datos e inténtalo de nuevo.',
        );
      },
    });
  }

  openCategoryDeleteConfirm(category: FriendlySpaceCategory): void {
    const hasAssociatedSpaces = this.spaces().some(
      (space) => space.categoryId === category.id,
    );

    if (hasAssociatedSpaces) {
      this.showWarning(
        'No se puede eliminar',
        'Esta categoría todavía contiene espacios. Mueve primero esos espacios a otra categoría.',
      );

      return;
    }

    this.categoryToDelete.set(category);
    this.showCategoryDeleteConfirm.set(true);
  }

  closeCategoryDeleteConfirm(): void {
    this.showCategoryDeleteConfirm.set(false);
    this.categoryToDelete.set(null);
  }

  deleteSelectedCategory(): void {
    const category = this.categoryToDelete();

    if (!category) {
      return;
    }

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.refreshCategories();
        this.closeCategoryDeleteConfirm();

        this.showSuccess(
          'Categoría eliminada',
          'La categoría se ha eliminado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.closeCategoryDeleteConfirm();

        const apiError = error.error as ApiErrorResponse | undefined;
        const message =
          apiError?.error?.message ??
          'La categoría no se ha eliminado. Inténtalo de nuevo.';

        if (
          error.status === 409 ||
          apiError?.error?.code === 'CATEGORY_HAS_FRIENDLY_SPACES'
        ) {
          this.showWarning('No se puede eliminar', message);
          return;
        }

        this.showError('No se ha podido eliminar la categoría', message);
      },
    });
  }

  getCategoryName(categoryId: string): string {
    return (
      this.categories().find((category) => category.id === categoryId)?.name ??
      'Sin categoría'
    );
  }

  getCategorySpacesCount(categoryId: string): number {
    return this.spaces().filter((space) => space.categoryId === categoryId)
      .length;
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  closeWarningModal(): void {
    this.showWarningModal.set(false);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);

    const target = this.formErrorTarget;
    this.formErrorTarget = null;

    if (!target) {
      return;
    }

    setTimeout(() => {
      if (target === 'space') {
        this.friendlySpaceForm?.focusFirstError();
        return;
      }

      this.categoryForm?.focusFirstError();
    });
  }

  private getSpacePayload(
    space: FriendlySpace | CreateFriendlySpaceRequest,
  ): CreateFriendlySpaceRequest {
    if ('id' in space) {
      const { id: _id, ...payload } = space;

      return payload;
    }

    return space;
  }

  private getCategoryPayload(
    category: FriendlySpaceCategory | CreateFriendlySpaceCategoryRequest,
  ): CreateFriendlySpaceCategoryRequest {
    if ('id' in category) {
      const { id: _id, ...payload } = category;

      return payload;
    }

    return category;
  }

  private handleSpaceFormError(
    error: HttpErrorResponse,
    title: string,
    fallbackMessage: string,
  ): void {
    const apiError = error.error as ApiErrorResponse | undefined;
    const fields = apiError?.error?.fields;

    this.formErrorTarget = fields ? 'space' : null;

    const message =
      fields && this.friendlySpaceForm
        ? this.friendlySpaceForm.applyServerErrors(fields)
        : apiError?.error?.message || fallbackMessage;

    this.showError(title, message);
  }

  private handleCategoryFormError(
    error: HttpErrorResponse,
    title: string,
    fallbackMessage: string,
  ): void {
    const apiError = error.error as ApiErrorResponse | undefined;
    const fields = apiError?.error?.fields;

    this.formErrorTarget = fields ? 'category' : null;

    const message =
      fields && this.categoryForm
        ? this.categoryForm.applyServerErrors(fields)
        : apiError?.error?.message || fallbackMessage;

    this.showError(title, message);
  }

  private refreshData(): void {
    this.refreshSpaces();
    this.refreshCategories();
  }

  private refreshSpaces(): void {
    const spaces = [
      ...this.friendlySpacesService.getAdminFriendlySpaces(),
    ].sort((a, b) => a.name.localeCompare(b.name, 'es'));

    this.spaces.set(spaces);
  }

  private refreshCategories(): void {
    const categories = [...this.categoryService.getAdminCategories()].sort(
      (a, b) => a.name.localeCompare(b.name, 'es'),
    );

    this.categories.set(categories);
  }

  private showSuccess(title: string, message: string): void {
    this.successTitle.set(title);
    this.successMessage.set(message);
    this.showSuccessModal.set(true);
  }

  private showWarning(title: string, message: string): void {
    this.warningTitle.set(title);
    this.warningMessage.set(message);
    this.showWarningModal.set(true);
  }

  private showError(title: string, message: string): void {
    this.errorTitle.set(title);
    this.errorMessage.set(message);
    this.showErrorModal.set(true);
  }
}
