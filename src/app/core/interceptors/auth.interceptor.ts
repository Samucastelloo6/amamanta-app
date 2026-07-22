import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isBackendRequest = request.url.startsWith(environment.apiUrl);

  if (!isBackendRequest) {
    return next(request);
  }

  const token = authService.getToken();

  const authenticatedRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        authService.logout();

        void router.navigate(['/admin/login']);
      }

      return throwError(() => error);
    }),
  );
};
