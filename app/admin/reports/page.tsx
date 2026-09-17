// File: frontend/app/admin/reports/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/src/auth/dal';
import { getAdminReportesStats, getAdminReportesAvanzados } from '@/src/modules/reports/services/reports.service';
import { DollarSign, CheckCircle2, Truck, Package } from 'lucide-react';
import { AdminMetricsGroup } from '@/src/components/admin/layout/admin-metrics-group';
import SalesLineChart from '@/components/admin/reports/SalesLineChart';

interface ReportsPageProps {
  searchParams: Promise<{
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function ReportsOverviewPage({ searchParams }: ReportsPageProps) {
  const session = await verifySession();
  if (!session?.token) redirect('/auth/login');

  const query = await searchParams;
  const filters = {
    dateFrom: query.dateFrom || '',
    dateTo: query.dateTo || '',
    groupBy: 'daily' as const
  };

  // Carga paralela de KPIs básicos y data para gráficas
  const [stats, advancedData] = await Promise.all([
    getAdminReportesStats(session.token, filters),
    getAdminReportesAvanzados(session.token, filters)
  ]);

  const defaultStats = {
    totalRecaudado: 0, totalApprovedOrders: 0, pendientesCount: 0,
    enProcesoCount: 0, enviadosCount: 0, entregadosCount: 0, canceladosCount: 0,
  };
  const currentStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      {/* 1. Tarjetas de Resumen Global */}
      <AdminMetricsGroup
        metrics={[
          {
            title: 'Ingresos Totales',
            value: `S/ ${currentStats.totalRecaudado.toFixed(2)}`,
            icon: DollarSign,
            badgeText: 'Pagadas',
            badgeVariant: 'emerald'
          },
          {
            title: 'Órdenes Aprobadas',
            value: currentStats.totalApprovedOrders,
            icon: CheckCircle2,
          },
          {
            title: 'En Preparación',
            value: currentStats.enProcesoCount,
            icon: Package,
            badgeText: 'Pendientes',
            badgeVariant: 'blue'
          },
          {
            title: 'Envíos en Ruta',
            value: currentStats.enviadosCount,
            icon: Truck,
            badgeText: 'En Tránsito',
            badgeVariant: 'amber'
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Gráfica Principal de Ventas */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Rendimiento de Ventas</h2>
              <p className="text-xs text-slate-500 mt-0.5">Evolución de ingresos en el rango seleccionado</p>
            </div>
          </div>
          <SalesLineChart data={advancedData?.ventasEnElTiempo || []} />
        </div>

        {/* 3. Top Productos - Lista rápida */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">Top 5 Productos</h2>
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {advancedData?.productosMasVendidos && advancedData.productosMasVendidos.length > 0 ? (
              advancedData.productosMasVendidos.slice(0, 5).map((prod, index) => (
                <div key={prod.productoId} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-400 w-4 text-center">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate" title={prod.nombre}>
                        {prod.nombre}
                      </p>
                      <p className="text-xs text-slate-500">{prod.cantidadVendida} unid. vendidas</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 shrink-0">
                    S/ {prod.ingresosGenerados.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No hay ventas registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}