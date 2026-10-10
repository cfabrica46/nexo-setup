import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { Tema, ThemeService } from '../../core/services/theme';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  usuario$: Observable<Usuario | null>;
  tema$: Observable<Tema>;
  cantidadCarrito$: Observable<number>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private cartService: CartService,
  ) {
    this.cantidadCarrito$ = this.cartService.cantidad$;
    this.usuario$ = this.authService.usuario$;
    this.tema$ = this.themeService.tema$;
  }

  alternarTema(): void {
    this.themeService.alternar();
  }

  cerrarSesion(): void {
    this.authService.logout();

    this.router.navigate(['/']);
  }
}
