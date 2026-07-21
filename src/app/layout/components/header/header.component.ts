import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderComponent {
  menuOpen = false;

  private readonly authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;

  adminRoute(): string {
    return this.isAuthenticated() ? '/admin/eventos' : '/admin/login';
  }
}
