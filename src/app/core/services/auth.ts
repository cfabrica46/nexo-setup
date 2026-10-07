import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionKey = 'nexo_session';

  private readonly demoEmail = 'admin@nexosetup.pe';
  private readonly demoPassword = 'nexo123';

  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUsuario());

  readonly usuario$ = this.usuarioSubject.asObservable();

  login(email: string, password: string): boolean {
    if (email !== this.demoEmail || password !== this.demoPassword) {
      return false;
    }

    const usuario: Usuario = {
      nombre: 'Administrador NEXO',
      email: this.demoEmail,
      rol: 'Administrador',
      fechaIngreso: new Date().toISOString(),
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(usuario));

    this.usuarioSubject.next(usuario);

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);

    this.usuarioSubject.next(null);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.sessionKey) !== null;
  }

  getUsuario(): Usuario | null {
    const session = localStorage.getItem(this.sessionKey);

    if (!session) {
      return null;
    }

    try {
      return JSON.parse(session) as Usuario;
    } catch {
      return null;
    }
  }
}
