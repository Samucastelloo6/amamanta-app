import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';

import {
  FriendlySpace,
  FriendlySpaceCategory,
} from '../../../../core/models/friendly-space';
import { FriendlySpaceCategoryService } from '../../../../core/services/friendly-space-category.service';
import { FriendlySpacesService } from '../../../../core/services/friendlySpace.service';
import { AppModalComponent } from '../../../../shared/components/app-modal/app-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/status-modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { WarningModalComponent } from '../../../../shared/components/status-modals/warning-modal/warning-modal.component';
import { FriendlySpaceCategoryFormComponent } from '../../components/friendly-space-category-form/friendly-space-category-form.component';
import { FriendlySpaceFormComponent } from '../../components/friendly-space-form/friendly-space-form.component';

type AdminFriendlySpacesTab = 'spaces' | 'categories';

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
  ],
  templateUrl: './admin-friendly-spaces.component.html',
  styleUrl: './admin-friendly-spaces.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminFriendlySpacesComponent {
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

  constructor() {
    this.refreshData();
  }

  changeTab(tab: AdminFriendlySpacesTab): void {
    this.activeTab.set(tab);
  }

  openCreateSpace(): void {
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

  saveSpace(space: FriendlySpace): void {
    const isEditing = !!this.selectedSpace();

    if (isEditing) {
      this.friendlySpacesService.updateFriendlySpace(space);
    } else {
      this.friendlySpacesService.addFriendlySpace(space);
    }

    this.refreshSpaces();
    this.closeSpaceForm();

    this.showSuccess(
      isEditing ? 'Espacio actualizado' : 'Espacio creado',
      isEditing
        ? 'El espacio amigo se ha actualizado correctamente.'
        : 'El espacio amigo se ha creado correctamente.',
    );
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

    this.friendlySpacesService.deleteFriendlySpace(space.id);

    this.refreshSpaces();
    this.closeSpaceDeleteConfirm();

    this.showSuccess(
      'Espacio eliminado',
      'El espacio amigo se ha eliminado correctamente.',
    );
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

  saveCategory(category: FriendlySpaceCategory): void {
    const isEditing = !!this.selectedCategory();

    if (isEditing) {
      this.categoryService.updateCategory(category);
    } else {
      this.categoryService.addCategory(category);
    }

    this.refreshCategories();
    this.closeCategoryForm();

    this.showSuccess(
      isEditing ? 'Categoría actualizada' : 'Categoría creada',
      isEditing
        ? 'La categoría se ha actualizado correctamente.'
        : 'La categoría se ha creado correctamente.',
    );
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

    this.categoryService.deleteCategory(category.id);

    this.refreshCategories();
    this.closeCategoryDeleteConfirm();

    this.showSuccess(
      'Categoría eliminada',
      'La categoría se ha eliminado correctamente.',
    );
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
}
