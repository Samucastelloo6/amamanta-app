import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'auth_user';

  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  setUser<T>(user: T): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = sessionStorage.getItem(this.USER_KEY);

    return user ? (JSON.parse(user) as T) : null;
  }

  removeUser(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }
}
