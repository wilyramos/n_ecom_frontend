// frontend/src/modules/tickets/components/TicketDigitalizerDrawer.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Upload, Printer, Loader2, Save, Plus, Trash2, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { createTicketAction, updateTicketAction } from '../admin-tickets.actions';
import { ITicket } from '../ticket.types';
import { AdminButton } from '@/src/components/admin/layout/admin-button';
import { AdminFormGroup, AdminInput } from '@/src/components/admin/layout/admin-form-group';
import { AdminFilterDrawer } from '@/src/components/admin/layout/admin-filter-drawer';

interface ITicketItemForm {
  descripcion: string;
  unidadMedida: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

interface TicketDigitalizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ITicket | null;
}

const FIXED_COMPANY_DATA = {
  empresa: 'NEOSHOP IMPORTACIONES',
  rucEmpresa: '20613242784',
  telefonoEmpresa: '902900653',
  direccionEmpresa: 'PUEBLO LIBRE',
};

const defaultValues = {
  tipoComprobante: 'BOLETA ELECTRÓNICA',
  numeroNota: '',
  ...FIXED_COMPANY_DATA,
  cliente: '',
  documentoCliente: '',
  telefonoCliente: '',
  direccionCliente: '',
  fecha: '',
  hora: '',
  cajero: '',
  caja: '',
  items: [] as ITicketItemForm[],
  subtotal: 0,
  igv: 0,
  monto: 0,
  filename: '',
};

export function TicketDigitalizerDrawer({ isOpen, onClose, initialData }: TicketDigitalizerDrawerProps) {
  const [formData, setFormData] = useState(defaultValues);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(initialData?._id);

  useEffect(() => {
    if (initialData && isOpen) {
      const items = Array.isArray(initialData.items)
        ? initialData.items.map((i) => ({
            descripcion: i.descripcion || '',
            unidadMedida: i.unidadMedida || 'NIU',
            cantidad: Number(i.cantidad) || 1,
            precioUnitario: Number(i.precioUnitario) || 0,
            total: Number(i.total) || Number(((Number(i.cantidad) || 1) * (Number(i.precioUnitario) || 0)).toFixed(2)),
          }))
        : [];

      const totalMonto = Number(initialData.monto || 0);
      const subtotal = Number((totalMonto / 1.18).toFixed(2));
      const igv = Number((totalMonto - subtotal).toFixed(2));

      setFormData({
        tipoComprobante: initialData.tipoComprobante || 'BOLETA ELECTRÓNICA',
        numeroNota: initialData.numeroNota || '',
        ...FIXED_COMPANY_DATA,
        cliente: initialData.cliente || '',
        documentoCliente: initialData.documentoCliente || '',
        telefonoCliente: initialData.telefonoCliente || '',
        direccionCliente: initialData.direccionCliente || '',
        fecha: initialData.fecha || '',
        hora: initialData.hora || '',
        cajero: initialData.cajero || '',
        caja: initialData.caja || '',
        items,
        subtotal,
        igv,
        monto: totalMonto,
        filename: '',
      });
    } else if (!isOpen) {
      setFormData(defaultValues);
    }
  }, [initialData, isOpen]);

  const recalculateTotals = (items: ITicketItemForm[]) => {
    const sumTotal = items.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const monto = Number(sumTotal.toFixed(2));
    const subtotal = Number((monto / 1.18).toFixed(2));
    const igv = Number((monto - subtotal).toFixed(2));

    return { monto, subtotal, igv };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExtracting(true);
      const data = new FormData();
      data.append('ticket', file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${API_URL}/tickets/upload-extract`, {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Error al procesar el archivo PDF');
      }

      const extractedItems = Array.isArray(json.data.extracted?.items) ? json.data.extracted.items : [];
      const totals = recalculateTotals(extractedItems);

      setFormData({
        ...defaultValues,
        ...json.data.extracted,
        ...FIXED_COMPANY_DATA,
        ...totals,
        filename: json.data.filename,
      });
      toast.success('Documento analizado e items extraídos con éxito');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Fallo en la extracción del PDF');
      } else {
        toast.error('Fallo en la extracción del PDF');
      }
    } finally {
      setIsExtracting(false);
      e.target.value = '';
    }
  };

  const handleItemChange = (index: number, field: keyof ITicketItemForm, value: string | number) => {
    const updatedItems = [...formData.items];
    const currentItem = { ...updatedItems[index], [field]: value };

    if (field === 'cantidad' || field === 'precioUnitario') {
      const cant = field === 'cantidad' ? Number(value) : currentItem.cantidad;
      const prec = field === 'precioUnitario' ? Number(value) : currentItem.precioUnitario;
      currentItem.total = Number((cant * prec).toFixed(2));
    }

    updatedItems[index] = currentItem;
    const totals = recalculateTotals(updatedItems);

    setFormData({
      ...formData,
      items: updatedItems,
      ...totals,
    });
  };

  const handleAddItem = () => {
    const updatedItems = [
      ...formData.items,
      { descripcion: '', unidadMedida: 'NIU', cantidad: 1, precioUnitario: 0, total: 0 },
    ];
    const totals = recalculateTotals(updatedItems);
    setFormData({
      ...formData,
      items: updatedItems,
      ...totals,
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, idx) => idx !== index);
    const totals = recalculateTotals(updatedItems);
    setFormData({
      ...formData,
      items: updatedItems,
      ...totals,
    });
  };

  const handlePreviewBackendPdf = async (format: 'ticket' | 'professional') => {
    try {
      setIsPreviewing(true);
      const res = await fetch('/api/tickets/preview-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, format }),
      });

      if (!res.ok) throw new Error('Error al generar previsualización del PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'width=800,height=900');
    } catch {
      toast.error('No se pudo generar la vista previa del PDF.');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numeroNota.trim() || !formData.cliente.trim()) {
      toast.error('El número de comprobante y el cliente son requeridos');
      return;
    }

    startTransition(async () => {
      const res = isEditing && initialData?._id
        ? await updateTicketAction(initialData._id, formData)
        : await createTicketAction(formData);

      if (res.success) {
        toast.success(isEditing ? 'Comprobante actualizado correctamente.' : 'Comprobante guardado exitosamente.');
        setFormData(defaultValues);
        onClose();
      } else {
        toast.error(res.message || 'Error al procesar el comprobante');
      }
    });
  };

  const handleReset = () => {
    setFormData(defaultValues);
  };

  return (
    <AdminFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Comprobante: ${initialData?.numeroNota}` : 'Digitalizador Inteligente de Comprobantes'}
      description={isEditing ? 'Modifica los campos del comprobante y sus productos.' : 'Sube un comprobante para extraer los datos e items en formato A4.'}
      onReset={handleReset}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEditing && (
          <div className="border-2 border-dashed border-zinc-200 rounded-xl p-4 text-center hover:bg-zinc-50 transition-colors">
            <input
              type="file"
              id="ticket-upload"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={isExtracting}
              className="hidden"
            />
            <label htmlFor="ticket-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
              {isExtracting ? (
                <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-zinc-500" />
              )}
              <span className="text-xs font-semibold text-zinc-800">
                {isExtracting ? 'Analizando documento...' : 'Subir Comprobante en PDF'}
              </span>
              <span className="text-[10px] text-zinc-400">Lectura de boletas y notas de venta</span>
            </label>
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <AdminFormGroup label="Tipo Comprobante">
              <AdminInput
                value={formData.tipoComprobante}
                onChange={(e) => setFormData({ ...formData, tipoComprobante: e.target.value })}
                required
              />
            </AdminFormGroup>
            <AdminFormGroup label="N° Comprobante">
              <AdminInput
                value={formData.numeroNota}
                onChange={(e) => setFormData({ ...formData, numeroNota: e.target.value })}
                placeholder="B001-00164 / NV01-00001"
                required
              />
            </AdminFormGroup>
          </div>

          {/* Datos Empresa Emisora */}
          <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Datos Empresa (Emisor)</p>
            <div className="grid grid-cols-2 gap-2">
              <AdminFormGroup label="Razón Social">
                <AdminInput
                  value={formData.empresa}
                  readOnly
                  className="bg-zinc-100/70 font-semibold cursor-not-allowed"
                />
              </AdminFormGroup>
              <AdminFormGroup label="RUC">
                <AdminInput
                  value={formData.rucEmpresa}
                  readOnly
                  className="bg-zinc-100/70 font-semibold cursor-not-allowed"
                />
              </AdminFormGroup>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <AdminFormGroup label="Teléfono">
                <AdminInput
                  value={formData.telefonoEmpresa}
                  readOnly
                  className="bg-zinc-100/70 cursor-not-allowed"
                />
              </AdminFormGroup>
              <AdminFormGroup label="Dirección">
                <AdminInput
                  value={formData.direccionEmpresa}
                  readOnly
                  className="bg-zinc-100/70 cursor-not-allowed"
                />
              </AdminFormGroup>
            </div>
          </div>

          {/* Datos Cliente */}
          <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Datos Cliente</p>
            <div className="grid grid-cols-2 gap-2">
              <AdminFormGroup label="Cliente">
                <AdminInput
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  required
                />
              </AdminFormGroup>
              <AdminFormGroup label="DNI / RUC">
                <AdminInput
                  value={formData.documentoCliente}
                  onChange={(e) => setFormData({ ...formData, documentoCliente: e.target.value })}
                />
              </AdminFormGroup>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <AdminFormGroup label="Teléfono">
                <AdminInput
                  value={formData.telefonoCliente}
                  onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                />
              </AdminFormGroup>
              <AdminFormGroup label="Dirección">
                <AdminInput
                  value={formData.direccionCliente}
                  onChange={(e) => setFormData({ ...formData, direccionCliente: e.target.value })}
                />
              </AdminFormGroup>
            </div>
          </div>

          {/* Datos Emisión */}
          <div className="grid grid-cols-2 gap-2">
            <AdminFormGroup label="Fecha">
              <AdminInput
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              />
            </AdminFormGroup>
            <AdminFormGroup label="Hora">
              <AdminInput
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              />
            </AdminFormGroup>
            <AdminFormGroup label="Cajero(a)">
              <AdminInput
                value={formData.cajero}
                onChange={(e) => setFormData({ ...formData, cajero: e.target.value })}
              />
            </AdminFormGroup>
            <AdminFormGroup label="Caja">
              <AdminInput
                value={formData.caja}
                onChange={(e) => setFormData({ ...formData, caja: e.target.value })}
              />
            </AdminFormGroup>
          </div>

          {/* Detalle Items */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-800">Detalle de Productos / Servicios</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-900 font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Agregar Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <div className="text-center py-4 border border-dashed rounded-lg text-xs text-zinc-400">
                No hay productos en la lista. Añade uno con el botón superior.
              </div>
            ) : (
              formData.items.map((item, idx) => (
                <div key={idx} className="p-2 border border-zinc-200/80 rounded-lg bg-zinc-50/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Descripción o nombre del producto"
                      value={item.descripcion}
                      onChange={(e) => handleItemChange(idx, 'descripcion', e.target.value)}
                      className="w-full text-xs p-1.5 border border-zinc-200 rounded bg-white font-medium outline-none focus:border-zinc-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">U.M</span>
                      <input
                        type="text"
                        value={item.unidadMedida}
                        onChange={(e) => handleItemChange(idx, 'unidadMedida', e.target.value)}
                        className="w-full text-xs p-1 border border-zinc-200 rounded bg-white text-center outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Cant.</span>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(idx, 'cantidad', Number(e.target.value))}
                        className="w-full text-xs p-1 border border-zinc-200 rounded bg-white text-center outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">P. Unit</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.precioUnitario}
                        onChange={(e) => handleItemChange(idx, 'precioUnitario', Number(e.target.value))}
                        className="w-full text-xs p-1 border border-zinc-200 rounded bg-white text-right outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Total</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.total}
                        readOnly
                        className="w-full text-xs p-1 border border-zinc-200 rounded bg-zinc-100 text-right font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-zinc-100/70 p-3 rounded-lg space-y-1.5 border border-zinc-200/60">
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Op. Gravada / Subtotal:</span>
              <span>S/ {Number(formData.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <span>IGV (18%):</span>
              <span>S/ {Number(formData.igv).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-zinc-900 border-t border-zinc-200 pt-1.5">
              <span>Importe Total:</span>
              <span>S/ {Number(formData.monto).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => handlePreviewBackendPdf('ticket')}
              disabled={!formData.numeroNota || isPreviewing}
              className="w-full h-8 text-xs font-semibold"
            >
              Previa Ticket
            </AdminButton>

            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={QrCode}
              onClick={() => handlePreviewBackendPdf('professional')}
              disabled={!formData.numeroNota || isPreviewing}
              className="w-full h-8 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Previa Factura/QR
            </AdminButton>
          </div>

          <AdminButton
            type="submit"
            variant="primary"
            size="sm"
            icon={isPending ? Loader2 : Save}
            disabled={isPending || !formData.numeroNota}
            className="w-full h-8 text-xs font-semibold"
          >
            {isPending ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Convertir y Guardar'}
          </AdminButton>
        </div>
      </form>
    </AdminFilterDrawer>
  );
}