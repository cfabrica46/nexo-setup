import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CartService, ItemCarrito } from '../../core/services/cart';

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  items$: Observable<ItemCarrito[]>;
  total$: Observable<number>;

  compraRealizada = false;

  constructor(private cartService: CartService) {
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.total$;
  }

  cambiar(item: ItemCarrito, delta: number): void {
    this.cartService.cambiarCantidad(item.id, item.cantidad + delta);
  }

  quitar(item: ItemCarrito): void {
    this.cartService.quitar(item.id);
  }

  vaciar(): void {
    this.cartService.vaciar();
  }

  finalizar(): void {
    this.cartService.vaciar();
    this.compraRealizada = true;
  }
}
