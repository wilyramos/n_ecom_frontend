// File: frontend/src/modules/checkout/services/pedido.service.ts

import { IPedido } from '../types/pedido.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

/**
 * Obtiene el detalle de un pedido por su ID de MongoDB (_id)
 * Valida pertenencia de usuario en el backend.
 */
export async function obtenerPedidoPorId(id: string, token?: string): Promise<IPedido | null> {
  if (!id || id === 'undefined') return null;

  try {
    const res = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData.data as IPedido;
  } catch (error) {
    console.error('[obtenerPedidoPorId] Error al conectar con el servidor:', error);
    return null;
  }
}

/**
 * Obtiene la lista de pedidos del usuario autenticado (incluye compras previas como invitado)
 */
export async function obtenerMisPedidos(token: string): Promise<IPedido[]> {
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/pedidos/mis-pedidos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData.data as IPedido[];
  } catch (error) {
    console.error('[obtenerMisPedidos] Error al obtener historial:', error);
    return [];
  }
}

/**
 * Obtiene el pedido por su número de orden para la pantalla de éxito / checkout-result
 */
export async function obtenerPedidoPorNumero(orderNumber?: string): Promise<IPedido | null> {
  if (!orderNumber || orderNumber === 'undefined' || orderNumber.trim() === '') return null;

  try {
    const res = await fetch(`${API_URL}/pedidos/tracking/${orderNumber.trim()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData.data as IPedido;
  } catch (error) {
    console.error('[obtenerPedidoPorNumero] Error al consultar orden:', error);
    return null;
  }
}

/**
 * Consulta de tracking público seguro con doble validación (orderNumber + email/documento)
 */
export async function consultarTrackingPublico(orderNumber: string, emailOrDoc: string): Promise<IPedido | null> {
  if (!orderNumber || !emailOrDoc) return null;

  try {
    const query = new URLSearchParams({ emailOrDoc: emailOrDoc.trim() });
    const res = await fetch(`${API_URL}/pedidos/tracking/${orderNumber.trim()}?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData.data as IPedido;
  } catch (error) {
    console.error('[consultarTrackingPublico] Error:', error);
    return null;
  }
}