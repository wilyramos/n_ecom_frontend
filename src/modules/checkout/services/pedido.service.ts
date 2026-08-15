//File: frontend/src/modules/checkout/services/pedido.service.ts

import { IPedido } from '../types/pedido.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Obtiene el detalle de un pedido por su ID interno de MongoDB (_id)
 * @param id MongoDB ObjectId del pedido
 * @param token Token de autenticación del usuario (opcional)
 */
export async function obtenerPedidoPorId(id: string, token?: string): Promise<IPedido | null> {
  if (!id || id === 'undefined') {
    console.warn('[obtenerPedidoPorId] ID de pedido no proporcionado o inválido.');
    return null;
  }

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
 * Obtiene la lista de pedidos del usuario autenticado
 * @param token Token Bearer JWT de sesión
 */
export async function obtenerMisPedidos(token: string): Promise<IPedido[]> {
  if (!token) {
    console.warn('[obtenerMisPedidos] Token de autenticación ausente.');
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/pedidos`, {
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
    console.error('[obtenerMisPedidos] Error al obtener historial de pedidos:', error);
    return [];
  }
}

/**
 * Obtiene el detalle de un pedido por su Número de Orden público (Ej: PED-20260808-0008)
 * Utilizado principalmente en la página de confirmación / éxito del checkout.
 * * @param orderNumber Código de orden formateado
 */
export async function obtenerPedidoPorNumero(orderNumber?: string): Promise<IPedido | null> {
  // Guard de seguridad: Previene ejecutar peticiones 'GET /api/pedidos/tracking/undefined' en Next.js
  if (!orderNumber || orderNumber === 'undefined' || orderNumber.trim() === '') {
    console.warn('[obtenerPedidoPorNumero] orderNumber no válido o ausente.');
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/pedidos/tracking/${orderNumber.trim()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Garantiza obtener el estado más reciente del pago
    });

    if (!res.ok) return null;

    const responseData = await res.json();
    return responseData.data as IPedido;
  } catch (error) {
    console.error('[obtenerPedidoPorNumero] Error al consultar estado de la orden:', error);
    return null;
  }
}