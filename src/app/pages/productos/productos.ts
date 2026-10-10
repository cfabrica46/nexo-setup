import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../core/services/producto';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: Producto[] = [];

  terminoBusqueda = '';
  categoriaSeleccionada = 'Todos';

  cargando = true;
  errorCarga = false;

  skeletons = Array.from({ length: 8 });

  iconos: Record<string, string> = {
    Todos: 'ph-squares-four',
    Teclados: 'ph-keyboard',
    Mouse: 'ph-mouse',
    Audio: 'ph-headphones',
    Escritorio: 'ph-desktop',
    Conectividad: 'ph-usb',
    Iluminación: 'ph-lightbulb',
  };

  categorias: string[] = [
    'Todos',
    'Teclados',
    'Mouse',
    'Audio',
    'Escritorio',
    'Conectividad',
    'Iluminación',
  ];

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
        this.productos = productos;
        this.cargando = false;

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);

        this.errorCarga = true;
        this.cargando = false;

        this.cdr.markForCheck();
      },
    });
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  get productosFiltrados(): Producto[] {
    const termino = this.terminoBusqueda.trim().toLowerCase();

    return this.productos.filter((producto) => {
      const coincideCategoria =
        this.categoriaSeleccionada === 'Todos' || producto.categoria === this.categoriaSeleccionada;

      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }
}
