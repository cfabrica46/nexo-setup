export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  precio: number;
  stock: number;
  destacado: boolean;
  oferta: boolean;
  descuento?: number;
}
