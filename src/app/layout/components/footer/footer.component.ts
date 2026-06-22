import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
