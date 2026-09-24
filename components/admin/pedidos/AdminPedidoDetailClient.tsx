// File: frontend/app/admin/pedidos/[id]/AdminPedidoDetailClient.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IPedido } from '@/src/modules/checkout/types/pedido.types';
import { formatDate } from '@/lib/utils';
import {
  User,
  MapPin,
  CreditCard,
  ArrowLeft,
  Store,
  Truck,
  FileText,
  Clock,
  Phone,
  Mail,
  Package,
  Copy,
  Check,
  Building2,
  QrCode,
  Layers,
  UserCheck,
  MessageSquareQuote,
  IdCard,
} from 'lucide-react';

import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import { AdminStatusBadge } from '@/src/components/admin/layout/admin-status-badge';
import AdminChangeStatusModal from './AdminChangeStatusModal';

interface AdminPedidoDetailClientProps {
  initialPedido: IPedido;
}

export default function AdminPedidoDetailClient({ initialPedido }: AdminPedidoDetailClientProps) {
  const [pedido, setPedido] = useState<IPedido>(initialPedido);
  const [copiedTxId, setCopiedTxId] = useState(false);
  const [copiedPaymentCode, setCopiedPaymentCode] = useState(false);

  const handleCopy = (text?: string, type: 'tx' | 'code' = 'tx') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTxId(true);
      setTimeout(() => setCopiedTxId(false), 2000);
    } else {
      setCopiedPaymentCode(true);
      setTimeout(() => setCopiedPaymentCode(false), 2000);
    }
  };

  if (!pedido || !pedido.status) {
    return (
      <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
        <AdminCardWrapper padding="default">
          <div className="py-8 text-center text-xs text-zinc-500">
            No se pudo cargar la información del pedido.
          </div>
        </AdminCardWrapper>
      </AdminPageContainer>
    );
  }

  const isPickup = pedido.deliveryMethod === 'pickup';
  const totalItemsCount = pedido.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
  const paymentDetails = pedido.payment?.details;
  const hasDistinctReceiver = Boolean(
    pedido.receiverInfo?.nombre &&
    (pedido.receiverInfo.nombre !== pedido.customerProfile?.nombre ||
      pedido.receiverInfo.apellidos !== pedido.customerProfile?.apellidos ||
      pedido.receiverInfo.telefono !== pedido.customerProfile?.telefono)
  );

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      {/* Barra de Navegación y Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-zinc-200/80 rounded-xl px-3.5 py-2.5 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/pedidos"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="Volver a pedidos"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              #{pedido.orderNumber}
            </span>
            <span className="text-zinc-300 hidden sm:inline">•</span>
            <span className="text-[11.5px] text-zinc-500 hidden sm:inline">
              {formatDate(pedido.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminStatusBadge status={pedido.status} />
          <AdminChangeStatusModal pedido={pedido} onStatusUpdated={setPedido} />
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Columna Izquierda: Artículos, Notas y Totales */}
        <div className="lg:col-span-2 space-y-3">
          <AdminCardWrapper padding="default">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Artículos del Pedido ({totalItemsCount})
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">
                {pedido.items?.length || 0} {pedido.items?.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            <div className="divide-y divide-zinc-100">
              {pedido.items?.map((item, idx) => {
                const attrs = item.variantAttributes
                  ? Object.entries(item.variantAttributes)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' • ')
                  : null;

                return (
                  <div key={idx} className="py-3.5 first:pt-3 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-12 w-12 rounded-lg border border-zinc-200/80 bg-zinc-50 overflow-hidden shrink-0">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.nombre}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <Package className="h-4 w-4 m-auto text-zinc-300 absolute inset-0" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-medium text-zinc-900 truncate" title={item.nombre}>
                          {item.nombre}
                        </p>
                        {attrs && (
                          <p className="text-[11px] text-zinc-500 truncate">
                            {attrs}
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-400">
                          {item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'} × S/ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-zinc-900 shrink-0">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </AdminCardWrapper>

          {/* Instrucciones Especiales de Entrega */}
          {pedido.deliveryNotes && (
            <AdminCardWrapper padding="default">
              <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100">
                <MessageSquareQuote className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
                  Instrucciones Especiales de Entrega
                </h3>
              </div>
              <div className="pt-2.5">
                <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-950 leading-relaxed whitespace-pre-wrap">
                  {pedido.deliveryNotes}
                </div>
              </div>
            </AdminCardWrapper>
          )}

          {/* Desglose de Totales */}
          <AdminCardWrapper padding="default">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100">
              Resumen
            </h3>

            <div className="pt-2.5 space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium text-zinc-800">
                  S/ {pedido.subtotal?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Costo de Envío</span>
                <span className="font-medium text-zinc-800">
                  {pedido.shippingCost === 0 ? 'Gratis' : `S/ ${pedido.shippingCost?.toFixed(2)}`}
                </span>
              </div>

              {pedido.recargoFinanciero > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Recargo de Pasarela</span>
                  <span className="font-medium text-zinc-800">
                    S/ {pedido.recargoFinanciero?.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-zinc-100 text-zinc-950">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-bold tracking-tight">
                  S/ {pedido.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
          </AdminCardWrapper>
        </div>

        {/* Columna Derecha: Tarjetas de Información */}
        <div className="space-y-3">
          {/* Pago y Pasarela */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-zinc-900">
                <CreditCard className="h-4 w-4 text-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">Pago & Pasarela</h3>
              </div>
              <AdminStatusBadge status={pedido.payment?.status} />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <span className="text-[11px] text-zinc-500 font-medium">Pasarela</span>
                <span className="font-semibold text-zinc-900 uppercase tracking-wide">
                  {pedido.payment?.provider}
                </span>
              </div>

              {/* Detalles Estructurados de Culqi / Tarjeta / CIP */}
              {paymentDetails && (
                <div className="space-y-2 p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-200/70 text-[11.5px]">
                  {paymentDetails.paymentMethod === 'tarjeta' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 font-medium">Tarjeta</span>
                        <span className="font-semibold text-zinc-900">
                          {paymentDetails.brand || 'Tarjeta'} •••• {paymentDetails.lastFour || '----'}
                        </span>
                      </div>

                      {paymentDetails.cardType && (
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 font-medium">Tipo</span>
                          <span className="text-zinc-700 capitalize">
                            {paymentDetails.cardType}
                          </span>
                        </div>
                      )}

                      {paymentDetails.issuerName && (
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 font-medium flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-zinc-400" />
                            Emisor
                          </span>
                          <span className="text-zinc-700 font-medium">
                            {paymentDetails.issuerName}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 font-medium flex items-center gap-1">
                          <Layers className="h-3 w-3 text-zinc-400" />
                          Cuotas
                        </span>
                        <span className="font-medium text-zinc-900">
                          {paymentDetails.installments && paymentDetails.installments > 1
                            ? `${paymentDetails.installments} cuotas`
                            : '1 cuota (Directo)'}
                        </span>
                      </div>
                    </>
                  )}

                  {paymentDetails.paymentMethod === 'yape' && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 font-medium">Billetera</span>
                      <span className="font-semibold text-[#8B2D88]">Yape</span>
                    </div>
                  )}

                  {paymentDetails.paymentMethod === 'pagoefectivo' && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 font-medium flex items-center gap-1">
                        <QrCode className="h-3 w-3 text-zinc-400" />
                        Modalidad
                      </span>
                      <span className="font-medium text-zinc-800">PagoEfectivo</span>
                    </div>
                  )}
                </div>
              )}

              {/* Código CIP si es PagoEfectivo */}
              {pedido.payment?.paymentCode && (
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    Código CIP (PagoEfectivo)
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-amber-50/60 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
                    <span className="text-xs font-mono font-semibold text-amber-900 select-all">
                      {pedido.payment.paymentCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pedido.payment?.paymentCode, 'code')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-amber-800 bg-white hover:bg-amber-100 border border-amber-300 shadow-2xs transition-all shrink-0 cursor-pointer"
                    >
                      {copiedPaymentCode ? (
                        <Check className="h-3 w-3 text-amber-600 stroke-[2.5]" />
                      ) : (
                        <Copy className="h-3 w-3 text-amber-600 stroke-[1.8]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Identificador de Transacción */}
              {pedido.payment?.transactionId && (
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    ID Transacción
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200/70">
                    <span className="text-[11.5px] text-zinc-700 truncate select-all">
                      {pedido.payment.transactionId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pedido.payment?.transactionId, 'tx')}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-zinc-600 bg-white hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200 shadow-2xs transition-all shrink-0 cursor-pointer"
                      title="Copiar ID de transacción"
                    >
                      {copiedTxId ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-zinc-500 stroke-[2.5]" />
                          <span className="text-[8px] text-zinc-700 font-medium">Copiado</span>
                        </>
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-zinc-500 stroke-[1.8]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {pedido.payment?.paidAt && (
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-500">
                  <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>Pagado el {formatDate(pedido.payment.paidAt)}</span>
                </div>
              )}
            </div>
          </AdminCardWrapper>

          {/* Cliente (Comprador) */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center justify-between mb-3 text-zinc-900">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">Datos del Cliente</h3>
              </div>
              <span className="text-[10.5px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                Titular / Comprador
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-600">
              <div>
                <p className="font-semibold text-zinc-900 text-sm">
                  {pedido.customerProfile?.nombre} {pedido.customerProfile?.apellidos}
                </p>
                <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                  <IdCard className="h-3 w-3 text-zinc-400" />
                  {pedido.customerProfile?.tipoDocumento}: {pedido.customerProfile?.numeroDocumento}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-[11.5px]">
                <p className="flex items-center gap-2 text-zinc-700">
                  <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{pedido.customerProfile?.email}</span>
                </p>
                <p className="flex items-center gap-2 text-zinc-700">
                  <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>{pedido.customerProfile?.telefono}</span>
                </p>
              </div>
            </div>
          </AdminCardWrapper>

          {/* Quien Recibe / Recoge el Pedido */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center justify-between mb-3 text-zinc-900">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  {isPickup ? 'Autorizado para Recojo' : 'Receptor del Envío'}
                </h3>
              </div>
              <span
                className={`text-[10.5px] font-medium px-2 py-0.5 rounded-md ${hasDistinctReceiver
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-zinc-100 text-zinc-600'
                  }`}
              >
                {hasDistinctReceiver ? 'Tercero Autorizado' : 'Mismo Titular'}
              </span>
            </div>

            {hasDistinctReceiver && pedido.receiverInfo ? (
              <div className="space-y-2.5 text-xs text-zinc-600">
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">
                    {pedido.receiverInfo.nombre} {pedido.receiverInfo.apellidos}
                  </p>
                  {pedido.receiverInfo.numeroDocumento && (
                    <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                      <IdCard className="h-3 w-3 text-zinc-400" />
                      {pedido.receiverInfo.tipoDocumento || 'DOC'}: {pedido.receiverInfo.numeroDocumento}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-100 text-[11.5px]">
                  <p className="flex items-center gap-2 text-zinc-700">
                    <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="font-medium text-zinc-900">{pedido.receiverInfo.telefono}</span>
                    <span className="text-[10px] text-zinc-400">(Contacto de entrega)</span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 leading-relaxed">
                El pedido será recibido o retirado directamente por el titular de la compra (
                <span className="font-medium text-zinc-800">
                  {pedido.customerProfile?.nombre} {pedido.customerProfile?.apellidos}
                </span>
                ).
              </p>
            )}
          </AdminCardWrapper>

          {/* Entrega */}
          <AdminCardWrapper padding="default">
            <div className="flex items-center gap-2 mb-3 text-zinc-900">
              {isPickup ? (
                <Store className="h-4 w-4 text-zinc-500" />
              ) : (
                <Truck className="h-4 w-4 text-zinc-500" />
              )}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                {isPickup ? 'Recojo en Tienda' : 'Entrega a Domicilio'}
              </h3>
            </div>

            <div className="flex items-start gap-2 text-xs text-zinc-600">
              <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-medium text-zinc-900">{pedido.shippingAddress?.direccion}</p>
                <p className="text-zinc-500 text-[11px]">
                  {pedido.shippingAddress?.distrito}, {pedido.shippingAddress?.provincia} - {pedido.shippingAddress?.departamento}
                </p>
                {pedido.shippingAddress?.referencia && (
                  <p className="text-zinc-500 text-[11px] italic pt-0.5">
                    Ref: {pedido.shippingAddress.referencia}
                  </p>
                )}
              </div>
            </div>
          </AdminCardWrapper>

          {/* Facturación */}
          {pedido.invoiceInfo && (
            <AdminCardWrapper padding="default">
              <div className="flex items-center gap-2 mb-2.5 text-zinc-900">
                <FileText className="h-4 w-4 text-zinc-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">Facturación</h3>
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 capitalize font-medium">{pedido.invoiceInfo.type}</span>
                  <span className="font-semibold text-zinc-900">{pedido.invoiceInfo.documentNumber}</span>
                </div>
                {pedido.invoiceInfo.businessName && (
                  <p className="font-medium text-zinc-900 text-[11px] truncate pt-0.5">
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