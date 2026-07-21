import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  LoginCredentials,
  LoginFormComponent,
} from '../../components/login-form/login-form.component';

import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [LoginFormComponent, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  login(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/admin/eventos']);
      },
      error: () => {
        this.errorMessage.set('El correo o la contraseña no son correctos.');
        this.isLoading.set(false);
      },
    });
  }
}
