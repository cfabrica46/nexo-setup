import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../core/services/producto';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  productosDestacados: Producto[] = [];
  heroProducto: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDestacados();
  }

  cargarDestacados(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.heroProducto = productos.find((producto) => producto.id === 1) ?? null;

        this.productosDestacados = productos.filter((producto) => producto.destacado).slice(0, 4);

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos destacados:', error);
      },
    });
  }

  get heroPrecioFinal(): number {
    if (!this.heroProducto || !this.heroProducto.oferta || !this.heroProducto.descuento) {
      return this.heroProducto?.precio ?? 0;
    }

    return (
      this.heroProducto.precio - (this.heroProducto.precio * this.heroProducto.descuento) / 100
    );
  }
}
