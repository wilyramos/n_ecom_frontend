// File: frontend/app/(store)/checkout-result/success/[orderNumber]/page.tsx

import Link from 'next/link';
import { 
  Check, 
  Clock, 
  ShoppingBag, 
  X, 
  ArrowRight, 
  MapPin, 
  User, 
  ReceiptText,
  CreditCard,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { obtenerPedidoPorNumero } from '@/src/modules/checkout/services/pedido.service';

interface SuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams?.orderNumber;

  if (!orderNumber || orderNumber === 'undefined') {
    return (
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-primary)]">
        <div className="max-w-md w-full bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-brand-action-muted)] flex items-center justify-center mx-auto text-[var(--color-fg-muted)]">
            <X size={20} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-[var(--color-fg-primary)] tracking-tight">
              Enlace inválido
            </h1>
            <p className="text-xs text-[var(--color-fg-muted)]">
              No se proporcionó un identificador de compra válido.
            </p>
          </div>
          <Button asChild className="w-full h-11 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-fg-inverse)] rounded-full text-xs font-medium transition-colors">
            <Link href="/">Volver a la tienda</Link>
          </Button>
        </div>
      </main>
    );
  }

  const pedido = await obtenerPedidoPorNumero(orderNumber);

  if (!pedido) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-primary)]">
        <div className="max-w-md w-full bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-brand-action-muted)] flex items-center justify-center mx-auto text-[var(--color-fg-muted)]">
            <X size={20} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-[var(--color-fg-primary)] tracking-tight">
              Pedido no localizado
            </h1>
            <p className="text-xs text-[var(--color-fg-muted)]">
              No localizamos una orden vinculada a #{orderNumber}.
            </p>
          </div>
          <Button asChild className="w-full h-11 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-fg-inverse)] rounded-full text-xs font-medium transition-colors">
            <Link href="/">Volver a la tienda</Link>
          </Button>
        </div>
      </main>
    );
  }

  const isApproved = pedido.payment.status === 'approved';
  const isPending = pedido.payment.status === 'pending';
  const isRejected = pedido.payment.status === 'rejected' || pedido.payment.status === 'refunded';

  const isPowerpay = pedido.payment.provider === 'powerpay';
  const isTransferencia = pedido.payment.provider === 'transferencia';
  const hasPaymentCode = Boolean(pedido.payment.paymentCode);

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-6 px-4 bg-[var(--color-surface-primary)]">
      <div className="w-full max-w-xl bg-[var(--color-surface-primary)]  p-6 sm:p-10 space-y-8">
        
        {/* Indicador de Estado */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center">
            {isApproved && (
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-action-muted)] text-[var(--color-brand-action)] flex items-center justify-center">
                <Check size={28} strokeWidth={2.5} />
              </div>
            )}
            {isPending && (
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-action-muted)] text-[var(--color-fg-primary)] flex items-center justify-center">
                <Clock size={24} strokeWidth={2} />
              </div>
            )}
            {isRejected && (
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-action-muted)] text-[var(--color-fg-muted)] flex items-center justify-center">
                <X size={24} strokeWidth={2} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-fg-primary)]">
              {isApproved && '¡Pago confirmado!'}
              {isPending && 'Orden recibida'}
              {isRejected && 'Pago no procesado'}
            </h1>
            <p className="text-xs text-[var(--color-fg-muted)] max-w-sm mx-auto">
              {isApproved && 'Tu transacción ha sido validada. Estamos coordinando la preparación del pedido.'}
              {isPending && 'Tu orden fue creada y estamos a la espera de la confirmación de pago.'}
              {isRejected && 'La operación no pudo ser autorizada por el emisor o el medio de pago.'}
            </p>
          </div>
        </div>

        {/* Resumen de la Transacción */}
        <div className="border border-[var(--color-border-default)] rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
            <span className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Orden</span>
            <span className="font-mono text-sm font-semibold text-[var(--color-fg-primary)] select-all">
              #{pedido.orderNumber}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
            <span className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Importe Total</span>
            <span className="text-base font-semibold text-[var(--color-fg-primary)]">
              S/ {pedido.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Método de Pago</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-fg-primary)] capitalize">
              {isPowerpay ? (
                <>
                  <Zap size={14} className="text-[var(--color-fg-primary)]" />
                  <span>Powerpay (Cuotas)</span>
                </>
              ) : isTransferencia ? (
                <>
                  <ReceiptText size={14} className="text-[var(--color-fg-primary)]" />
                  <span>Transferencia / Yape</span>
                </>
              ) : (
                <>
                  <CreditCard size={14} className="text-[var(--color-fg-primary)]" />
                  <span className="uppercase">{pedido.payment.provider}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detalles según Pasarela / Estado */}
        {isPending && hasPaymentCode && !isTransferencia && (
          <div className="border border-[var(--color-border-default)] rounded-2xl p-5 text-center space-y-3 bg-[var(--color-brand-action-muted)]">
            <span className="text-[10px] font-semibold text-[var(--color-fg-muted)] uppercase tracking-wider block">
              Código de Pago (CIP)
            </span>
            <div className="py-2.5 px-4 bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-xl font-mono text-2xl font-bold tracking-widest text-[var(--color-fg-primary)] select-all">
              {pedido.payment.paymentCode}
            </div>
            <p className="text-[11px] text-[var(--color-fg-muted)] leading-relaxed">
              Realiza el pago antes de su vencimiento desde tu banca móvil o agentes autorizados.
            </p>
          </div>
        )}

        {isApproved && isPowerpay && (
          <div className="border border-[var(--color-border-default)] bg-[var(--color-brand-action-muted)] rounded-2xl p-4 text-xs text-[var(--color-fg-primary)] space-y-1">
            <p className="font-semibold">Financiamiento Aprobado con Powerpay</p>
            <p className="text-[11px] text-[var(--color-fg-muted)] leading-relaxed">
              La primera cuota fue procesada con éxito. El cronograma completo fue enviado a <strong>{pedido.customerProfile.email}</strong>.
            </p>
          </div>
        )}

        {/* Datos de Entrega y Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-4 border border-[var(--color-border-default)] rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--color-fg-muted)] mb-1">
              <User size={13} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Cliente</span>
            </div>
            <p className="text-xs font-medium text-[var(--color-fg-primary)] truncate">
              {pedido.customerProfile.nombre} {pedido.customerProfile.apellidos}
            </p>
            <p className="text-[11px] text-[var(--color-fg-muted)] truncate">
              {pedido.customerProfile.email}
            </p>
          </div>

          <div className="p-4 border border-[var(--color-border-default)] rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--color-fg-muted)] mb-1">
              <MapPin size={13} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {pedido.deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Dirección'}
              </span>
            </div>
            <p className="text-xs font-medium text-[var(--color-fg-primary)] truncate">
              {pedido.shippingAddress.direccion}
            </p>
            <p className="text-[11px] text-[var(--color-fg-muted)] truncate">
              {pedido.shippingAddress.distrito}, {pedido.shippingAddress.provincia}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button asChild className="w-full sm:flex-1 h-12 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-fg-inverse)] rounded-full text-xs font-medium transition-colors">
            <Link href="/">
              <ShoppingBag className="mr-2" size={14} /> Seguir comprando
            </Link>
          </Button>

          {isRejected ? (
            <Button asChild variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-full border-[var(--color-border-default)] text-[var(--color-fg-primary)] text-xs font-medium">
              <Link href="/checkout-v2">Reintentar compra</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="w-full sm:w-auto h-12 px-6 rounded-full text-[var(--color-fg-primary)] hover:bg-[var(--color-brand-action-muted)] text-xs font-medium">
              <Link href="/profile/pedidos">
                Mis compras <ArrowRight className="ml-1.5" size={14} />
              </Link>
            </Button>
          )}
        </div>

      </div>
    </main>
  );
}