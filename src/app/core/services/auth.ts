import { Injectable } from '@angular/core';

import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionKey = 'nexo_session';

  private readonly demoEmail = 'admin@nexosetup.pe';
  private readonly demoPassword = 'nexo123';

  login(email: string, password: string): boolean {
    if (email === this.demoEmail && password === this.demoPassword) {
      const usuario: Usuario = {
        nombre: 'Administrador NEXO',
        email: this.demoEmail,
        rol: 'Administrador',
        fechaIngreso: new Date().toISOString(),
      };

      localStorage.setItem(this.sessionKey, JSON.stringify(usuario));

      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.sessionKey) !== null;
  }

  getUsuario(): Usuario | null {
    const session = localStorage.getItem(this.sessionKey);

    if (!session) {
      return null;
    }

    return JSON.parse(session) as Usuario;
  }
}
