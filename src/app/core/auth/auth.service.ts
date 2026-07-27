import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  fromEvent,
  map,
  merge,
  Observable,
  Subscription,
  tap,
  throttleTime,
  timer,
} from 'rxjs';

import { AuthResponse, AuthUser, LoginRequest } from './auth.models';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorageService);
  private readonly router = inject(Router);

  private readonly baseUrl = environment.apiUrl;

  private readonly inactivityDuration = 30 * 60 * 1000;

  private activitySubscription?: Subscription;
  private inactivityTimerSubscription?: Subscription;

  private readonly currentUserSignal = signal<AuthUser | null>(
    this.storage.getUser<AuthUser>(),
  );

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    if (this.currentUserSignal() && this.storage.getToken()) {
      this.startInactivityTracking();
    }
  }

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

          this.startInactivityTracking();
        }),
      );
  }

  logout(): void {
    this.stopInactivityTracking();
    this.storage.clear();
    this.currentUserSignal.set(null);
  }

  logoutDueToInactivity(): void {
    this.logout();

    void this.router.navigate(['/admin/login'], {
      queryParams: {
        reason: 'inactivity',
      },
    });
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  private startInactivityTracking(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.stopInactivityTracking();

    const activityEvents$ = merge(
      fromEvent(window, 'mousedown'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'scroll'),
      fromEvent(window, 'touchstart'),
      fromEvent(window, 'mousemove'),
    ).pipe(throttleTime(1000));

    this.activitySubscription = activityEvents$.subscribe(() => {
      if (this.isAuthenticated()) {
        this.restartInactivityTimer();
      }
    });

    this.restartInactivityTimer();
  }

  private restartInactivityTimer(): void {
    this.inactivityTimerSubscription?.unsubscribe();

    this.inactivityTimerSubscription = timer(this.inactivityDuration).subscribe(
      () => {
        this.logoutDueToInactivity();
      },
    );
  }

  private stopInactivityTracking(): void {
    this.activitySubscription?.unsubscribe();
    this.inactivityTimerSubscription?.unsubscribe();

    this.activitySubscription = undefined;
    this.inactivityTimerSubscription = undefined;
  }
}
