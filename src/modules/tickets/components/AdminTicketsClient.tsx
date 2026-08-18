// frontend/src/components/admin/tickets/AdminTicketsClient.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ITicket, ITicketsPagination } from '@/src/modules/tickets/ticket.types';
import { deleteTicketAction } from '@/src/modules/tickets/admin-tickets.actions';
import { TicketDigitalizerDrawer } from '@/src/modules/tickets/components/TicketDigitalizerDrawer';

import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminPageHeader } from '@/src/components/admin/layout/admin-page-header';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { AdminFilterBar } from '@/src/components/admin/layout/admin-filter-bar';
import { AdminTablePagination } from '@/src/components/admin/layout/admin-table-pagination';
import { AdminTableActions } from '@/src/components/admin/layout/admin-table-actions';
import { AdminButton } from '@/src/components/admin/layout/admin-button';
import {
  AdminTable,
  AdminTableHead,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from '@/src/components/admin/layout/admin-table';

import {
  FileUp,
  Printer, Download,
  Loader2,
  CheckSquare,
  QrCode,
  Pencil
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

  const [isDigitalizerOpen, setIsDigitalizerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(currentFilters.search || '');
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
      a.download = `comprobantes.zip`;
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

  const applyFilters = (overrides: Record<string, string | number | null> = {}) => {
    const params = new URLSearchParams();
    const finalSearch = overrides.search !== undefined ? overrides.search : searchValue;
    const rawPage = overrides.page !== undefined ? overrides.page : currentFilters.page;
    const finalPage = typeof rawPage === 'number' ? rawPage : Number(rawPage) || 1;
    const rawLimit = overrides.limit !== undefined ? overrides.limit : currentFilters.limit;
    const finalLimit = typeof rawLimit === 'number' ? rawLimit : Number(rawLimit) || 10;

    if (finalSearch) params.set('search', String(finalSearch));
    if (finalPage > 1) params.set('page', String(finalPage));
    if (finalLimit !== 10) params.set('limit', String(finalLimit));

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteTicketAction(id);
      if (res.success) {
        toast.success(res.message || 'Registro eliminado correctamente.');
        setSelectedIds(selectedIds.filter((item) => item !== id));
      } else {
        toast.error(res.message || 'Error al eliminar.');
      }
    });
  };


  return (
    <AdminPageContainer maxWidth="default" spacing="default">
      <AdminPageHeader
        title="Comprobantes y Notas de Venta"
        actions={
          <AdminButton
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            Digitalizar Comprobante
          </AdminButton>
        }
      />
      {selectedIds.length > 0 && (
        <div className="bg-zinc-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">
              {selectedIds.length} seleccionado{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkPrint('ticket')}
              disabled={isBulkProcessing || isPending}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir Ticket
            </button>
            <button
              type="button"
              onClick={() => handleBulkPrint('professional')}
              disabled={isBulkProcessing || isPending}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" /> Imprimir Factura / QR
            </button>
            <button
              type="button"
              onClick={() => handleBulkZipDownload('professional')}
              disabled={isBulkProcessing || isPending}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {isBulkProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              ZIP (QR)
            </button>
          </div>
        </div>
      )}

      <AdminFilterBar
        searchPlaceholder="Buscar por cliente o N° comprobante..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          applyFilters({ search: val, page: 1 });
        }}
        onRefresh={() => router.refresh()}
        onReset={() => {
          setSearchValue('');
          setSelectedIds([]);
          router.push(pathname);
        }}
      />

      <AdminCardWrapper padding="none">
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell width="40px">
                <input
                  type="checkbox"
                  checked={initialData.length > 0 && selectedIds.length === initialData.length}
                  onChange={handleSelectAll}
                  disabled={isPending}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                />
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>N° Comprobante</AdminTableHeaderCell>
              <AdminTableHeaderCell>Fecha / Hora</AdminTableHeaderCell>
              <AdminTableHeaderCell>Cliente</AdminTableHeaderCell>
              <AdminTableHeaderCell>Productos / Items</AdminTableHeaderCell>
              <AdminTableHeaderCell>Total</AdminTableHeaderCell>
              <AdminTableHeaderCell align="right">Acciones</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {initialData.length === 0 ? (
              <AdminTableEmpty
                title="No se encontraron comprobantes"
                description="Sube un archivo PDF para digitalizar notas de venta o boletas."
                colSpan={7}
              />
            ) : (
              initialData.map((ticket) => {
                const isSelected = selectedIds.includes(ticket._id);
                return (
                  <AdminTableRow key={ticket._id} id={ticket._id} selected={isSelected}>
                    <AdminTableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(ticket._id)}
                        disabled={isPending}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                      />
                    </AdminTableCell>
                    <AdminTableCell bold>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                          {ticket.tipoComprobante || 'COMPROBANTE'}
                        </span>
                        <span className="text-zinc-900">{ticket.numeroNota}</span>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <div className="flex flex-col text-[11px] text-zinc-500">
                        <span>{ticket.fecha || '-'}</span>
                        <span className="text-[10px] text-zinc-400">{ticket.hora || ''}</span>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <p className="font-semibold text-zinc-900">{ticket.cliente}</p>
                      <p className="text-[11px] text-zinc-400">
                        {ticket.documentoCliente ? `Doc: ${ticket.documentoCliente}` : 'Sin documento'}
                      </p>
                    </AdminTableCell>

                    <AdminTableCell>
                      <div className="max-w-[260px] space-y-0.5">
                        {ticket.items && ticket.items.length > 0 ? (
                          <>
                            <p className="text-xs text-zinc-800 font-medium truncate">
                              {ticket.items[0].descripcion}
                            </p>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {ticket.items[0].cantidad} {ticket.items[0].unidadMedida || 'NIU'}
                              {ticket.items.length > 1 && ` (+${ticket.items.length - 1} items más)`}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-zinc-400">Sin items</span>
                        )}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell bold>
                      <span className="text-zinc-900 font-bold">
                        S/ {Number(ticket.monto || 0).toFixed(2)}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón Editar */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ticket)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60 rounded-md text-xs font-medium transition-colors cursor-pointer"
                          title="Editar comprobante"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>

                        {/* Opción 1: Ticket */}
                        <button
                          type="button"
                          onClick={() => openTicketPdf(ticket._id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md text-xs font-medium transition-colors cursor-pointer"
                          title="Imprimir formato Ticket A4"
                        >
                          <Printer className="w-3 h-3" />
                        </button>

                        {/* Opción 2: Formato Profesional con QR */}
                        <button
                          type="button"
                          onClick={() => openProfessionalPdf(ticket._id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
                          title="Imprimir formato Factura / QR"
                        >
                          <QrCode className="w-3 h-3" />
                        </button>

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

      <TicketDigitalizerDrawer
        isOpen={isDigitalizerOpen}
        onClose={handleCloseDrawer}
        initialData={editingTicket}
      />
    </AdminPageContainer>
  );
}