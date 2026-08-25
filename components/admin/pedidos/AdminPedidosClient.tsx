// File: frontend/components/admin/pedidos/AdminPedidosClient.tsx

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IPedido } from '@/src/modules/checkout/types/pedido.types';
import {
  IAdminPedidosParams,
  IAdminPedidosStats,
} from '@/src/modules/checkout/services/admin-pedidos.service';

// Layout & UI Components
import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminPageHeader } from '@/src/components/admin/layout/admin-page-header';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { AdminFilterBar } from '@/src/components/admin/layout/admin-filter-bar';
import { AdminFilterDrawer } from '@/src/components/admin/layout/admin-filter-drawer';
import { AdminSelect } from '@/src/components/admin/layout/admin-form-group';
import {
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from '@/src/components/admin/layout/admin-table';
import { AdminTablePagination } from '@/src/components/admin/layout/admin-table-pagination';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { CreditCard, Eye, Package, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { AdminMetricsBar } from '@/src/components/admin/layout/admin-metrics-bar';


export interface AdminPedidosClientProps {
  initialData: IPedido[];
  stats: IAdminPedidosStats;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentFilters: IAdminPedidosParams;
}

const STATUS_BADGE_MAP: Record<
  string,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
> = {
  awaiting_payment: { variant: 'outline', label: 'Esperando Pago' },
  processing: { variant: 'default', label: 'En Proceso' },
  shipped: { variant: 'secondary', label: 'Enviado' },
  delivered: { variant: 'default', label: 'Entregado' },
  canceled: { variant: 'destructive', label: 'Cancelado' },
  paid_but_out_of_stock: { variant: 'destructive', label: 'Sin Stock' },
};

export default function AdminPedidosClient({
  initialData,
  stats,
  pagination,
  currentFilters,
}: AdminPedidosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentFilters.search || '');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    dateFrom: currentFilters.dateFrom || '',
    dateTo: currentFilters.dateTo || '',
  });

  const updateUrlFilters = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`/admin/pedidos?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (val: string) => {
    setSearch(val);
    updateUrlFilters({ search: val, page: 1 });
  };

  const handleQuickFilter = (key: string, value: string) => {
    updateUrlFilters({ [key]: value, page: 1 });
  };

  const handleApplyDrawerFilters = () => {
    updateUrlFilters({
      dateFrom: tempFilters.dateFrom,
      dateTo: tempFilters.dateTo,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setTempFilters({ dateFrom: '', dateTo: '' });
    startTransition(() => {
      router.push('/admin/pedidos');
    });
  };

  const activeFilterCount = [
    currentFilters.status && currentFilters.status !== 'all',
    currentFilters.paymentProvider && currentFilters.paymentProvider !== 'all',
    currentFilters.deliveryMethod && currentFilters.deliveryMethod !== 'all',
    currentFilters.dateFrom,
    currentFilters.dateTo,
    currentFilters.search,
  ].filter(Boolean).length;

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="default">
      {/* Cabecera */}
      <AdminPageHeader
        title="Gestión de Pedidos"
        actions={
          isPending && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Actualizando lista...</span>
            </div>
          )
        }
      />


      <AdminMetricsBar
        defaultOpen={true}
        metrics={[
          {
            label: 'Recaudado Total',
            value: `S/ ${stats.totalRecaudado.toFixed(2)}`,
            icon: DollarSign,
          },
          {
            label: 'Órdenes Aprobadas',
            value: stats.totalApprovedOrders,
            icon: CheckCircle2,
            hint: 'completadas',
            hintColor: 'emerald',
          },
          {
            label: 'En Preparación',
            value: stats.enProcesoCount,
            icon: Clock,
            hint: 'pendientes',
            hintColor: 'blue',
          },
          {
            label: 'Por Entregar',
            value: stats.enviadosCount,
            icon: Truck,
            hint: 'en ruta',
            hintColor: 'amber',
          },
        ]}
      />

      {/* Barra de Filtros Unificada */}
      <AdminFilterBar
        searchPlaceholder="Buscar por orden, cliente, DNI..."
        searchValue={search}
        onSearchChange={handleSearchSubmit}
        activeCount={activeFilterCount}
        onToggleAdvanced={() => setIsDrawerOpen(true)}
        onReset={activeFilterCount > 0 ? handleResetFilters : undefined}
        onRefresh={() => updateUrlFilters({})}
        filters={
          <div className="flex items-center gap-1.5 flex-wrap">
            <AdminSelect
              value={currentFilters.status || 'all'}
              onChange={(e) => handleQuickFilter('status', e.target.value)}
              className="h-7 py-0 px-2 text-xs w-36"
            >
              <option value="all">Todos los estados</option>
              <option value="awaiting_payment">Esperando Pago</option>
              <option value="processing">En Proceso</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="canceled">Cancelado</option>
            </AdminSelect>

            <AdminSelect
              value={currentFilters.paymentProvider || 'all'}
              onChange={(e) => handleQuickFilter('provider', e.target.value)}
              className="h-7 py-0 px-2 text-xs w-32"
            >
              <option value="all">Todas las pasarelas</option>
              <option value="powerpay">Powerpay</option>
              <option value="culqi">Culqi</option>
              <option value="mercadopago">Mercado Pago</option>
              <option value="transferencia">Transferencia</option>
            </AdminSelect>

            <AdminSelect
              value={currentFilters.deliveryMethod || 'all'}
              onChange={(e) => handleQuickFilter('delivery', e.target.value)}
              className="h-7 py-0 px-2 text-xs w-28"
            >
              <option value="all">Todo tipo</option>
              <option value="shipping">Envío</option>
              <option value="pickup">Recojo</option>
            </AdminSelect>
          </div>
        }
      />

      {/* Drawer de Filtros Avanzados */}
      <AdminFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filtros de Fecha"
        description="Filtra los pedidos generados dentro de un rango de tiempo."
        onApply={handleApplyDrawerFilters}
        onReset={() => setTempFilters({ dateFrom: '', dateTo: '' })}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Desde:</label>
            <input
              type="date"
              value={tempFilters.dateFrom}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Hasta:</label>
            <input
              type="date"
              value={tempFilters.dateTo}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>
        </div>
      </AdminFilterDrawer>

      {/* Tabla */}
      <AdminCardWrapper padding="none">
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell width="140px">Orden</AdminTableHeaderCell>
              <AdminTableHeaderCell width="160px">Fecha</AdminTableHeaderCell>
              <AdminTableHeaderCell>Cliente</AdminTableHeaderCell>
              <AdminTableHeaderCell width="110px">Entrega</AdminTableHeaderCell>
              <AdminTableHeaderCell width="130px">Pago</AdminTableHeaderCell>
              <AdminTableHeaderCell width="110px">Total</AdminTableHeaderCell>
              <AdminTableHeaderCell width="120px">Estado</AdminTableHeaderCell>
              <AdminTableHeaderCell width="80px" align="right">Acción</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>

          <tbody className="divide-y divide-zinc-100">
            {initialData.length === 0 ? (
              <AdminTableEmpty
                title="No se encontraron pedidos"
                description="No existen órdenes registradas que coincidan con los filtros seleccionados."
                colSpan={8}
              />
            ) : (
              initialData.map((ped) => {
                const badge = STATUS_BADGE_MAP[ped.status] || {
                  variant: 'outline',
                  label: ped.status,
                };

                return (
                  <tr key={ped._id} className="hover:bg-zinc-50/60 transition-colors">
                    <AdminTableCell bold>
                      #{ped.orderNumber}
                    </AdminTableCell>

                    <AdminTableCell>
                      {formatDate(ped.createdAt)}
                    </AdminTableCell>

                    <AdminTableCell>
                      <p className="font-semibold text-zinc-900 truncate max-w-[170px]">
                        {ped.customerProfile.nombre} {ped.customerProfile.apellidos}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {ped.customerProfile.tipoDocumento}: {ped.customerProfile.numeroDocumento}
                      </p>
                    </AdminTableCell>

                    <AdminTableCell>
                      <span className="inline-flex items-center gap-1.5 text-zinc-700">
                        {ped.deliveryMethod === 'pickup' ? <Package size={13} className="text-zinc-400" /> : <Truck size={13} className="text-zinc-400" />}
                        {ped.deliveryMethod === 'pickup' ? 'Recojo' : 'Envío'}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell>
                      <span className="inline-flex items-center gap-1.5 text-zinc-700 uppercase">
                        <CreditCard size={13} className="text-zinc-400" />
                        {ped.payment.provider}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell bold>
                      S/ {ped.totalPrice.toFixed(2)}
                    </AdminTableCell>

                    <AdminTableCell>
                      <Badge variant={badge.variant}>
                        {badge.label}
                      </Badge>
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 font-medium">
                        <Link href={`/admin/pedidos/${ped._id}`}>
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Ver
                        </Link>
                      </Button>
                    </AdminTableCell>
                  </tr>
                );
              })
            )}
          </tbody>
        </AdminTable>

        {/* Paginador Modular */}
        <AdminTablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={Number(currentFilters.limit) || 10}
          totalItems={pagination.total}
          onPageChange={(page) => updateUrlFilters({ page })}
          onPageSizeChange={(limit) => updateUrlFilters({ limit, page: 1 })}
        />
      </AdminCardWrapper>
    </AdminPageContainer>
  );
}