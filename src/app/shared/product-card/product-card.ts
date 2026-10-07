import { Component, Input } from '@angular/core';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() producto!: Producto;

  get precioFinal(): number {
    if (!this.producto.oferta || !this.producto.descuento) {
      return this.producto.precio;
    }

    return this.producto.precio - (this.producto.precio * this.producto.descuento) / 100;
  }
}
