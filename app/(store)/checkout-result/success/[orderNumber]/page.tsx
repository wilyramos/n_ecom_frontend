// File: frontend/app/(shop)/checkout-result/success/[orderNumber]/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#FAFAFA]">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-500">
            <X size={20} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-neutral-900 tracking-tight">
              Enlace inválido
            </h1>
            <p className="text-xs text-neutral-500">
              No se proporcionó un identificador de compra válido.
            </p>
          </div>
          <Button asChild className="w-full h-11 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-medium">
            <Link href="/">Volver a la tienda</Link>
          </Button>
        </div>
      </main>
    );
  }

  // 1. Consultamos el estado real validado por el backend
  const pedido = await obtenerPedidoPorNumero(orderNumber);

  if (!pedido) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#FAFAFA]">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-500">
            <X size={20} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-neutral-900 tracking-tight">
              Pedido no localizado
            </h1>
            <p className="text-xs text-neutral-500">
              No localizamos una orden vinculada a #{orderNumber}.
            </p>
          </div>
          <Button asChild className="w-full h-11 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-medium">
            <Link href="/">Volver a la tienda</Link>
          </Button>
        </div>
      </main>
    );
  }

  // 🔴 2. VERIFICACIÓN ESTRICTA: Si está rechazado o cancelado, lo enviamos al flujo de fallo.
  if (pedido.payment.status === 'rejected' || pedido.payment.status === 'refunded' || pedido.status === 'canceled') {
    redirect(`/checkout-result/failure?order=${orderNumber}&reason=rejected`);
  }

  const isApproved = pedido.payment.status === 'approved';
  const isPending = pedido.payment.status === 'pending';
  
  const isPowerpay = pedido.payment.provider === 'powerpay';
  const isTransferencia = pedido.payment.provider === 'transferencia';
  const hasPaymentCode = Boolean(pedido.payment.paymentCode);

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-6 px-4 bg-[#FAFAFA]">
      <div className="w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
        
        {/* Indicador de Estado */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center">
            {isApproved && (
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <Check size={28} strokeWidth={2.5} />
              </div>
            )}
            {isPending && (
              <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                <Clock size={24} strokeWidth={2.5} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
              {isApproved && '¡Pago confirmado!'}
              {isPending && 'Orden generada'}
            </h1>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {isApproved && 'Tu transacción ha sido validada. Recibirás un correo con los detalles de tu compra y el comprobante de pago.'}
              {isPending && 'Tu orden fue creada y estamos a la espera de la confirmación de pago. Te notificaremos por correo cuando se confirme.'}
            </p>
          </div>
        </div>

        {/* Resumen de la Transacción */}
        <div className="border border-neutral-200 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Orden</span>
            <span className="font-mono text-sm font-semibold text-neutral-900 select-all">
              #{pedido.orderNumber}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Importe Total</span>
            <span className="text-base font-semibold text-neutral-900">
              S/ {pedido.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Método de Pago</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-900 capitalize">
              {isPowerpay ? (
                <><Zap size={14} /><span>Powerpay</span></>
              ) : isTransferencia ? (
                <><ReceiptText size={14} /><span>Transferencia / Yape</span></>
              ) : (
                <><CreditCard size={14} /><span className="uppercase">{pedido.payment.provider}</span></>
              )}
            </div>
          </div>
        </div>

        {/* Detalles según Pasarela / Estado */}
        {isPending && hasPaymentCode && !isTransferencia && (
          <div className="border border-orange-100 rounded-2xl p-5 text-center space-y-3 bg-orange-50/50">
            <span className="text-[10px] font-semibold text-orange-600/80 uppercase tracking-wider block">
              Código de Pago (CIP)
            </span>
            <div className="py-2.5 px-4 bg-white border border-orange-200 rounded-xl font-mono text-2xl font-bold tracking-widest text-neutral-900 select-all">
              {pedido.payment.paymentCode}
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Realiza el pago antes de su vencimiento desde tu banca móvil o agentes autorizados.
            </p>
          </div>
        )}

        {/* Datos de Entrega y Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-4 border border-neutral-200 rounded-2xl space-y-1 bg-neutral-50/50">
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <User size={13} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Cliente</span>
            </div>
            <p className="text-xs font-medium text-neutral-900 truncate">
              {pedido.customerProfile.nombre} {pedido.customerProfile.apellidos}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">
              {pedido.customerProfile.email}
            </p>
          </div>

          <div className="p-4 border border-neutral-200 rounded-2xl space-y-1 bg-neutral-50/50">
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <MapPin size={13} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {pedido.deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Dirección'}
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-900 truncate">
              {pedido.shippingAddress.direccion}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">
              {pedido.shippingAddress.distrito}, {pedido.shippingAddress.provincia}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button asChild className="w-full sm:flex-1 h-12 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-medium transition-colors">
            <Link href="/">
              <ShoppingBag className="mr-2" size={14} /> Seguir comprando
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full sm:w-auto h-12 px-6 rounded-full text-neutral-700 hover:bg-neutral-100 text-xs font-medium">
            <Link href="/profile/pedidos">
              Mis compras <ArrowRight className="ml-1.5" size={14} />
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}