// File: frontend/components/admin/pedidos/AdminChangeStatusModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { EstadoPedido, IPedido } from '@/src/modules/checkout/types/pedido.types';
import { updateAdminPedidoStatusAction } from '@/src/modules/checkout/actions/admin-pedidos.actions';
import { AdminStatusBadge } from '@/src/components/admin/layout/admin-status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight, Mail, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  pedido: IPedido;
  onStatusUpdated: (updatedPedido: IPedido) => void;
}

const STATUS_DESCRIPTIONS: Record<EstadoPedido, string> = {
  awaiting_payment: 'El cliente aún no completa la transacción en la pasarela.',
  processing: 'Pago recibido. La orden está lista para embalaje y preparación.',
  shipped: 'El paquete se encuentra en tránsito con el courier seleccionado.',
  delivered: 'La orden fue entregada conforme al cliente final.',
  canceled: 'La orden se cancela y se repone automáticamente el inventario.',
  paid_but_out_of_stock: 'Cobro completado pero requiere verificación manual de stock.',
};

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  awaiting_payment: ['processing', 'canceled'],
  processing: ['shipped', 'delivered', 'paid_but_out_of_stock', 'canceled'],
  paid_but_out_of_stock: ['processing', 'canceled'],
  shipped: ['delivered', 'canceled'],
  delivered: [],
  canceled: [],
};

export default function AdminChangeStatusModal({ pedido, onStatusUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EstadoPedido>(pedido.status);
  const [isPending, startTransition] = useTransition();

  const isChangingToCanceled = selectedStatus === 'canceled' && pedido.status !== 'canceled';
  const isChangingToProcessingManual = selectedStatus === 'processing' && pedido.status === 'awaiting_payment';
  const hasChanges = selectedStatus !== pedido.status;
  const isTerminal = pedido.status === 'delivered' || pedido.status === 'canceled';

  const allowedNextStates = TRANSICIONES_VALIDAS[pedido.status] || [];

  const handleConfirm = () => {
    if (!hasChanges) return;

    startTransition(async () => {
      const res = await updateAdminPedidoStatusAction(pedido._id, selectedStatus);

      if (res.success && res.data) {
        onStatusUpdated(res.data);
        toast.success('Estado del pedido actualizado correctamente.');
        setOpen(false);
      } else {
        toast.error(res.message || 'Error al actualizar el estado del pedido.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold shadow-2xs">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Gestionar Estado</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-zinc-900">
            Actualizar Estado
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Cambia la etapa operativa de la orden <span className=" font-semibold text-zinc-800">#{pedido.orderNumber}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          {/* Comparador Visual de Estados */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Actual
              </span>
              <AdminStatusBadge status={pedido.status} />
            </div>

            <ArrowRight className="h-4 w-4 text-zinc-400 shrink-0 mx-2" />

            <div className="space-y-1 text-right">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Siguiente
              </span>
              <AdminStatusBadge status={selectedStatus} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">
              Selecciona el nuevo estado:
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => setSelectedStatus(val as EstadoPedido)}
              disabled={isTerminal || isPending}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="awaiting_payment"
                  disabled={!allowedNextStates.includes('awaiting_payment') && pedido.status !== 'awaiting_payment'}
                >
                  Esperando Pago
                </SelectItem>
                <SelectItem
                  value="processing"
                  disabled={!allowedNextStates.includes('processing') && pedido.status !== 'processing'}
                >
                  En Preparación
                </SelectItem>
                <SelectItem
                  value="shipped"
                  disabled={!allowedNextStates.includes('shipped') && pedido.status !== 'shipped'}
                >
                  Enviado
                </SelectItem>
                <SelectItem
                  value="delivered"
                  disabled={!allowedNextStates.includes('delivered') && pedido.status !== 'delivered'}
                >
                  Entregado
                </SelectItem>
                <SelectItem
                  value="paid_but_out_of_stock"
                  disabled={!allowedNextStates.includes('paid_but_out_of_stock') && pedido.status !== 'paid_but_out_of_stock'}
                >
                  Sin Stock
                </SelectItem>
                <SelectItem
                  value="canceled"
                  disabled={!allowedNextStates.includes('canceled') && pedido.status !== 'canceled'}
                >
                  Cancelado
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-zinc-500 pt-0.5">
              {STATUS_DESCRIPTIONS[selectedStatus]}
            </p>
          </div>

          {isChangingToProcessingManual && (
            <Alert className="py-2.5 bg-amber-50/60 border-amber-200 text-amber-800">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-xs font-bold">Confirmación Manual de Pago</AlertTitle>
              <AlertDescription className="text-[11px] leading-relaxed">
                Verifica que el abono se encuentre acreditado en tu cuenta bancaria antes de confirmar.
              </AlertDescription>
            </Alert>
          )}

          {hasChanges && selectedStatus !== 'awaiting_payment' && !isChangingToProcessingManual && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 flex gap-2.5 items-start">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Se enviará una notificación por correo a <strong>{pedido.customerProfile.email}</strong>.
              </p>
            </div>
          )}

          {isChangingToCanceled && (
            <Alert variant="destructive" className="py-2.5">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold">Reposición de Inventario</AlertTitle>
              <AlertDescription className="text-[11px] leading-relaxed">
                Las unidades reservadas retornarán de inmediato al stock disponible de la tienda.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              setSelectedStatus(pedido.status);
            }}
            disabled={isPending}
            className="text-xs"
          >
            Cerrar
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isPending || !hasChanges}
            className="text-xs font-semibold bg-zinc-900 hover:bg-black gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirmar Cambio</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}