import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { Producto } from '../../models/producto.model';

export interface ItemCarrito {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
  cantidad: number;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'nexo_cart';

  private readonly itemsSubject = new BehaviorSubject<ItemCarrito[]>(this.leer());

  readonly items$ = this.itemsSubject.asObservable();
  readonly cantidad$ = this.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.cantidad, 0)),
  );
  readonly total$ = this.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.precio * item.cantidad, 0)),
  );

  agregar(producto: Producto): boolean {
    if (producto.stock <= 0) {
      return false;
    }

    const items = [...this.itemsSubject.value];
    const existente = items.find((item) => item.id === producto.id);

    if (existente) {
      if (existente.cantidad >= producto.stock) {
        return false;
      }

      existente.cantidad += 1;
    } else {
      items.push({
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        categoria: producto.categoria,
        precio: this.precioFinal(producto),
        cantidad: 1,
        stock: producto.stock,
      });
    }

    this.guardar(items);

    return true;
  }

  cambiarCantidad(id: number, cantidad: number): void {
    const items = this.itemsSubject.value
      .map((item) =>
        item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item,
      )
      .filter((item) => item.cantidad > 0);

    this.guardar(items);
  }

  quitar(id: number): void {
    this.guardar(this.itemsSubject.value.filter((item) => item.id !== id));
  }

  vaciar(): void {
    this.guardar([]);
  }

  precioFinal(producto: Producto): number {
    if (!producto.oferta || !producto.descuento) {
      return producto.precio;
    }

    return producto.precio - (producto.precio * producto.descuento) / 100;
  }

  private guardar(items: ItemCarrito[]): void {
    this.itemsSubject.next(items);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // sin almacenamiento: el carrito vive solo en memoria
    }
  }

  private leer(): ItemCarrito[] {
    try {
      const guardado = localStorage.getItem(this.storageKey);

      return guardado ? (JSON.parse(guardado) as ItemCarrito[]) : [];
    } catch {
      return [];
    }
  }
}
