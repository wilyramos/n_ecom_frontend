// File: frontend/src/modules/reports/types/reports.types.ts

export interface IEstadisticasPedidos {
  totalRecaudado: number;
  totalApprovedOrders: number;
  pendientesCount: number;
  enProcesoCount: number;
  enviadosCount: number;
  entregadosCount: number;
  canceladosCount: number;
}

export interface IReporteFilters {
  dateFrom?: string;
  dateTo?: string;
}

export interface IReporteAvanzadoFiltros extends IReporteFilters {
  groupBy?: 'daily' | 'monthly' | 'yearly';
  status?: string;
  paymentStatus?: string;
}

export interface IVentasPorPeriodo {
  periodo: string;
  totalRecaudado: number;
  cantidadPedidos: number;
}

export interface IMetricasPorAgrupacion {
  _id: string;
  totalRecaudado: number;
  cantidad: number;
}

export interface ITopProducto {
  productoId: string;
  nombre: string;
  cantidadVendida: number;
  ingresosGenerados: number;
}

export interface IReporteAvanzadoResponse {
  ventasEnElTiempo: IVentasPorPeriodo[];
  ventasPorMetodoPago: IMetricasPorAgrupacion[];
  ventasPorMetodoEnvio: IMetricasPorAgrupacion[];
  productosMasVendidos: ITopProducto[];
}

export interface IReportesBasicosResponse {
  success: boolean;
  data: IEstadisticasPedidos;
}

export interface IReportesAvanzadosResponse {
  success: boolean;
  data: IReporteAvanzadoResponse;
}