// File: frontend/src/modules/cupones/services/cupones.service.ts

import { cookies } from 'next/headers';
import type { ICupon, ICuponesPaginados } from '../types/cupon.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ecommerce-token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ListarCuponesParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'activo' | 'inactivo';
}

/** Listado paginado para el panel admin (solo servidor) */
export async function obtenerCupones(params: ListarCuponesParams = {}): Promise<ICuponesPaginados> {
  const empty: ICuponesPaginados = {
    data: [],
    pagination: { total: 0, page: 1, limit: params.limit ?? 10, totalPages: 1 },
  };

  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.estado) query.set('estado', params.estado);

  try {
    const res = await fetch(`${API_URL}/cupones?${query.toString()}`, {
      headers: await getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return empty;
    const json = await res.json();
    return { data: json.data ?? [], pagination: json.pagination ?? empty.pagination };
  } catch (error) {
    console.error('[obtenerCupones] Error al consultar cupones:', error);
    return empty;
  }
}

/** Detalle de un cupón con categorías y productos poblados (solo servidor) */
export async function obtenerCuponPorId(id: string): Promise<ICupon | null> {
  try {
    const res = await fetch(`${API_URL}/cupones/${encodeURIComponent(id)}`, {
      headers: await getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as ICupon) ?? null;
  } catch (error) {
    console.error('[obtenerCuponPorId] Error:', error);
    return null;
  }
}
