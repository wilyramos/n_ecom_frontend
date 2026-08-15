'use client';

import React, { useState, useTransition } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IPedido, EstadoPedido } from '@/src/modules/checkout/types/pedido.types';
import {
  updateAdminPedidoStatusAction,
  updateBulkAdminPedidoStatusAction,
} from '@/src/modules/checkout/actions/admin-pedidos.actions';
import { exportPedidosToCSV } from '@/src/lib/export-csv';
import { IAdminPedidosStats } from '@/src/modules/checkout/services/admin-pedidos.service';

// Layouts
import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminPageHeader } from '@/src/components/admin/layout/admin-page-header';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { AdminFilterBar } from '@/src/components/admin/layout/admin-filter-bar';
import { AdminFilterDrawer } from '@/src/components/admin/layout/admin-filter-drawer';
import { AdminActiveFilters } from '@/src/components/admin/layout/admin-active-filters';
import { AdminTableBulkActions } from '@/src/components/admin/layout/admin-table-bulk-actions';
import { AdminTablePagination } from '@/src/components/admin/layout/admin-table-pagination';
import { AdminTableActions } from '@/src/components/admin/layout/admin-table-actions';
import { AdminMetricCard } from '@/src/components/admin/layout/admin-metric-card';
import {
  AdminFormGroup,
  AdminSelect,
  AdminInput,
} from '@/src/components/admin/layout/admin-form-group';
import {
  AdminTable,
  AdminTableHead,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
} from '@/src/components/admin/layout/admin-table';

import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';
import { Eye, CreditCard, Truck, Copy, Check, DollarSign, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPedidosClientProps {
  initialData: IPedido[];
  stats: IAdminPedidosStats;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentFilters: {
    status: string;
    provider: string;
    delivery: string;
    dateFrom: string;
    dateTo: string;
    search: string;
    page: number;
    limit: number;
  };
}

const STATUS_BADGE_MAP: Record<
  EstadoPedido,
  { status: StatusBadgeProps['status']; label: string }
> = {
  awaiting_payment: { status: 'pending', label: 'Esperando Pago' },
  processing: { status: 'processing', label: 'En Proceso' },
  shipped: { status: 'active', label: 'Enviado' },
  delivered: { status: 'completed', label: 'Entregado' },
  canceled: { status: 'cancelled', label: 'Cancelado' },
  paid_but_out_of_stock: { status: 'outOfStock', label: 'Sin Stock' },
};

export default function AdminPedidosClient({
  initialData,
  stats,
  pagination,
  currentFilters,
}: AdminPedidosClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState<string>(currentFilters.search || '');
  const [status, setStatus] = useState<string>(currentFilters.status || 'all');
  const [provider, setProvider] = useState<string>(currentFilters.provider || 'all');
  const [delivery, setDelivery] = useState<string>(currentFilters.delivery || 'all');
  const [dateFrom, setDateFrom] = useState<string>(currentFilters.dateFrom || '');
  const [dateTo, setDateTo] = useState<string>(currentFilters.dateTo || '');

  const applyFilters = (overrides: Record<string, string | number | null> = {}) => {
    const params = new URLSearchParams();

    const finalSearch = overrides.search !== undefined ? overrides.search : searchValue;
    const finalStatus = overrides.status !== undefined ? overrides.status : status;
    const finalProvider = overrides.provider !== undefined ? overrides.provider : provider;
    const finalDelivery = overrides.delivery !== undefined ? overrides.delivery : delivery;
    const finalFrom = overrides.dateFrom !== undefined ? overrides.dateFrom : dateFrom;
    const finalTo = overrides.dateTo !== undefined ? overrides.dateTo : dateTo;

    const rawPage = overrides.page !== undefined ? overrides.page : currentFilters.page;
    const finalPage = typeof rawPage === 'number' ? rawPage : Number(rawPage) || 1;

    const rawLimit = overrides.limit !== undefined ? overrides.limit : currentFilters.limit;
    const finalLimit = typeof rawLimit === 'number' ? rawLimit : Number(rawLimit) || 10;

    if (finalSearch) params.set('search', String(finalSearch));
    if (finalStatus && finalStatus !== 'all') params.set('status', String(finalStatus));
    if (finalProvider && finalProvider !== 'all') params.set('provider', String(finalProvider));
    if (finalDelivery && finalDelivery !== 'all') params.set('delivery', String(finalDelivery));
    if (finalFrom) params.set('dateFrom', String(finalFrom));
    if (finalTo) params.set('dateTo', String(finalTo));
    if (finalPage > 1) params.set('page', String(finalPage));
    if (finalLimit !== 10) params.set('limit', String(finalLimit));

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    setStatus('all');
    setProvider('all');
    setDelivery('all');
    setDateFrom('');
    setDateTo('');
    router.push(pathname);
  };

  const activeChips = [
    status !== 'all' && {
      id: 'status',
      label: 'Estado',
      value: STATUS_BADGE_MAP[status as EstadoPedido]?.label || status,
    },
    provider !== 'all' && {
      id: 'provider',
      label: 'Pasarela',
      value: provider.toUpperCase(),
    },
    delivery !== 'all' && {
      id: 'delivery',
      label: 'Entrega',
      value: delivery === 'shipping' ? 'Envío' : 'Recojo',
    },
    dateFrom && { id: 'dateFrom', label: 'Desde', value: dateFrom },
    dateTo && { id: 'dateTo', label: 'Hasta', value: dateTo },
  ].filter(Boolean) as { id: string; label: string; value: string }[];

  const handleRemoveChip = (id: string) => {
    if (id === 'status') { setStatus('all'); applyFilters({ status: 'all' }); }
    if (id === 'provider') { setProvider('all'); applyFilters({ provider: 'all' }); }
    if (id === 'delivery') { setDelivery('all'); applyFilters({ delivery: 'all' }); }
    if (id === 'dateFrom') { setDateFrom(''); applyFilters({ dateFrom: '' }); }
    if (id === 'dateTo') { setDateTo(''); applyFilters({ dateTo: '' }); }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? initialData.map((i) => i._id) : []);
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSingleStatusChange = (id: string, newStatus: EstadoPedido) => {
    startTransition(async () => {
      const res = await updateAdminPedidoStatusAction(id, newStatus);
      if (res.success) {
        toast.success('Estado actualizado correctamente.');
      } else {
        toast.error(res.message || 'Error al actualizar.');
      }
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const res = await updateBulkAdminPedidoStatusAction(selectedIds, newStatus as EstadoPedido);
      if (res.success) {
        toast.success(res.message);
        setSelectedIds([]);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`N° Orden copiado: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExportCSV = () => {
    const dataToExport =
      selectedIds.length > 0
        ? initialData.filter((i) => selectedIds.includes(i._id))
        : initialData;

    if (dataToExport.length === 0) {
      toast.error('No hay datos para exportar.');
      return;
    }

    exportPedidosToCSV(dataToExport, `pedidos_export_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`Exportados ${dataToExport.length} pedidos a CSV.`);
  };

  return (
    <AdminPageContainer maxWidth="default" spacing="default">
      <AdminPageHeader
        title="Gestión de Pedidos"
      />

      {/* ── TARJETAS DE MÉTRICAS BASADAS EN PAGOS CONFIRMADOS EN BD ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Recaudado (Pagos Aprobados)"
          value={`S/ ${(stats?.totalRecaudado || 0).toFixed(2)}`}
          icon={DollarSign}
          description={`${stats?.totalApprovedOrders || 0} compras pagadas exitosamente`}
        />
        <AdminMetricCard
          title="Total Pedidos Registrados"
          value={pagination.total || 0}
          icon={ShoppingBag}
        />
        <AdminMetricCard
          title="Por Atender / En Proceso"
          value={stats?.pendientesCount || 0}
          icon={Clock}
          description="Aguardando preparación o envío"
        />
        <AdminMetricCard
          title="Entregados Exitosamente"
          value={stats?.entregadosCount || 0}
          icon={CheckCircle2}
        />
      </div>

      <div className="space-y-2">
        <AdminFilterBar
          searchPlaceholder="Buscar por orden, email o DNI..."
          searchValue={searchValue}
          onSearchChange={(val) => {
            setSearchValue(val);
            applyFilters({ search: val, page: 1 });
          }}
          activeCount={activeChips.length}
          onToggleAdvanced={() => setIsDrawerOpen(true)}
          onRefresh={() => router.refresh()}
          onExport={handleExportCSV}
          onReset={clearAllFilters}
          filters={
            <div className="hidden sm:flex items-center gap-1.5">
              <AdminSelect
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  applyFilters({ status: e.target.value, page: 1 });
                }}
                className="w-36 text-xs h-7 py-0"
              >
                <option value="all">Todos los Estados</option>
                <option value="awaiting_payment">Esperando Pago</option>
                <option value="processing">En Proceso</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregado</option>
                <option value="canceled">Cancelado</option>
              </AdminSelect>

              <AdminSelect
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                  applyFilters({ provider: e.target.value, page: 1 });
                }}
                className="w-36 text-xs h-7 py-0"
              >
                <option value="all">Todas las Pasarelas</option>
                <option value="culqi">Culqi</option>
                <option value="mercadopago">Mercado Pago</option>
                <option value="transferencia">Transferencia / Yape</option>
              </AdminSelect>
            </div>
          }
        />

        <AdminActiveFilters
          items={activeChips}
          onRemove={handleRemoveChip}
          onClearAll={clearAllFilters}
        />
      </div>

      <AdminCardWrapper padding="none">
        <AdminTableBulkActions
          selectedCount={selectedIds.length}
          totalCount={initialData.length}
          onClearSelection={() => setSelectedIds([])}
          onStatusChange={handleBulkStatusChange}
          statusOptions={[
            { label: 'Marcar como Esperando Pago', value: 'awaiting_payment' },
            { label: 'Marcar como En Proceso', value: 'processing' },
            { label: 'Marcar como Enviado', value: 'shipped' },
            { label: 'Marcar como Entregado', value: 'delivered' },
            { label: 'Marcar como Cancelado', value: 'canceled' },
          ]}
        />

        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell width="40px" align="center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === initialData.length && initialData.length > 0}
                  className="rounded border-zinc-300 cursor-pointer"
                />
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>N° Orden</AdminTableHeaderCell>
              <AdminTableHeaderCell>Fecha</AdminTableHeaderCell>
              <AdminTableHeaderCell>Cliente</AdminTableHeaderCell>
              <AdminTableHeaderCell>Entrega</AdminTableHeaderCell>
              <AdminTableHeaderCell>Pasarela</AdminTableHeaderCell>
              <AdminTableHeaderCell>Total</AdminTableHeaderCell>
              <AdminTableHeaderCell>Estado</AdminTableHeaderCell>
              <AdminTableHeaderCell align="right">Acciones</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {initialData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-xs text-zinc-400">
                  No se encontraron pedidos registrados.
                </td>
              </tr>
            ) : (
              initialData.map((pedido) => {
                const isSelected = selectedIds.includes(pedido._id);
                const badgeInfo = STATUS_BADGE_MAP[pedido.status] || {
                  status: 'pending',
                  label: pedido.status,
                };

                return (
                  <AdminTableRow
                    id={`pedido-row-${pedido._id}`}
                    key={pedido._id} selected={isSelected}>
                    <AdminTableCell align="center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(pedido._id)}
                        className="rounded border-zinc-300 cursor-pointer"
                      />
                    </AdminTableCell>

                    <AdminTableCell bold>
                      <div className="flex items-center gap-1.5">
                        <span>#{pedido.orderNumber}</span>
                        <button
                          onClick={(e) => handleCopyCode(pedido.orderNumber, e)}
                          className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition-colors"
                          title="Copiar N° Orden"
                        >
                          {copiedCode === pedido.orderNumber ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                        {new Date(pedido.createdAt).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell>
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {pedido.customerProfile?.nombre} {pedido.customerProfile?.apellidos}
                        </p>
                        <p className="text-[11px] text-zinc-400">{pedido.customerProfile?.email}</p>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <span className="inline-flex items-center gap-1 text-zinc-600">
                        <Truck className="w-3.5 h-3.5 text-zinc-400" />
                        {pedido.deliveryMethod === 'shipping' ? 'Envío' : 'Recojo'}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-zinc-100 font-semibold text-zinc-700 uppercase">
                        <CreditCard className="w-3 h-3" />
                        {pedido.payment?.provider}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell bold>S/ {pedido.totalPrice?.toFixed(2)}</AdminTableCell>

                    <AdminTableCell>
                      <StatusBadge
                        status={badgeInfo.status}
                        label={badgeInfo.label}
                        size="sm"
                      />
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      <div className="flex items-center justify-end gap-1">
                        <NextLink
                          href={`/admin/pedidos/${pedido._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-black text-white rounded-md text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Ver
                        </NextLink>

                        <AdminTableActions
                          label="Cambiar Estado"
                          actions={[
                            {
                              label: 'Marcar En Proceso',
                              onClick: () => handleSingleStatusChange(pedido._id, 'processing'),
                            },
                            {
                              label: 'Marcar Enviado',
                              onClick: () => handleSingleStatusChange(pedido._id, 'shipped'),
                            },
                            {
                              label: 'Marcar Entregado',
                              onClick: () => handleSingleStatusChange(pedido._id, 'delivered'),
                            },
                            {
                              label: 'Marcar Cancelado',
                              variant: 'destructive',
                              onClick: () => handleSingleStatusChange(pedido._id, 'canceled'),
                            },
                          ]}
                        />
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })
            )}
          </tbody>
        </AdminTable>

        <AdminTablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={currentFilters.limit}
          totalItems={pagination.total}
          selectedCount={selectedIds.length}
          onPageChange={(p) => applyFilters({ page: p })}
          onPageSizeChange={(s) => applyFilters({ limit: s, page: 1 })}
        />
      </AdminCardWrapper>

      <AdminFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filtros Avanzados de Pedidos"
        onApply={() => applyFilters({ page: 1 })}
        onReset={clearAllFilters}
      >
        <div className="space-y-4">
          <AdminFormGroup label="Estado del Pedido">
            <AdminSelect value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Todos</option>
              <option value="awaiting_payment">Esperando Pago</option>
              <option value="processing">En Proceso</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="canceled">Cancelado</option>
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label="Pasarela de Pago">
            <AdminSelect value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="all">Todas</option>
              <option value="culqi">Culqi</option>
              <option value="mercadopago">Mercado Pago</option>
              <option value="transferencia">Transferencia / Yape</option>
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label="Método de Entrega">
            <AdminSelect value={delivery} onChange={(e) => setDelivery(e.target.value)}>
              <option value="all">Todos</option>
              <option value="shipping">Envío a Domicilio</option>
              <option value="pickup">Recojo en Tienda</option>
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label="Fecha Desde">
            <AdminInput
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </AdminFormGroup>

          <AdminFormGroup label="Fecha Hasta">
            <AdminInput
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </AdminFormGroup>
        </div>
      </AdminFilterDrawer>
    </AdminPageContainer>
  );
}