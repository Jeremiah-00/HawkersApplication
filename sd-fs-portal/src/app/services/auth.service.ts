import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static AUTH_KEY = 'sd-fs-auth';
  private static EMAIL_KEY = 'sd-fs-email';

  isLoggedIn(): boolean {
    return (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem(AuthService.AUTH_KEY) === '1'
    );
  }

  login(email: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AuthService.AUTH_KEY, '1');
      localStorage.setItem(AuthService.EMAIL_KEY, email ?? '');
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AuthService.AUTH_KEY);
      localStorage.removeItem(AuthService.EMAIL_KEY);
    }
  }

  getUserEmail(): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(AuthService.EMAIL_KEY) ?? '';
  }
}
