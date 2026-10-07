import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../core/services/producto';

@Component({
  selector: 'app-tienda',
  standalone: false,
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda implements OnInit {
  setupEsencial: Producto[] = [];
  recomendados: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.setupEsencial = productos.filter((producto) => [1, 7, 9].includes(producto.id));

        this.recomendados = productos.filter((producto) => producto.destacado).slice(0, 4);

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error al cargar productos de tienda:', error);
      },
    });
  }
}
