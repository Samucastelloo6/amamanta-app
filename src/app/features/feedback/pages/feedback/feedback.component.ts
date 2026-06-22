import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  imports: [FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

  rating = 0;
  selectedCategories: string[] = [];
  positive = '';
  improvement = '';
  submitted = false;

categories: string[] = [
  'Toda la aplicación',
  'Salas universitarias',
  'Talleres',
  'Espacios amigos',
  'Eventos',
  'Facilidad de uso'
];
toggleCategory(category: string): void {

  if (category === 'Toda la aplicación') {

    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = ['Toda la aplicación'];
    }

    return;
  }

  this.selectedCategories =
    this.selectedCategories.filter(c => c !== 'Toda la aplicación');

  if (this.selectedCategories.includes(category)) {

    this.selectedCategories =
      this.selectedCategories.filter(c => c !== category);

  } else {

    this.selectedCategories.push(category);

  }

}

isSelected(category: string): boolean {

  return this.selectedCategories.includes(category);

}
  setRating(value: number): void {
    this.rating = value;
  }

  getRatingText(): string {
    switch (this.rating) {
      case 1:
        return 'Todavía necesita mejoras.';
      case 2:
        return 'Puede mejorar en algunos aspectos.';
      case 3:
        return 'Me ha resultado útil.';
      case 4:
        return 'Me ha ayudado mucho.';
      case 5:
        return 'Me ha encantado y la recomendaría a otras madres.';
      default:
        return 'Selecciona una valoración.';
    }
  }

  sendFeedback(): void {
    if (this.rating === 0) {
      alert('Selecciona una valoración antes de enviar.');
      return;
    }

    const feedback = {
      rating: this.rating,
      categories: this.selectedCategories,
      positive: this.positive,
      improvement: this.improvement
    };

    console.log(feedback);

    this.submitted = true;
  }
}
