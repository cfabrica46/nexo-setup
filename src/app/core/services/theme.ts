import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Tema = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'nexo_theme';

  private readonly temaSubject = new BehaviorSubject<Tema>(this.leerTema());

  readonly tema$ = this.temaSubject.asObservable();

  constructor() {
    this.aplicar(this.temaSubject.value);
  }

  alternar(): void {
    const nuevo: Tema = this.temaSubject.value === 'dark' ? 'light' : 'dark';

    this.temaSubject.next(nuevo);
    this.aplicar(nuevo);
  }

  private leerTema(): Tema {
    try {
      const guardado = localStorage.getItem(this.storageKey);

      if (guardado === 'light' || guardado === 'dark') {
        return guardado;
      }
    } catch {
      // sin acceso a localStorage: se usa el tema por defecto
    }

    return 'dark';
  }

  private aplicar(tema: Tema): void {
    const raiz = document.documentElement;

    raiz.setAttribute('data-theme', tema);
    raiz.setAttribute('data-bs-theme', tema);

    try {
      localStorage.setItem(this.storageKey, tema);
    } catch {
      // se ignora si no hay almacenamiento
    }
  }
}
