import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Producto } from '../../models/producto.model';
import { Usuario } from '../../models/usuario.model';

import { ProductoService } from '../../core/services/producto';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  usuario: Usuario | null = null;
  productos: Producto[] = [];

  totalProductos = 0;
  totalOfertas = 0;
  productosSinStock = 0;

  cargando = true;
  errorCarga = false;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;

        this.totalProductos = productos.length;

        this.totalOfertas = productos.filter((producto) => producto.oferta).length;

        this.productosSinStock = productos.filter((producto) => producto.stock === 0).length;

        this.cargando = false;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error al cargar Dashboard:', error);

        this.errorCarga = true;
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
