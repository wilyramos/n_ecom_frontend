// File: frontend/src/modules/reports/services/reports.service.ts

import {
  IReporteFilters,
  IReporteAvanzadoFiltros,
  IEstadisticasPedidos,
  IReporteAvanzadoResponse,
  IReportesBasicosResponse,
  IReportesAvanzadosResponse,
} from '../types/reports.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

/**
 * Obtiene las estadísticas básicas de pedidos (KPIs superiores)
 */
export async function getAdminReportesStats(
  token: string,
  filters?: IReporteFilters
): Promise<IEstadisticasPedidos | null> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const res = await fetch(`${API_URL}/reports/v3/pedidos?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const responseData = (await res.json()) as IReportesBasicosResponse;
    return responseData.data;
  } catch (error) {
    console.error('[getAdminReportesStats Error]:', error);
    return null;
  }
}

/**
 * Obtiene las métricas avanzadas para las gráficas y reportes detallados
 */
export async function getAdminReportesAvanzados(
  token: string,
  filters?: IReporteAvanzadoFiltros
): Promise<IReporteAvanzadoResponse | null> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters?.groupBy) queryParams.append('groupBy', filters.groupBy);
    
    // Evitar enviar 'all' al backend si representa "todos"
    if (filters?.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }
    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      queryParams.append('paymentStatus', filters.paymentStatus);
    }

    const res = await fetch(`${API_URL}/reports/v3/pedidos/avanzado?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const responseData = (await res.json()) as IReportesAvanzadosResponse;
    return responseData.data;
  } catch (error) {
    console.error('[getAdminReportesAvanzados Error]:', error);
    return null;
  }
}