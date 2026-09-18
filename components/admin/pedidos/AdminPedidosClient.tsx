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
import { DollarSign, CheckCircle2, Clock, Truck } from 'lucide-react';
// Layout & UI
import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
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
import { AdminStatsRow } from '@/src/components/admin/layout/admin-stats-row';
import { AdminStatusBadge } from '@/src/components/admin/layout/admin-status-badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  CreditCard,
  Package, ExternalLink
} from 'lucide-react';

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

export default function AdminPedidosClient({
  initialData,
  stats,
  pagination,
  currentFilters,
}: AdminPedidosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

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
    if (key === 'status') {
      updateUrlFilters({ status: value, paymentStatus: 'all', page: 1 });
    } else if (key === 'paymentStatus') {
      updateUrlFilters({ paymentStatus: value, status: 'all', page: 1 });
    } else {
      updateUrlFilters({ [key]: value, page: 1 });
    }
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
    currentFilters.paymentStatus && currentFilters.paymentStatus !== 'all',
    currentFilters.paymentProvider && currentFilters.paymentProvider !== 'all',
    currentFilters.deliveryMethod && currentFilters.deliveryMethod !== 'all',
    currentFilters.dateFrom,
    currentFilters.dateTo,
    currentFilters.search,
  ].filter(Boolean).length;

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      {/* KPIs Compactos */}
      <AdminStatsRow
  stats={[
    {
      label: 'Total pagadas',
      value: `S/ ${stats.totalRecaudado.toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      iconColor: 'emerald',
      active: currentFilters.status === 'all' && currentFilters.paymentStatus === 'all',
      onClick: () => updateUrlFilters({ status: 'all', paymentStatus: 'all', page: 1 }),
    },
    {
      label: 'Pagadas',
      value: stats.totalApprovedOrders,
      icon: CheckCircle2,
      iconColor: 'indigo',
      active: currentFilters.paymentStatus === 'approved',
      onClick: () => handleQuickFilter('paymentStatus', 'approved'),
    },
    {
      label: 'Preparando',
      value: stats.enProcesoCount,
      icon: Clock,
      iconColor: 'blue',
      active: currentFilters.status === 'processing',
      onClick: () => handleQuickFilter('status', 'processing'),
    },
    {
      label: 'En Reparto',
      value: stats.enviadosCount,
      icon: Truck,
      iconColor: 'amber',
      active: currentFilters.status === 'shipped',
      onClick: () => handleQuickFilter('status', 'shipped'),
    },
  ]}
/>

      {/* Barra de Filtros */}
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
              value={currentFilters.paymentStatus || 'all'}
              onChange={(e) => handleQuickFilter('paymentStatus', e.target.value)}
              className="h-7 py-0 px-2 text-[11px] w-32 font-medium text-zinc-700 bg-white border-zinc-200"
            >
              <option value="all">Cobro: Todos</option>
              <option value="approved">Solo Pagadas</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazadas</option>
            </AdminSelect>

            <AdminSelect
              value={currentFilters.status || 'all'}
              onChange={(e) => handleQuickFilter('status', e.target.value)}
              className="h-7 py-0 px-2 text-[11px] w-36 font-medium text-zinc-700 bg-white border-zinc-200"
            >
              <option value="all">Logística: Todas</option>
              <option value="awaiting_payment">Esperando Pago</option>
              <option value="processing">En Preparación</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="canceled">Cancelado</option>
            </AdminSelect>

            <AdminSelect
              value={currentFilters.paymentProvider || 'all'}
              onChange={(e) => handleQuickFilter('provider', e.target.value)}
              className="h-7 py-0 px-2 text-[11px] w-28 font-medium text-zinc-700 bg-white border-zinc-200"
            >
              <option value="all">Pasarelas</option>
              <option value="powerpay">Powerpay</option>
              <option value="culqi">Culqi</option>
              <option value="mercadopago">Mercado Pago</option>
              <option value="transferencia">Transferencia</option>
            </AdminSelect>

            <AdminSelect
              value={currentFilters.deliveryMethod || 'all'}
              onChange={(e) => handleQuickFilter('delivery', e.target.value)}
              className="h-7 py-0 px-2 text-[11px] w-28 font-medium text-zinc-700 bg-white border-zinc-200"
            >
              <option value="all">Entrega</option>
              <option value="shipping">Envío</option>
              <option value="pickup">Recojo</option>
            </AdminSelect>
          </div>
        }
      />

      {/* Drawer Filtros de Fecha */}
      <AdminFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filtro por Fecha"
        description="Selecciona un intervalo de fechas para consultar las órdenes registradas."
        onApply={handleApplyDrawerFilters}
        onReset={() => setTempFilters({ dateFrom: '', dateTo: '' })}
      >
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
              Fecha de Inicio:
            </label>
            <input
              type="date"
              value={tempFilters.dateFrom}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
              Fecha de Fin:
            </label>
            <input
              type="date"
              value={tempFilters.dateTo}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>
        </div>
      </AdminFilterDrawer>

      {/* Tabla con min-width explícito para respetar todas las columnas en móviles */}
      <AdminCardWrapper padding="none" className="border-zinc-200/80 shadow-2xs">
        <AdminTable className="min-w-[980px]">
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell width="140px">Orden</AdminTableHeaderCell>
              <AdminTableHeaderCell width="130px">Fecha</AdminTableHeaderCell>
              <AdminTableHeaderCell width="200px">Cliente</AdminTableHeaderCell>
              <AdminTableHeaderCell width="240px">Productos</AdminTableHeaderCell>
              <AdminTableHeaderCell width="100px">Entrega</AdminTableHeaderCell>
              <AdminTableHeaderCell width="130px">Pago</AdminTableHeaderCell>
              <AdminTableHeaderCell width="110px">Total</AdminTableHeaderCell>
              <AdminTableHeaderCell width="130px">Estado</AdminTableHeaderCell>
              <AdminTableHeaderCell width="50px" align="right">Ver</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>

          <tbody className="divide-y divide-zinc-100 bg-white">
            {initialData.length === 0 ? (
              <AdminTableEmpty
                title="No se encontraron pedidos"
                description="Intenta cambiar los términos de búsqueda o filtros aplicados."
                colSpan={9}
              />
            ) : (
              initialData.map((ped) => {
                const isPickup = ped.deliveryMethod === 'pickup';
                const firstItem = ped.items?.[0];
                const totalItemsCount = ped.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
                const extraProductsCount = (ped.items?.length || 0) - 1;

                return (
                  <tr
                    key={ped._id}
                    className="hover:bg-zinc-50/60 transition-colors text-xs"
                  >
                    {/* Orden */}
                    <AdminTableCell bold className="text-zinc-900  w-[140px]">
                      <Link
                        href={`/admin/pedidos/${ped._id}`}
                        className="hover:underline hover:text-blue-600 block truncate"
                        title={ped.orderNumber}
                      >
                        {ped.orderNumber}
                      </Link>
                    </AdminTableCell>

                    {/* Fecha */}
                    <AdminTableCell className="text-zinc-500 whitespace-nowrap text-[11.5px] w-[130px]">
                      {formatDate(ped.createdAt)}
                    </AdminTableCell>

                    {/* Cliente */}
                    <AdminTableCell className="w-[200px]">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-medium text-zinc-900 truncate" title={`${ped.customerProfile.nombre} ${ped.customerProfile.apellidos}`}>
                          {ped.customerProfile.nombre} {ped.customerProfile.apellidos}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate">
                          {ped.customerProfile.tipoDocumento}: {ped.customerProfile.numeroDocumento}
                        </span>
                      </div>
                    </AdminTableCell>

                    {/* Productos */}
                    <AdminTableCell className="w-[240px]">
                      {firstItem ? (
                        <div className="flex items-center gap-2 pr-2">
                          <div className="flex flex-col min-w-0">
                            <span
                              className="truncate font-medium text-zinc-800 text-[11px] leading-tight"
                              title={firstItem.nombre}
                            >
                              {firstItem.nombre}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 leading-tight">
                              <span>Cant: {firstItem.quantity}</span>
                              {firstItem.variantAttributes && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">
                                    {Object.values(firstItem.variantAttributes).join(' / ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {extraProductsCount > 0 && (
                            <span
                              className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 border border-zinc-200/80"
                              title={`${totalItemsCount} unidades en total`}
                            >
                              +{extraProductsCount}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">—</span>
                      )}
                    </AdminTableCell>

                    {/* Entrega */}
                    <AdminTableCell className="w-[100px]">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        {isPickup ? (
                          <Package className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        ) : (
                          <Truck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        )}
                        <span className="text-[11.5px] font-medium">
                          {isPickup ? 'Recojo' : 'Envío'}
                        </span>
                      </div>
                    </AdminTableCell>

                    {/* Pago */}
                    <AdminTableCell className="w-[130px]">
                      <div className="flex flex-col gap-0.5 items-start">
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-zinc-600 uppercase tracking-tight">
                          <CreditCard className="h-3 w-3 text-zinc-400 shrink-0" />
                          {ped.payment.provider}
                        </span>
                        <AdminStatusBadge status={ped.payment.status} />
                      </div>
                    </AdminTableCell>

                    {/* Total */}
                    <AdminTableCell bold className="text-zinc-950 font-semibold text-xs whitespace-nowrap  w-[110px]">
                      S/ {ped.totalPrice.toFixed(2)}
                    </AdminTableCell>

                    {/* Estado */}
                    <AdminTableCell className="w-[130px]">
                      <AdminStatusBadge status={ped.status} />
                    </AdminTableCell>

                    {/* Acción */}
                    <AdminTableCell align="right" className="w-[50px]">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                        title="Ver detalles"
                      >
                        <Link href={`/admin/pedidos/${ped._id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="sr-only">Ver Pedido</span>
                        </Link>
                      </Button>
                    </AdminTableCell>
                  </tr>
                );
              })
            )}
          </tbody>
        </AdminTable>

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