import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static AUTH_KEY = 'sd-fs-auth';

  isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem(AuthService.AUTH_KEY) === '1';
  }

  login(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AuthService.AUTH_KEY, '1');
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AuthService.AUTH_KEY);
    }
  }
}
