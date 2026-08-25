
//File: frontend/src/modules/checkout/services/admin-pedidos.service.ts
import { IPedido, EstadoPedido } from '@/src/modules/checkout/types/pedido.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface IAdminPedidosParams {
  page?: number;
  limit?: number;
  status?: EstadoPedido | string;
  paymentProvider?: string;
  deliveryMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface IAdminPedidosStats {
  totalRecaudado: number;
  totalApprovedOrders: number;
  pendientesCount: number;
  enProcesoCount: number;
  enviadosCount: number;
  entregadosCount: number;
  canceladosCount: number;
}

export interface IAdminPedidosResponse {
  success: boolean;
  data: IPedido[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Obtiene la lista de pedidos paginada para la administración
 */
export async function getAdminPedidos(
  params: IAdminPedidosParams,
  token: string
): Promise<IAdminPedidosResponse | null> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.paymentProvider && params.paymentProvider !== 'all') queryParams.append('paymentProvider', params.paymentProvider);
    if (params.deliveryMethod && params.deliveryMethod !== 'all') queryParams.append('deliveryMethod', params.deliveryMethod);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.search?.trim()) queryParams.append('search', params.search.trim());

    const res = await fetch(`${API_URL}/pedidos?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return (await res.json()) as IAdminPedidosResponse;
  } catch (error) {
    console.error('[getAdminPedidos Error]:', error);
    return null;
  }
}

/**
 * Obtiene las métricas financieras y operativas globales reales
 */
export async function getAdminPedidosStats(token: string): Promise<IAdminPedidosStats | null> {
  try {
    const res = await fetch(`${API_URL}/pedidos/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const responseData = await res.json();
    return responseData.data as IAdminPedidosStats;
  } catch (error) {
    console.error('[getAdminPedidosStats Error]:', error);
    return null;
  }
}

/**
 * Obtiene el detalle de un pedido por su ID de MongoDB
 */
export async function getAdminPedidoById(id: string, token: string): Promise<IPedido | null> {
  try {
    const res = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const responseData = await res.json();
    return responseData.data as IPedido;
  } catch (error) {
    console.error('[getAdminPedidoById Error]:', error);
    return null;
  }
}