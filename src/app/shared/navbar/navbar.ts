import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  usuario$: Observable<Usuario | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.usuario$ = this.authService.usuario$;
  }

  cerrarSesion(): void {
    this.authService.logout();

    this.router.navigate(['/']);
  }
}
