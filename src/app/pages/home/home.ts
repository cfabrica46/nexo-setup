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
        this.productosDestacados = productos.filter((producto) => producto.destacado).slice(0, 4);

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos destacados:', error);
      },
    });
  }
}
