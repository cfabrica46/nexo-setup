import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap, throwError } from 'rxjs';

import { Producto } from '../../models/producto.model';

/** Cambios hechos por el administrador: se guardan solo en este navegador. */
interface CambiosLocales {
  creados: Producto[];
  editados: Record<number, Producto>;
  eliminados: number[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'https://nexo-setup.onrender.com';

  private readonly storageKey = 'nexo_productos_locales';

  /** Copia de lo que respondió la API durante esta sesión */
  private productosApi: Producto[] | null = null;

  constructor(private http: HttpClient) {}

  /** Productos de la API con los cambios locales ya aplicados */
  getProductos(): Observable<Producto[]> {
    if (this.productosApi) {
      return of(this.aplicarCambios(this.productosApi));
    }

    return this.http.get<Producto[]>(`${this.apiUrl}/productos`).pipe(
      tap((productos) => (this.productosApi = productos)),
      map((productos) => this.aplicarCambios(productos)),
    );
  }

  getProducto(id: number): Observable<Producto> {
    return this.getProductos().pipe(
      map((productos) => {
        const producto = productos.find((item) => item.id === id);

        if (!producto) {
          throw { status: 404 };
        }

        return producto;
      }),
    );
  }

  // =========================
  // CRUD en LocalStorage
  // =========================

  crear(datos: Omit<Producto, 'id'>): Producto {
    const cambios = this.leerCambios();

    const ultimoId = Math.max(1000, ...cambios.creados.map((producto) => producto.id));
    const nuevo: Producto = { ...datos, id: ultimoId + 1 };

    cambios.creados.push(nuevo);
    this.guardarCambios(cambios);

    return nuevo;
  }

  actualizar(producto: Producto): void {
    const cambios = this.leerCambios();
    const indice = cambios.creados.findIndex((item) => item.id === producto.id);

    if (indice >= 0) {
      cambios.creados[indice] = producto;
    } else {
      cambios.editados[producto.id] = producto;
    }

    this.guardarCambios(cambios);
  }

  eliminar(id: number): void {
    const cambios = this.leerCambios();
    const eraCreado = cambios.creados.some((producto) => producto.id === id);

    if (eraCreado) {
      cambios.creados = cambios.creados.filter((producto) => producto.id !== id);
    } else {
      delete cambios.editados[id];

      if (!cambios.eliminados.includes(id)) {
        cambios.eliminados.push(id);
      }
    }

    this.guardarCambios(cambios);
  }

  /** Borra todos los cambios locales y vuelve a los datos originales */
  restablecer(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // sin almacenamiento
    }
  }

  get cantidadCambiosLocales(): number {
    const cambios = this.leerCambios();

    return cambios.creados.length + Object.keys(cambios.editados).length + cambios.eliminados.length;
  }

  // =========================
  // Internos
  // =========================

  private aplicarCambios(base: Producto[]): Producto[] {
    const cambios = this.leerCambios();

    const existentes = base
      .filter((producto) => !cambios.eliminados.includes(producto.id))
      .map((producto) => cambios.editados[producto.id] ?? producto);

    return [...existentes, ...cambios.creados];
  }

  private leerCambios(): CambiosLocales {
    const vacio: CambiosLocales = { creados: [], editados: {}, eliminados: [] };

    try {
      const guardado = localStorage.getItem(this.storageKey);

      if (!guardado) {
        return vacio;
      }

      const datos = JSON.parse(guardado) as Partial<CambiosLocales>;

      return {
        creados: datos.creados ?? [],
        editados: datos.editados ?? {},
        eliminados: datos.eliminados ?? [],
      };
    } catch {
      return vacio;
    }
  }

  private guardarCambios(cambios: CambiosLocales): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cambios));
    } catch {
      // sin almacenamiento: el cambio no se conserva
    }
  }
}
