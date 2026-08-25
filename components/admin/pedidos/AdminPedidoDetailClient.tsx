// File: frontend/components/admin/pedidos/AdminPedidoDetailClient.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IPedido, EstadoPedido, EstadoPago } from '@/src/modules/checkout/types/pedido.types';
import { formatDate } from '@/lib/utils';

// Componentes de Layout
import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminPageHeader } from '@/src/components/admin/layout/admin-page-header';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';
import AdminChangeStatusModal from './AdminChangeStatusModal';

import {
  User,
  MapPin,
  CreditCard,
  ArrowLeft,
  Store,
  Truck,
  FileText,
  Zap,
  ReceiptText,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

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

  if (!pedido || !pedido.status) {
    return (
      <AdminPageContainer maxWidth="default" padding="default" spacing="default">
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

  const isApproved = pedido.payment?.status === ('approved' as EstadoPago);
  const isPendingPay = pedido.payment?.status === ('pending' as EstadoPago);
  const isRejectedPay = pedido.payment?.status === ('rejected' as EstadoPago);

  const provider = pedido.payment?.provider?.toLowerCase() || '';
  const isPowerpay = provider === 'powerpay';
  const isCulqi = provider === 'culqi';
  const isMercadoPago = provider === 'mercadopago';

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="default">
      {/* Botón Volver */}
      <div className="mb-1">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al listado de pedidos</span>
        </Link>
      </div>

      {/* Cabecera con Modal de Estado */}
      <AdminPageHeader
        title={`Pedido #${pedido.orderNumber}`}
        description={`Emitido el ${formatDate(pedido.createdAt)}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={badgeInfo.status} label={badgeInfo.label} size="default" />
            <AdminChangeStatusModal pedido={pedido} onStatusUpdated={setPedido} />
          </div>
        }
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Artículos y Totales */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCardWrapper
            padding="lg"
            title={`Productos Solicitados (${pedido.items?.reduce((acc, it) => acc + it.quantity, 0) || 0})`}
            description="Detalle de ítems, variantes y cantidades reservadas."
          >
            <div className="divide-y divide-zinc-100">
              {pedido.items?.map((item, idx) => {
                const attrs = item.variantAttributes
                  ? Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(' | ')
                  : null;

                return (
                  <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 bg-zinc-50 rounded-xl border border-zinc-200/80 overflow-hidden shrink-0">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.nombre}
                            fill
                            className="object-contain p-1.5"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px]">
                            Sin foto
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {item.nombre}
                        </p>
                        {attrs && (
                          <p className="text-[11px] text-zinc-500 font-medium truncate">
                            {attrs}
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-400">
                          {item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'} × S/ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 tabular-nums shrink-0">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Desglose Económico */}
            <div className="pt-4 mt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal base</span>
                <span className="font-medium text-zinc-900 tabular-nums">S/ {pedido.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18% incluido)</span>
                <span className="font-medium text-zinc-900 tabular-nums">S/ {pedido.igv?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de Envío</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {pedido.shippingCost === 0 ? 'Gratis' : `S/ ${pedido.shippingCost?.toFixed(2)}`}
                </span>
              </div>
              {pedido.recargoFinanciero > 0 && (
                <div className="flex justify-between">
                  <span>Recargo pasarela</span>
                  <span className="font-medium text-zinc-900 tabular-nums">S/ {pedido.recargoFinanciero?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-zinc-900 pt-3 border-t border-zinc-100 items-baseline">
                <span>Total Cobrado</span>
                <span className="text-base tabular-nums">S/ {pedido.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </AdminCardWrapper>
        </div>

        {/* Columna Derecha: Tarjetas Laterales */}
        <div className="space-y-6">
          {/* Pasarela y Pago */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center justify-between mb-3 text-zinc-900">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Pasarela & Pago</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                isPendingPay ? 'bg-amber-50 text-amber-700 border-amber-200' :
                isRejectedPay ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}>
                {pedido.payment?.status?.toUpperCase()}
              </span>
            </div>

            <div className="text-xs space-y-2.5">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                {isPowerpay ? (
                  <>
                    <Zap className="w-4 h-4 text-zinc-900 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-900 text-xs">Powerpay</p>
                      <p className="text-[10px] text-zinc-500">Financiamiento BNPL (Cuotas)</p>
                    </div>
                  </>
                ) : isCulqi ? (
                  <>
                    <CreditCard className="w-4 h-4 text-zinc-900 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-900 text-xs">Culqi</p>
                      <p className="text-[10px] text-zinc-500">Tarjetas / Tokenización</p>
                    </div>
                  </>
                ) : isMercadoPago ? (
                  <>
                    <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-900 text-xs">Mercado Pago</p>
                      <p className="text-[10px] text-zinc-500">Checkout Pro / Saldo</p>
                    </div>
                  </>
                ) : (
                  <>
                    <ReceiptText className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-900 text-xs uppercase">{pedido.payment?.provider}</p>
                      <p className="text-[10px] text-zinc-500">Pago registrado</p>
                    </div>
                  </>
                )}
              </div>

              {pedido.payment?.transactionId && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-semibold">Transaction ID / Gateway ID</span>
                  <p className="font-mono text-[11px] text-zinc-800 break-all bg-zinc-50 p-1.5 rounded border border-zinc-100">
                    {pedido.payment.transactionId}
                  </p>
                </div>
              )}

              {pedido.payment?.paidAt && (
                <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1" suppressHydrationWarning>
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Pagado el {formatDate(pedido.payment.paidAt)}</span>
                </p>
              )}
            </div>
          </AdminCardWrapper>

          {/* Perfil del Cliente */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center gap-2 mb-3 text-zinc-900">
              <User className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Perfil del Cliente</h3>
            </div>
            <div className="text-xs text-zinc-600 space-y-2">
              <div>
                <p className="font-semibold text-zinc-900 text-sm">
                  {pedido.customerProfile?.nombre} {pedido.customerProfile?.apellidos}
                </p>
                <p className="text-[11px] text-zinc-500 font-medium">
                  {pedido.customerProfile?.tipoDocumento}: {pedido.customerProfile?.numeroDocumento}
                </p>
              </div>
              <div className="space-y-1 pt-1.5 border-t border-zinc-100 text-[11px]">
                <p className="flex items-center gap-1.5 text-zinc-700">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{pedido.customerProfile?.email}</span>
                </p>
                <p className="flex items-center gap-1.5 text-zinc-700">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{pedido.customerProfile?.telefono}</span>
                </p>
              </div>
            </div>
          </AdminCardWrapper>

          {/* Despacho / Entrega */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center gap-2 mb-3 text-zinc-900">
              {pedido.deliveryMethod === 'pickup' ? (
                <Store className="w-4 h-4 text-zinc-500" />
              ) : (
                <Truck className="w-4 h-4 text-zinc-500" />
              )}
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {pedido.deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Despacho a Domicilio'}
              </h3>
            </div>
            <div className="text-xs text-zinc-600 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-900">{pedido.shippingAddress?.direccion}</p>
                  <p className="text-zinc-500 text-[11px]">
                    {pedido.shippingAddress?.distrito}, {pedido.shippingAddress?.provincia} - {pedido.shippingAddress?.departamento}
                  </p>
                  {pedido.shippingAddress?.referencia && (
                    <p className="text-zinc-500 text-[11px] italic mt-0.5">
                      Ref: {pedido.shippingAddress.referencia}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AdminCardWrapper>

          {/* Facturación */}
          {pedido.invoiceInfo && (
            <AdminCardWrapper padding="default">
              <div className="flex items-center gap-2 mb-2 text-zinc-900">
                <FileText className="w-4 h-4 text-zinc-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Facturación</h3>
              </div>
              <div className="text-xs space-y-1 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 capitalize font-medium">{pedido.invoiceInfo.type}</span>
                  <span className="font-mono font-bold text-zinc-900">{pedido.invoiceInfo.documentNumber}</span>
                </div>
                {pedido.invoiceInfo.businessName && (
                  <p className="font-semibold text-zinc-900 text-[11px] truncate pt-0.5">
                    {pedido.invoiceInfo.businessName}
                  </p>
                )}
              </div>
            </AdminCardWrapper>
          )}
        </div>
      </div>
    </AdminPageContainer>
  );
}