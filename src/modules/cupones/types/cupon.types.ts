// File: frontend/src/modules/cupones/types/cupon.types.ts

export type TipoCupon = 'porcentaje' | 'monto';
export type AplicaACupon = 'todos' | 'categorias' | 'productos';

/** Referencia poblada que devuelve el backend en el detalle */
export interface ReferenciaCupon {
  _id: string;
  nombre: string;
  sku?: string;
}

export interface ICupon {
  _id: string;
  codigo: string;
  descripcion?: string;
  tipo: TipoCupon;
  valor: number;
  montoMinimo: number;
  aplicaA: AplicaACupon;
  categorias: Array<string | ReferenciaCupon>;
  productos: Array<string | ReferenciaCupon>;
  usosMaximos: number | null;
  usosPorCliente: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  activo: boolean;
  usos?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICuponesPaginados {
  data: ICupon[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

/** Resultado de validar un cupón contra el carrito (lo que usa el checkout) */
export interface IResultadoCupon {
  codigo: string;
  tipo: TipoCupon;
  valor: number;
  descuento: number;
}

export interface IAccionCuponResponse<T = ICupon> {
  success: boolean;
  message?: string;
  data?: T;
}
