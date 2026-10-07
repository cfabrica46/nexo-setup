import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  errorLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  iniciarSesion(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorLogin = true;
      return;
    }

    const loginCorrecto = this.authService.login(this.email.trim(), this.password);

    if (loginCorrecto) {
      this.errorLogin = false;
      this.router.navigate(['/dashboard']);
      return;
    }

    this.errorLogin = true;
  }
}
