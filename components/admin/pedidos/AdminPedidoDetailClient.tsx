'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { IPedido, EstadoPedido } from '@/src/modules/checkout/types/pedido.types';
import { updateAdminPedidoStatusAction } from '@/src/modules/checkout/actions/admin-pedidos.actions';

// Componentes Reutilizables de Layout
import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminPageHeader } from '@/src/components/admin/layout/admin-page-header';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { AdminSelect } from '@/src/components/admin/layout/admin-form-group';
import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';

import { User, MapPin, CreditCard, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPedidoDetailClientProps {
  initialPedido: IPedido;
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

export default function AdminPedidoDetailClient({ initialPedido }: AdminPedidoDetailClientProps) {
  const [pedido, setPedido] = useState<IPedido>(initialPedido);
  const [selectedStatus, setSelectedStatus] = useState<EstadoPedido>(
    initialPedido?.status || ('awaiting_payment' as EstadoPedido)
  );
  const [isPending, startTransition] = useTransition();

  if (!pedido || !pedido.status) {
    return (
      <AdminPageContainer maxWidth="default">
        <AdminCardWrapper padding="default">
          <div className="p-8 text-center text-xs text-zinc-500">
            No se pudo cargar la información del pedido.
          </div>
        </AdminCardWrapper>
      </AdminPageContainer>
    );
  }

  const badgeInfo = STATUS_BADGE_MAP[pedido.status] || {
    status: 'pending',
    label: pedido.status,
  };

  const handleStatusChange = () => {
    startTransition(async () => {
      const res = await updateAdminPedidoStatusAction(pedido._id, selectedStatus);
      if (res.success && res.data) {
        setPedido(res.data);
        toast.success('Estado del pedido actualizado correctamente.');
      } else {
        toast.error(res.message || 'Error al cambiar el estado del pedido.');
      }
    });
  };

  return (
    <AdminPageContainer maxWidth="default" spacing="default">
      {/* CABECERA */}
      <AdminPageHeader
        title={`Pedido #${pedido.orderNumber}`}
        description={`Creado el ${new Date(pedido.createdAt).toLocaleString('es-PE', {
          dateStyle: 'long',
          timeStyle: 'short',
        })}`}
        actions={
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-zinc-200/80 shadow-sm">
            <span className="text-xs font-medium text-zinc-500 pl-2 hidden sm:inline">
              Estado:
            </span>
            <AdminSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as EstadoPedido)}
              className="w-40 text-xs h-8"
            >
              <option value="awaiting_payment">Esperando Pago</option>
              <option value="processing">En Proceso</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="canceled">Cancelado</option>
            </AdminSelect>

            <button
              onClick={handleStatusChange}
              disabled={isPending || selectedStatus === pedido.status}
              className="h-8 px-3 bg-zinc-900 text-white hover:bg-black rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Guardar</span>
            </button>
          </div>
        }
      />

      {/* CONTENIDO DENTRO DE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCardWrapper
            padding="lg"
            title={`Productos (${pedido.items?.length || 0})`}
            description="Ítems comprados en la transacción."
            action={
              <StatusBadge status={badgeInfo.status} label={badgeInfo.label} size="sm" />
            }
          >
            <div className="divide-y divide-zinc-100">
              {pedido.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-zinc-50 rounded-lg border border-zinc-200/80 overflow-hidden flex-shrink-0">
                      {item.imagen && (
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{item.nombre}</p>
                      <p className="text-[11px] text-zinc-400">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900">S/ {pedido.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18%)</span>
                <span className="font-medium text-zinc-900">S/ {pedido.igv?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de Envío</span>
                <span className="font-medium text-zinc-900">
                  {pedido.shippingCost === 0 ? 'Gratis' : `S/ ${pedido.shippingCost?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-900 pt-2 border-t border-zinc-100">
                <span>Total Final</span>
                <span>S/ {pedido.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </AdminCardWrapper>
        </div>

        {/* TARJETAS DERECHAS */}
        <div className="space-y-6">
          <AdminCardWrapper padding="default">
            <div className="flex items-center gap-2 mb-3 text-zinc-900">
              <User className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Cliente</h3>
            </div>
            <div className="text-xs text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-900">
                {pedido.customerProfile?.nombre} {pedido.customerProfile?.apellidos}
              </p>
              <p>
                <span className="text-zinc-400">Doc:</span>{' '}
                {pedido.customerProfile?.tipoDocumento} - {pedido.customerProfile?.numeroDocumento}
              </p>
              <p>
                <span className="text-zinc-400">Email:</span> {pedido.customerProfile?.email}
              </p>
              <p>
                <span className="text-zinc-400">Teléfono:</span> {pedido.customerProfile?.telefono}
              </p>
            </div>
          </AdminCardWrapper>

          <AdminCardWrapper padding="default">
            <div className="flex items-center gap-2 mb-3 text-zinc-900">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Entrega</h3>
            </div>
            <div className="text-xs text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-900 capitalize">
                {pedido.deliveryMethod === 'shipping' ? 'Envío a Domicilio' : 'Recojo en Tienda'}
              </p>
              <p>{pedido.shippingAddress?.direccion}</p>
              <p className="text-zinc-500">
                {pedido.shippingAddress?.distrito}, {pedido.shippingAddress?.provincia} -{' '}
                {pedido.shippingAddress?.departamento}
              </p>
            </div>
          </AdminCardWrapper>

          <AdminCardWrapper padding="default">
            <div className="flex items-center gap-2 mb-3 text-zinc-900">
              <CreditCard className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Pago</h3>
            </div>
            <div className="text-xs text-zinc-600 space-y-1.5">
              <p>
                <span className="text-zinc-400">Proveedor:</span>{' '}
                <strong className="text-zinc-900 uppercase">{pedido.payment?.provider}</strong>
              </p>
              <p>
                <span className="text-zinc-400">Estado de Pago:</span>{' '}
                <strong className="text-zinc-900 capitalize">{pedido.payment?.status}</strong>
              </p>
              {pedido.payment?.transactionId && (
                <p className="break-all">
                  <span className="text-zinc-400">ID Transacción:</span>{' '}
                  <span className="font-mono text-[11px] text-zinc-800">
                    {pedido.payment.transactionId}
                  </span>
                </p>
              )}
            </div>
          </AdminCardWrapper>
        </div>
      </div>
    </AdminPageContainer>
  );
}