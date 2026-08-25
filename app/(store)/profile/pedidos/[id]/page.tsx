// File: frontend/app/(store)/profile/pedidos/[id]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { redirect, notFound } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  Zap,
  ReceiptText,
  FileText,
  Truck,
  Store,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react';
import getToken from '@/src/auth/token';
import { obtenerPedidoPorId } from '@/src/modules/checkout/services/pedido.service';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const token = await getToken();

  if (!token) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const pedido = await obtenerPedidoPorId(id, token);

  if (!pedido) {
    notFound();
  }

  const isApproved = pedido.payment.status === 'approved';
  const isPending = pedido.payment.status === 'pending';
  const isRejected = pedido.payment.status === 'rejected';

  const isPowerpay = pedido.payment.provider === 'powerpay';
  const isTransferencia = pedido.payment.provider === 'transferencia';
  const isCulqi = pedido.payment.provider === 'culqi';
  const isMercadoPago = pedido.payment.provider === 'mercadopago';

  const estadoBadgeMap: Record<string, { label: string; bg: string; text: string; icon: React.ComponentType<{ size: number; className?: string }> }> = {
    awaiting_payment: { label: 'Esperando Pago', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: Clock },
    processing: { label: 'En Preparación', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: CheckCircle2 },
    shipped: { label: 'En Camino', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', icon: Truck },
    delivered: { label: 'Entregado', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: CheckCircle2 },
    canceled: { label: 'Cancelado', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', icon: XCircle },
    paid_but_out_of_stock: { label: 'Revisión de Stock', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800', icon: Clock },
  };

  const currentStatus = estadoBadgeMap[pedido.status] || {
    label: pedido.status,
    bg: 'bg-neutral-100 border-neutral-200',
    text: 'text-neutral-800',
    icon: Clock,
  };

  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      {/* Cabecera y Navegación */}
      <div className="space-y-4">
        <Link
          href="/profile/pedidos"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={14} /> Volver a mis compras
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Orden #{pedido.orderNumber}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentStatus.bg} ${currentStatus.text}`}>
                <StatusIcon size={13} />
                {currentStatus.label}
              </span>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Calendar size={13} />
              Realizada el {new Date(pedido.createdAt).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Estado del Pago */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Pago:</span>
            <span className={`font-semibold capitalize px-2.5 py-0.5 rounded text-[11px] ${isApproved ? 'bg-emerald-100 text-emerald-800' :
                isPending ? 'bg-amber-100 text-amber-800' :
                  isRejected ? 'bg-rose-100 text-rose-800' : 'bg-neutral-100 text-neutral-800'
              }`}>
              {pedido.payment.status === 'approved' ? 'Aprobado' :
                pedido.payment.status === 'pending' ? 'Pendiente de Pago' :
                  pedido.payment.status === 'rejected' ? 'Rechazado' : pedido.payment.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Artículos y Totales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de Productos */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Productos comprados ({pedido.items.reduce((acc, it) => acc + it.quantity, 0)})
            </h2>

            <div className="divide-y divide-neutral-100">
              {pedido.items.map((item, idx) => {
                const attrs = item.variantAttributes
                  ? Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(' | ')
                  : null;

                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden shrink-0">
                      <Image
                        src={item.imagen || '/logo.png'}
                        alt={item.nombre}
                        fill
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-neutral-900 truncate">
                        {item.nombre}
                      </h3>
                      {attrs && (
                        <p className="text-[11px] text-neutral-500 truncate">
                          {attrs}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500">
                        {item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'} × S/ {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-neutral-900 tabular-nums">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desglose de Totales */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-1">
              Resumen económico
            </h2>

            <div className="space-y-2 text-xs divide-y divide-neutral-100">
              <div className="flex justify-between text-neutral-600 pt-1">
                <span>Subtotal base</span>
                <span className="font-medium text-neutral-900 tabular-nums">S/ {pedido.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-neutral-600 pt-2">
                <span>IGV (18% incluido)</span>
                <span className="font-medium text-neutral-900 tabular-nums">S/ {pedido.igv.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-neutral-600 pt-2">
                <span>Costo de envío</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {pedido.shippingCost === 0 ? 'Gratis' : `S/ ${pedido.shippingCost.toFixed(2)}`}
                </span>
              </div>

              {pedido.recargoFinanciero > 0 && (
                <div className="flex justify-between text-neutral-600 pt-2">
                  <span>Recargo pasarela</span>
                  <span className="font-medium text-neutral-900 tabular-nums">S/ {pedido.recargoFinanciero.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 flex justify-between items-baseline text-base font-bold text-neutral-900">
                <span>Total pagado</span>
                <span className="text-lg tabular-nums">S/ {pedido.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Pago, Entrega y Comprobante */}
        <div className="space-y-6">
          {/* Tarjeta de Información de Pago */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3.5">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
              <span>Método de Pago</span>
              <ShieldCheck size={14} className="text-emerald-600" />
            </h2>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-medium text-neutral-900">
              {isPowerpay ? (
                <>
                  <Zap size={18} className="text-neutral-900 shrink-0" />
                  <div>
                    <p className="font-bold">Powerpay</p>
                    <p className="text-[11px] text-neutral-500 font-normal">Financiamiento en cuotas</p>
                  </div>
                </>
              ) : isTransferencia ? (
                <>
                  <ReceiptText size={18} className="text-neutral-700 shrink-0" />
                  <div>
                    <p className="font-bold">Transferencia Directa</p>
                    <p className="text-[11px] text-neutral-500 font-normal">Pago manual verificado</p>
                  </div>
                </>
              ) : isCulqi ? (
                <>
                  <CreditCard size={18} className="text-neutral-900 shrink-0" />
                  <div>
                    <p className="font-bold">Tarjeta de Crédito / Débito</p>
                    <p className="text-[11px] text-neutral-500 font-normal">Pasarela Culqi</p>
                  </div>
                </>
              ) : isMercadoPago ? (
                <>
                  <CreditCard size={18} className="text-blue-600 shrink-0" />
                  <div>
                    <p className="font-bold">Mercado Pago</p>
                    <p className="text-[11px] text-neutral-500 font-normal">Saldo / Tarjetas</p>
                  </div>
                </>
              ) : (
                <>
                  <CreditCard size={18} className="text-neutral-700 shrink-0" />
                  <span className="uppercase font-bold">{pedido.payment.provider}</span>
                </>
              )}
            </div>

            {pedido.payment.transactionId && (
              <div className="text-[11px] space-y-0.5 pt-1 border-t border-neutral-100">
                <span className="text-neutral-500">ID de Transacción:</span>
                <p className="font-mono text-neutral-800 break-all text-[10px]">
                  {pedido.payment.transactionId}
                </p>
              </div>
            )}
          </div>

          {/* Tarjeta de Envío / Entrega */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              {pedido.deliveryMethod === 'pickup' ? (
                <>
                  <Store size={14} /> Recojo en Tienda
                </>
              ) : (
                <>
                  <Truck size={14} /> Envío a Domicilio
                </>
              )}
            </h2>

            <div className="text-xs text-neutral-900 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{pedido.shippingAddress.direccion}</p>
                  <p className="text-neutral-500 text-[11px]">
                    {pedido.shippingAddress.distrito}, {pedido.shippingAddress.provincia} - {pedido.shippingAddress.departamento}
                  </p>
                  {pedido.shippingAddress.referencia && (
                    <p className="text-neutral-500 text-[11px] italic mt-0.5">
                      Ref: {pedido.shippingAddress.referencia}
                    </p>
                  )}
                </div>
              </div>

              {/* Datos de Contacto */}
              <div className="pt-2 border-t border-neutral-100 space-y-1 text-[11px] text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-neutral-400" />
                  <span>{pedido.customerProfile.nombre} {pedido.customerProfile.apellidos}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={12} className="text-neutral-400" />
                  <span>{pedido.customerProfile.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-neutral-400" />
                  <span>{pedido.customerProfile.telefono}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Facturación */}
          {pedido.invoiceInfo && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-2.5">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} /> Comprobante de Pago
              </h2>

              <div className="text-xs text-neutral-900 space-y-1 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 capitalize">{pedido.invoiceInfo.type}</span>
                  <span className="font-mono font-medium">{pedido.invoiceInfo.documentNumber}</span>
                </div>
                {pedido.invoiceInfo.businessName && (
                  <p className="font-semibold truncate text-[11px] pt-0.5">
                    {pedido.invoiceInfo.businessName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}