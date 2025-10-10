import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-white">
      <div class="hidden md:flex md:col-span-4 bg-vodafone-red/90 items-center justify-center">
        <div class="w-80 h-80 rounded-full bg-white/80"></div>
      </div>
      <div class="md:col-span-8 flex items-center justify-center p-4">
        <div class="w-full max-w-[420px] border rounded shadow p-6 md:p-8">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
              <span class="text-3xl">👤</span>
            </div>
          </div>
          <h1 class="text-xl md:text-2xl font-semibold text-center mb-6">SD-FS PORTAL</h1>
          <form (ngSubmit)="login()" class="space-y-4">
            <div>
              <label class="text-xs text-gray-600">Email</label>
              <input [(ngModel)]="email" name="email" type="email" required
                class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red" />
            </div>
            <div>
              <div class="flex items-center justify-between">
                <label class="text-xs text-gray-600">Password</label>
                <a class="text-xs text-red-500 hover:underline" href="#">Forgot Password?</a>
              </div>
              <input [(ngModel)]="password" name="password" type="password" required
                class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red" />
            </div>
            <button type="submit" class="w-full bg-vodafone-red text-white font-semibold py-2 rounded hover:bg-vodafone-dark">LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private router: Router, private auth: AuthService) {}
  login() {
    this.auth.login(this.email);
    this.router.navigateByUrl('/dashboard');
  }
}
