import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Producto } from '../../models/producto.model';
import { Usuario } from '../../models/usuario.model';

import { ProductoService } from '../../core/services/producto';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';

interface FormularioProducto {
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  precio: number | null;
  stock: number | null;
  destacado: boolean;
  oferta: boolean;
  descuento: number | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  productos: Producto[] = [];

  totalProductos = 0;
  totalOfertas = 0;
  productosSinStock = 0;

  cargando = true;
  errorCarga = false;

  productosPocoStock = 0;
  porcentajeDisponibles = 0;

  productosPorCategoria: {
    categoria: string;
    cantidad: number;
    porcentaje: number;
  }[] = [];

  productosStockNormal = 0;

  displayTotalProductos = 0;
  displayTotalOfertas = 0;
  displayProductosSinStock = 0;
  displayProductosPocoStock = 0;
  displayPorcentajeDisponibles = 0;

  private contadorAnimationId?: number;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarProductos();
  }

  ngOnDestroy(): void {
    if (this.contadorAnimationId) {
      cancelAnimationFrame(this.contadorAnimationId);
    }
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.aplicarProductos(productos);
      },

      error: (error) => {
        console.error('Error al cargar Dashboard:', error);

        this.errorCarga = true;
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  private aplicarProductos(productos: Producto[]): void {
    this.productos = productos;

    this.totalProductos = productos.length;

    this.totalOfertas = productos.filter((producto) => producto.oferta).length;

    this.productosSinStock = productos.filter((producto) => producto.stock === 0).length;

    this.productosPocoStock = productos.filter(
      (producto) => producto.stock > 0 && producto.stock <= 5,
    ).length;

    this.productosStockNormal = productos.filter((producto) => producto.stock > 5).length;

    const productosDisponibles = productos.filter((producto) => producto.stock > 0).length;

    this.porcentajeDisponibles =
      this.totalProductos > 0 ? Math.round((productosDisponibles / this.totalProductos) * 100) : 0;

    this.calcularProductosPorCategoria(productos);

    this.cargando = false;

    this.animarContadores();

    this.cdr.markForCheck();
  }

  // =========================
  // CRUD (solo LocalStorage)
  // =========================

  readonly categoriasDisponibles = [
    'Teclados',
    'Mouse',
    'Audio',
    'Escritorio',
    'Conectividad',
    'Iluminación',
  ];

  readonly imagenesSugeridas = [
    'keyboard-01',
    'keyboard-02',
    'mouse-01',
    'mouse-02',
    'audio-01',
    'audio-02',
    'desk-01',
    'desk-02',
    'connectivity-01',
    'connectivity-02',
    'light-01',
    'light-02',
  ].map((nombre) => `/assets/products/${nombre}.jpg`);

  formularioAbierto = false;
  productoEditandoId: number | null = null;
  formulario: FormularioProducto = this.formularioVacio();

  confirmacion: { tipo: 'eliminar' | 'restablecer'; producto?: Producto } | null = null;

  mensaje = '';
  private mensajeTimeout?: ReturnType<typeof setTimeout>;

  get cambiosLocales(): number {
    return this.productoService.cantidadCambiosLocales;
  }

  private formularioVacio(): FormularioProducto {
    return {
      nombre: '',
      descripcion: '',
      imagen: '/assets/products/keyboard-01.jpg',
      categoria: 'Teclados',
      precio: null,
      stock: null,
      destacado: false,
      oferta: false,
      descuento: null,
    };
  }

  abrirNuevo(): void {
    this.productoEditandoId = null;
    this.formulario = this.formularioVacio();
    this.formularioAbierto = true;
  }

  abrirEditar(producto: Producto): void {
    this.productoEditandoId = producto.id;
    this.formulario = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      destacado: producto.destacado,
      oferta: producto.oferta,
      descuento: producto.descuento ?? null,
    };
    this.formularioAbierto = true;
  }

  cerrarFormulario(): void {
    this.formularioAbierto = false;
  }

  guardarProducto(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const datos: Omit<Producto, 'id'> = {
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim(),
      imagen: this.formulario.imagen.trim(),
      categoria: this.formulario.categoria,
      precio: Number(this.formulario.precio),
      stock: Math.floor(Number(this.formulario.stock)),
      destacado: this.formulario.destacado,
      oferta: this.formulario.oferta,
      ...(this.formulario.oferta ? { descuento: Number(this.formulario.descuento) } : {}),
    };

    if (this.productoEditandoId === null) {
      this.productoService.crear(datos);
      this.mostrarMensaje('Producto creado.');
    } else {
      this.productoService.actualizar({ ...datos, id: this.productoEditandoId });
      this.mostrarMensaje('Cambios guardados.');
    }

    this.formularioAbierto = false;
    this.recargarDesdeLocal();
  }

  pedirEliminar(producto: Producto): void {
    this.confirmacion = { tipo: 'eliminar', producto };
  }

  pedirRestablecer(): void {
    this.confirmacion = { tipo: 'restablecer' };
  }

  cancelarConfirmacion(): void {
    this.confirmacion = null;
  }

  confirmarAccion(): void {
    if (!this.confirmacion) {
      return;
    }

    if (this.confirmacion.tipo === 'eliminar' && this.confirmacion.producto) {
      this.productoService.eliminar(this.confirmacion.producto.id);
      this.cartService.quitar(this.confirmacion.producto.id);
      this.mostrarMensaje('Producto eliminado.');
    } else {
      this.productoService.restablecer();
      this.mostrarMensaje('Datos originales restablecidos.');
    }

    this.confirmacion = null;
    this.recargarDesdeLocal();
  }

  private recargarDesdeLocal(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => this.aplicarProductos(productos),
    });
  }

  private mostrarMensaje(texto: string): void {
    this.mensaje = texto;

    if (this.mensajeTimeout) {
      clearTimeout(this.mensajeTimeout);
    }

    this.mensajeTimeout = setTimeout(() => {
      this.mensaje = '';
      this.cdr.markForCheck();
    }, 2800);
  }

  private calcularProductosPorCategoria(productos: Producto[]): void {
    const categorias = new Map<string, number>();

    productos.forEach((producto) => {
      const cantidadActual = categorias.get(producto.categoria) ?? 0;

      categorias.set(producto.categoria, cantidadActual + 1);
    });

    const mayorCantidad = Math.max(...categorias.values(), 1);

    this.productosPorCategoria = Array.from(categorias.entries()).map(([categoria, cantidad]) => ({
      categoria,
      cantidad,
      porcentaje: (cantidad / mayorCantidad) * 100,
    }));
  }

  get porcentajeStockNormal(): number {
    if (this.totalProductos === 0) {
      return 0;
    }

    return (this.productosStockNormal / this.totalProductos) * 100;
  }

  get porcentajePocoStock(): number {
    if (this.totalProductos === 0) {
      return 0;
    }

    return (this.productosPocoStock / this.totalProductos) * 100;
  }

  get stockChartBackground(): string {
    const normal = this.porcentajeStockNormal;

    const pocoStock = normal + this.porcentajePocoStock;

    return `
    conic-gradient(
      #22c55e 0% ${normal}%,
      #f59e0b ${normal}% ${pocoStock}%,
      #ef4444 ${pocoStock}% 100%
    )
  `;
  }

  private animarContadores(): void {
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducirMovimiento) {
      this.displayTotalProductos = this.totalProductos;
      this.displayTotalOfertas = this.totalOfertas;
      this.displayProductosSinStock = this.productosSinStock;
      this.displayProductosPocoStock = this.productosPocoStock;
      this.displayPorcentajeDisponibles = this.porcentajeDisponibles;

      this.cdr.markForCheck();
      return;
    }

    const duracion = 700;
    const inicio = performance.now();

    const animar = (tiempoActual: number) => {
      const progreso = Math.min((tiempoActual - inicio) / duracion, 1);

      // ease-out
      const suavizado = 1 - Math.pow(1 - progreso, 3);

      this.displayTotalProductos = Math.round(this.totalProductos * suavizado);

      this.displayTotalOfertas = Math.round(this.totalOfertas * suavizado);

      this.displayProductosSinStock = Math.round(this.productosSinStock * suavizado);

      this.displayProductosPocoStock = Math.round(this.productosPocoStock * suavizado);

      this.displayPorcentajeDisponibles = Math.round(this.porcentajeDisponibles * suavizado);

      this.cdr.markForCheck();

      if (progreso < 1) {
        this.contadorAnimationId = requestAnimationFrame(animar);
      }
    };

    this.contadorAnimationId = requestAnimationFrame(animar);
  }
}
