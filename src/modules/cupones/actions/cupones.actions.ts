// File: frontend/src/modules/cupones/actions/cupones.actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { IAccionCuponResponse, IResultadoCupon } from '../types/cupon.types';
import { cuponFormSchema, type CuponFormValues } from '../schemas/cupon.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

async function authHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ecommerce-token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Convierte el formulario al formato que espera el backend (ids y fechas ISO) */
function toPayload(values: CuponFormValues) {
  return {
    codigo: values.codigo.trim().toUpperCase(),
    descripcion: values.descripcion?.trim() || undefined,
    tipo: values.tipo,
    valor: values.valor,
    montoMinimo: values.montoMinimo,
    aplicaA: values.aplicaA,
    categorias: values.aplicaA === 'categorias' ? values.categorias : [],
    productos: values.aplicaA === 'productos' ? values.productos : [],
    usosMaximos: values.usosMaximos,
    usosPorCliente: values.usosPorCliente,
    fechaInicio: values.fechaInicio || null,
    fechaFin: values.fechaFin || null,
    activo: values.activo,
  };
}

async function enviar(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown
): Promise<IAccionCuponResponse> {
  try {
    const res = await fetch(`${API_URL}/cupones${path}`, {
      method,
      headers: await authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detalle = Array.isArray(json.errors) && json.errors[0]?.message;
      return { success: false, message: detalle || json.message || 'No se pudo completar la operación' };
    }
    revalidatePath('/admin/cupones');
    return { success: true, message: json.message, data: json.data };
  } catch (error) {
    console.error('[cupones.actions] Error de conexión:', error);
    return { success: false, message: 'No se pudo conectar con el servidor' };
  }
}

export async function crearCuponAction(values: CuponFormValues): Promise<IAccionCuponResponse> {
  const parsed = cuponFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Datos no válidos' };
  }
  return enviar('POST', '', toPayload(parsed.data));
}

export async function actualizarCuponAction(id: string, values: CuponFormValues): Promise<IAccionCuponResponse> {
  const parsed = cuponFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Datos no válidos' };
  }
  return enviar('PUT', `/${encodeURIComponent(id)}`, toPayload(parsed.data));
}

export async function cambiarEstadoCuponAction(id: string): Promise<IAccionCuponResponse> {
  return enviar('PATCH', `/${encodeURIComponent(id)}/estado`);
}

export async function eliminarCuponAction(id: string): Promise<IAccionCuponResponse> {
  return enviar('DELETE', `/${encodeURIComponent(id)}`);
}

/** Validación pública desde el checkout: el servidor recalcula el descuento */
export async function validarCuponAction(input: {
  codigo: string;
  email?: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
}): Promise<{ success: boolean; message?: string; data?: IResultadoCupon }> {
  try {
    const res = await fetch(`${API_URL}/cupones/validar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: json.message || 'El cupón no es válido' };
    }
    return { success: true, data: json.data as IResultadoCupon };
  } catch (error) {
    console.error('[validarCuponAction] Error:', error);
    return { success: false, message: 'No se pudo validar el cupón. Intenta de nuevo.' };
  }
}
