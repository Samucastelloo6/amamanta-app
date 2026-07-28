import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
export class AdminLoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly sessionMessage = signal<string | null>(null);

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');

    if (reason === 'inactivity') {
      this.sessionMessage.set(
        'La sesión se ha cerrado tras 30 minutos de inactividad.',
      );
    }
  }

  login(credentials: LoginCredentials): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.sessionMessage.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        void this.router.navigate(['/admin/talleres']);
      },
      error: () => {
        this.errorMessage.set('El correo o la contraseña no son correctos.');
        this.isLoading.set(false);
      },
    });
  }
}
