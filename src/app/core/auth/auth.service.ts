import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

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
    return this.http
      .post<{
        success: true;
        data: AuthResponse;
      }>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        map((response) => response.data),
        tap((response) => {
          this.storage.setToken(response.accessToken);
          this.storage.setUser(response.user);
          this.currentUserSignal.set(response.user);
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
