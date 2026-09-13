import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PlaceOption } from '../../../core/models/experience-place';
import { AppModalComponent } from '../app-modal/app-modal.component';

/*
 * Selector de sitio con el estilo de la aplicación.
 *
 * Un desplegable nativo lo dibuja el sistema operativo, así que no hay forma
 * de que pegue con el resto de la pantalla. Esto es un campo con el mismo
 * aspecto que los demás que, al tocarlo, abre la ventana de la aplicación con
 * la lista y un buscador.
 *
 * El buscador solo aparece cuando hay suficientes opciones como para que haga
 * falta; con tres talleres estorba más que ayuda.
 */
const MIN_OPTIONS_FOR_SEARCH = 7;

/* Para que «sesion» encuentre «Sesión» y «marti» encuentre «Martes». */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

@Component({
  selector: 'app-place-picker',
  imports: [NgClass, FormsModule, AppModalComponent],
  templateUrl: './place-picker.component.html',
})
export class PlacePickerComponent {
  @Input() places: PlaceOption[] = [];
  @Input() value = '';
  @Input() disabled = false;
  @Input() isLoading = false;

  /* Texto del campo cuando todavía no se ha elegido nada. */
  @Input() placeholder = 'Selecciona una opción';

  /* Título de la ventana y del buscador. */
  @Input() modalTitle = 'Elegir';
  @Input() searchPlaceholder = 'Buscar...';
  @Input() icon = 'solar:map-point-bold';

  /*
   * Como filtro siempre hay al menos la opción «todos», así que el campo no
   * debe quedarse con el texto de ayuda en gris: se marca cuál está activa.
   */
  @Input() alwaysHasSelection = false;

  @Output() valueChange = new EventEmitter<string>();

  isOpen = false;
  search = '';

  get selectedLabel(): string {
    return this.places.find((place) => place.id === this.value)?.label ?? '';
  }

  get showSearch(): boolean {
    return this.places.length >= MIN_OPTIONS_FOR_SEARCH;
  }

  get filteredPlaces(): PlaceOption[] {
    const term = normalize(this.search.trim());

    if (!term) {
      return this.places;
    }

    return this.places.filter((place) =>
      normalize(place.label).includes(term),
    );
  }

  get isDisabled(): boolean {
    return this.disabled || this.isLoading || this.places.length === 0;
  }

  open(): void {
    if (this.isDisabled) {
      return;
    }

    this.search = '';
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  select(place: PlaceOption): void {
    this.value = place.id;
    this.valueChange.emit(place.id);
    this.close();
  }

  isSelected(place: PlaceOption): boolean {
    return place.id === this.value;
  }
}
