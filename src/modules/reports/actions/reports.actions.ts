// File: frontend/src/modules/reports/actions/reports.actions.ts

'use server';

import { cookies } from 'next/headers';
import { getAdminReportesStats } from '../services/reports.service';
import { IReporteFilters, IEstadisticasPedidos } from '../types/reports.types';
import { reporteFiltrosSchema } from '../schemas/reports.schema';

/**
 * Server Action para solicitar las estadísticas desde componentes del cliente o servidor
 */
export async function fetchReportesStatsAction(
  filters?: IReporteFilters
): Promise<{ success: boolean; data?: IEstadisticasPedidos; message?: string }> {
  try {
    const validation = reporteFiltrosSchema.safeParse(filters || {});
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || 'Filtros de fecha inválidos',
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('ecommerce-token')?.value;

    if (!token) {
      return { success: false, message: 'Sesión expirada o token ausente.' };
    }

    const data = await getAdminReportesStats(token, validation.data);

    if (!data) {
      return { success: false, message: 'No se pudieron recuperar las estadísticas.' };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[fetchReportesStatsAction Error]:', error);
    return { success: false, message: 'Fallo de conexión al servidor al obtener reportes.' };
  }
}