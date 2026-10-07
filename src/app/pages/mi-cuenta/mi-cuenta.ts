import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-mi-cuenta',
  standalone: false,
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuenta implements OnInit {
  usuario: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuario = null;
    this.router.navigate(['/']);
  }
}
