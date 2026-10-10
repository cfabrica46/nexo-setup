import { Component, Input } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() producto!: Producto;

  agregado = false;

  constructor(private cartService: CartService) {}

  agregar(): void {
    if (this.cartService.agregar(this.producto)) {
      this.agregado = true;
      setTimeout(() => (this.agregado = false), 1400);
    }
  }

  get precioFinal(): number {
    if (!this.producto.oferta || !this.producto.descuento) {
      return this.producto.precio;
    }

    return this.producto.precio - (this.producto.precio * this.producto.descuento) / 100;
  }
}
