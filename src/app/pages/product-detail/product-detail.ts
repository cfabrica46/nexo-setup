import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ProductoService } from '../../core/services/producto';
import { CartService } from '../../core/services/cart';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  producto: Producto | null = null;

  cargando = true;
  errorCarga = false;
  productoNoEncontrado = false;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
  ) {}

  agregado = false;

  agregarAlCarrito(): void {
    if (this.producto && this.cartService.agregar(this.producto)) {
      this.agregado = true;
      setTimeout(() => {
        this.agregado = false;
        this.cdr.markForCheck();
      }, 1400);
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.cargando = false;
      this.productoNoEncontrado = true;

      return;
    }

    this.cargarProducto(id);
  }

  private cargarProducto(id: number): void {
    this.cargando = true;
    this.errorCarga = false;
    this.productoNoEncontrado = false;

    this.productoService.getProducto(id).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.cargando = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.cargando = false;

        if (error.status === 404) {
          this.productoNoEncontrado = true;
        } else {
          this.errorCarga = true;
        }

        this.cdr.markForCheck();
      },
    });
  }

  get precioFinal(): number {
    if (!this.producto || !this.producto.oferta || !this.producto.descuento) {
      return this.producto?.precio ?? 0;
    }

    return this.producto.precio - (this.producto.precio * this.producto.descuento) / 100;
  }
}
