// frontend/src/modules/tickets/components/AdminTicketsClient.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { ITicket, ITicketsPagination } from '@/src/modules/tickets/ticket.types';
import { deleteTicketAction } from '@/src/modules/tickets/admin-tickets.actions';
import { TicketDigitalizerDrawer } from '@/src/modules/tickets/components/TicketDigitalizerDrawer';

import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminActionBar } from '@/src/components/admin/layout/admin-action-bar';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { AdminFilterBar } from '@/src/components/admin/layout/admin-filter-bar';
import { AdminFilterDrawer } from '@/src/components/admin/layout/admin-filter-drawer';
import { AdminTablePagination } from '@/src/components/admin/layout/admin-table-pagination';
import { AdminTableActions } from '@/src/components/admin/layout/admin-table-actions';
import {
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from '@/src/components/admin/layout/admin-table';

import {
  FileUp,
  Printer,
  Download,
  Loader2,
  CheckSquare,
  QrCode,
  Pencil,
  FileText,
  Eye,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminTicketsClientProps {
  initialData: ITicket[];
  pagination: ITicketsPagination;
  currentFilters: {
    search: string;
    dateFrom: string;
    dateTo: string;
    page: number;
    limit: number;
  };
}

export default function AdminTicketsClient({
  initialData,
  pagination,
  currentFilters,
}: AdminTicketsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDigitalizerOpen, setIsDigitalizerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(currentFilters.search || '');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    dateFrom: currentFilters.dateFrom || '',
    dateTo: currentFilters.dateTo || '',
  });

  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const openTicketPdf = (ticketId: string) => {
    window.open(`/api/tickets/${ticketId}/pdf`, '_blank', 'width=800,height=900');
  };

  const openProfessionalPdf = (ticketId: string) => {
    window.open(`/api/tickets/${ticketId}/professional-pdf`, '_blank', 'width=800,height=900');
  };

  const handleOpenEdit = (ticket: ITicket) => {
    setEditingTicket(ticket);
    setIsDigitalizerOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setIsDigitalizerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDigitalizerOpen(false);
    setEditingTicket(null);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === initialData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialData.map((t) => t._id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const updateUrlParams = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const debouncedSearch = useDebouncedCallback((val: string) => {
    updateUrlParams({ search: val.trim() || undefined, page: 1 });
  }, 400);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    debouncedSearch(val);
  };

  const handleApplyDateFilters = () => {
    updateUrlParams({
      dateFrom: tempFilters.dateFrom || undefined,
      dateTo: tempFilters.dateTo || undefined,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setSelectedIds([]);
    setTempFilters({ dateFrom: '', dateTo: '' });
    debouncedSearch.cancel();
    startTransition(() => {
      router.push(pathname);
    });
  };

  const activeFilterCount = [
    currentFilters.search,
    currentFilters.dateFrom,
    currentFilters.dateTo,
  ].filter(Boolean).length;

  const handleBulkPrint = async (format: 'ticket' | 'professional' = 'ticket') => {
    if (selectedIds.length === 0) {
      toast.error('Selecciona al menos un comprobante.');
      return;
    }

    try {
      setIsBulkProcessing(true);
      const res = await fetch('/api/tickets/bulk-print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, format }),
      });

      if (!res.ok) throw new Error('Fallo al generar PDF unificado');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'width=800,height=900');
      toast.success(`${selectedIds.length} comprobantes listos para imprimir.`);
    } catch {
      toast.error('Error al procesar la impresión masiva.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkZipDownload = async (format: 'ticket' | 'professional' = 'ticket') => {
    if (selectedIds.length === 0) {
      toast.error('Selecciona al menos un comprobante.');
      return;
    }

    try {
      setIsBulkProcessing(true);
      const res = await fetch('/api/tickets/bulk-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, format }),
      });

      if (!res.ok) throw new Error('Fallo al generar archivo ZIP');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'comprobantes.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Archivo ZIP con ${selectedIds.length} comprobantes descargado.`);
    } catch {
      toast.error('Error al empaquetar en ZIP.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteTicketAction(id);
      if (res.success) {
        toast.success(res.message || 'Registro eliminado correctamente.');
        setSelectedIds((prev) => prev.filter((item) => item !== id));
      } else {
        toast.error(res.message || 'Error al eliminar.');
      }
    });
  };

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <AdminActionBar
        
      >
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <FileUp className="h-3.5 w-3.5 stroke-[2]" />
          <span>Digitalizar Comprobante</span>
        </button>
      </AdminActionBar>

      {selectedIds.length > 0 && (
        <div className="bg-zinc-900 text-white px-3.5 py-2 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-1 rounded-md">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium">
              {selectedIds.length} seleccionado{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleBulkPrint('ticket')}
              disabled={isBulkProcessing || isPending}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3 h-3" /> Ticket
            </button>
            <button
              type="button"
              onClick={() => handleBulkPrint('professional')}
              disabled={isBulkProcessing || isPending}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <QrCode className="w-3 h-3" /> Factura/QR
            </button>
            <button
              type="button"
              onClick={() => handleBulkZipDownload('professional')}
              disabled={isBulkProcessing || isPending}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {isBulkProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Download className="w-3 h-3" />
              )}
              ZIP
            </button>
          </div>
        </div>
      )}

      <AdminFilterBar
        searchPlaceholder="Buscar por pedido, cliente o N° comprobante..."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        activeCount={activeFilterCount}
        onToggleAdvanced={() => setIsFilterDrawerOpen(true)}
        onRefresh={() => updateUrlParams({})}
        onReset={activeFilterCount > 0 ? handleResetFilters : undefined}
      />

      <AdminFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtro por Fechas"
        description="Filtra comprobantes emitidos en un rango de fechas determinado."
        onApply={handleApplyDateFilters}
        onReset={() => setTempFilters({ dateFrom: '', dateTo: '' })}
      >
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
              Fecha Desde:
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
              Fecha Hasta:
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

      <AdminCardWrapper padding="none" className="border-zinc-200/80 shadow-2xs">
        <AdminTable className="min-w-[940px]">
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell width="40px" align="center">
                <input
                  type="checkbox"
                  checked={initialData.length > 0 && selectedIds.length === initialData.length}
                  onChange={handleSelectAll}
                  disabled={isPending}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer h-3.5 w-3.5 align-middle"
                />
              </AdminTableHeaderCell>
              <AdminTableHeaderCell width="130px">Comprobante</AdminTableHeaderCell>
              <AdminTableHeaderCell width="180px">Archivo de Origen</AdminTableHeaderCell>
              <AdminTableHeaderCell width="120px">Fecha / Hora</AdminTableHeaderCell>
              <AdminTableHeaderCell width="180px">Cliente</AdminTableHeaderCell>
              <AdminTableHeaderCell width="180px">Items</AdminTableHeaderCell>
              <AdminTableHeaderCell width="100px" align="right">Total</AdminTableHeaderCell>
              <AdminTableHeaderCell width="110px" align="right">Acciones</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {initialData.length === 0 ? (
              <AdminTableEmpty
                title="No se encontraron comprobantes"
                description="Sube un archivo PDF o imagen para digitalizar notas de venta o boletas."
                colSpan={8}
              />
            ) : (
              initialData.map((ticket) => {
                const isSelected = selectedIds.includes(ticket._id);
                return (
                  <tr
                    key={ticket._id}
                    className={`hover:bg-zinc-50/60 transition-colors text-xs ${
                      isSelected ? 'bg-zinc-50/80' : ''
                    }`}
                  >
                    <AdminTableCell align="center" className="w-[40px]">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(ticket._id)}
                        disabled={isPending}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer h-3.5 w-3.5 transition-all"
                      />
                    </AdminTableCell>

                    <AdminTableCell className="w-[130px]">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="inline-flex items-center rounded px-1.5 py-0.2 text-[9.5px] font-semibold text-zinc-600 bg-zinc-100 border border-zinc-200 uppercase">
                          {ticket.tipoComprobante || 'BOL'}
                        </span>
                        <span className="text-xs font-semibold text-zinc-900 tracking-tight">
                          {ticket.numeroNota}
                        </span>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="w-[180px]">
                      <button
                        type="button"
                        onClick={() => openProfessionalPdf(ticket._id)}
                        disabled={isPending}
                        className="group flex items-center gap-1.5 w-full max-w-[170px] cursor-pointer hover:border-blue-200 transition-colors text-left focus:outline-none"
                        title={ticket.originalFilename}
                      >
                        <div className="bg-white p-1 rounded-md border border-zinc-200/80 group-hover:border-blue-200 shrink-0 shadow-2xs">
                          <FileText className="w-3 h-3 text-zinc-400 group-hover:text-blue-600" />
                        </div>
                        <span className="text-[11.5px] font-medium text-zinc-600 group-hover:text-blue-700 truncate flex-1">
                          {ticket.originalFilename || 'Sin archivo'}
                        </span>
                        <Eye className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition-opacity shrink-0" />
                      </button>
                    </AdminTableCell>

                    <AdminTableCell className="w-[120px]">
                      <div className="flex flex-col gap-0.5 whitespace-nowrap text-[11.5px]">
                        <span className="font-medium text-zinc-800">{ticket.fecha || '-'}</span>
                        {ticket.hora && (
                          <span className="text-[10px] text-zinc-400">{ticket.hora}</span>
                        )}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="w-[180px]">
                      <div className="flex flex-col gap-0.5 max-w-[170px]">
                        <span className="text-[11.5px] font-medium text-zinc-900 truncate" title={ticket.cliente}>
                          {ticket.cliente || 'Sin cliente'}
                        </span>
                        {ticket.documentoCliente && (
                          <span className="text-[10px] text-zinc-400 truncate">
                            Doc: {ticket.documentoCliente}
                          </span>
                        )}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="w-[180px]">
                      <div className="flex items-center gap-1.5 max-w-[170px]">
                        <Package className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        {ticket.items && ticket.items.length > 0 ? (
                          <>
                            <span className="text-[11.5px] text-zinc-600 truncate" title={ticket.items[0].descripcion}>
                              {ticket.items[0].descripcion}
                            </span>
                            {ticket.items.length > 1 && (
                              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-semibold shrink-0">
                                +{ticket.items.length - 1}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">Sin items</span>
                        )}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell align="right" bold className="text-zinc-950 font-semibold text-xs whitespace-nowrap w-[100px]">
                      S/ {Number(ticket.monto || 0).toFixed(2)}
                    </AdminTableCell>

                    <AdminTableCell align="right" className="w-[110px]">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ticket)}
                          disabled={isPending}
                          className="h-6 w-6 flex items-center justify-center rounded-md text-zinc-500 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200/60 transition-all cursor-pointer"
                          title="Editar comprobante"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openTicketPdf(ticket._id)}
                          disabled={isPending}
                          className="h-6 w-6 flex items-center justify-center rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                          title="Imprimir Ticket"
                        >
                          <Printer className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openProfessionalPdf(ticket._id)}
                          disabled={isPending}
                          className="h-6 w-6 flex items-center justify-center rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200/60 transition-all cursor-pointer"
                          title="Factura QR"
                        >
                          <QrCode className="w-3 h-3" />
                        </button>

                        <div className="ml-0.5 pl-0.5 border-l border-zinc-200">
                          <AdminTableActions
                            actions={[
                              {
                                label: 'Editar Comprobante',
                                onClick: () => handleOpenEdit(ticket),
                              },
                              {
                                label: 'Ver Formato Ticket',
                                onClick: () => openTicketPdf(ticket._id),
                              },
                              {
                                label: 'Ver Formato Factura (QR)',
                                onClick: () => openProfessionalPdf(ticket._id),
                              },
                              {
                                label: isPending ? 'Eliminando...' : 'Eliminar Registro',
                                variant: 'destructive',
                                onClick: () => handleDelete(ticket._id),
                              },
                            ]}
                          />
                        </div>
                      </div>
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
          pageSize={currentFilters.limit}
          totalItems={pagination.total}
          selectedCount={selectedIds.length}
          onPageChange={(p) => updateUrlParams({ page: p })}
          onPageSizeChange={(s) => updateUrlParams({ limit: s, page: 1 })}
        />
      </AdminCardWrapper>

      <TicketDigitalizerDrawer
        isOpen={isDigitalizerOpen}
        onClose={handleCloseDrawer}
        initialData={editingTicket}
      />
    </AdminPageContainer>
  );
}