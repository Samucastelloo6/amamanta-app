import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, delay, tap } from 'rxjs';

import { AuthResponse, AuthUser, LoginRequest } from './auth.models';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorageService);

  private readonly baseUrl = environment.apiUrl;

  private readonly currentUserSignal = signal<AuthUser | null>(
    this.storage.getUser<AuthUser>(),
  );

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(payload: LoginRequest): Observable<AuthResponse> {
    if (payload.email !== 'admin@amamanta.es' || payload.password !== '1234') {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    const response: AuthResponse = {
      accessToken: 'token-temporal',
      user: {
        id: '1',
        name: 'Barbara',
        email: 'admin@amamanta.es',
        role: 'admin',
      },
    };

    return of(response).pipe(
      delay(600),
      tap((res) => {
        this.storage.setToken(res.accessToken);
        this.storage.setUser(res.user);
        this.currentUserSignal.set(res.user);
      }),
    );
  }

  logout(): void {
    this.storage.clear();
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return this.storage.getToken();
  }
}
