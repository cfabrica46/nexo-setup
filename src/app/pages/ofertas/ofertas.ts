import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../core/services/producto';

@Component({
  selector: 'app-ofertas',
  standalone: false,
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css',
})
export class Ofertas implements OnInit {
  productosEnOferta: Producto[] = [];

  cargando = true;
  errorCarga = false;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productosEnOferta = productos.filter((producto) => producto.oferta === true);

        this.cargando = false;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error al cargar ofertas:', error);

        this.errorCarga = true;
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
