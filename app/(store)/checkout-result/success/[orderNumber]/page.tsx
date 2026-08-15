// File: frontend/app/(store)/checkout-result/success/[orderNumber]/page.tsx

import Link from 'next/link';
import { CheckCircle2, Clock, ShoppingBag, XCircle, ChevronRight, CreditCard, Banknote } from 'lucide-react';
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
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Enlace inválido</h1>
        <p className="mt-2 text-slate-600">No se proporcionó un número de orden válido.</p>
        <Button asChild className="mt-8 bg-blue-600 hover:bg-blue-700">
          <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    );
  }

  const pedido = await obtenerPedidoPorNumero(orderNumber);

  if (!pedido) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Pedido no encontrado</h1>
        <p className="mt-2 text-slate-600">No hemos podido localizar la orden #{orderNumber}.</p>
        <Button asChild className="mt-8 bg-blue-600 hover:bg-blue-700">
          <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    );
  }

  const isApproved = pedido.payment.status === 'approved';
  const isPending = pedido.payment.status === 'pending';
  const isRejected = pedido.payment.status === 'rejected' || pedido.payment.status === 'refunded';

  const isTransferencia = pedido.payment.provider === 'transferencia';
  const hasPaymentCode = Boolean(pedido.payment.paymentCode);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8 text-center">

        {/* ICONO CENTRAL DINÁMICO */}
        <div className="flex justify-center">
          {isApproved && (
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50/50">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
          )}
          {isPending && (
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 ring-8 ring-amber-50/50">
              <Clock size={40} strokeWidth={2.5} />
            </div>
          )}
          {isRejected && (
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 ring-8 ring-red-50/50">
              <XCircle size={40} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* ENCABEZADO Y NÚMERO DE ORDEN */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isApproved && '¡Gracias por tu compra!'}
            {isPending && '¡Tu pedido fue recibido!'}
            {isRejected && 'No pudimos procesar el pago'}
          </h1>
          <p className="text-base text-slate-600">
            Orden de compra: <span className="font-bold text-slate-900">#{pedido.orderNumber}</span>
          </p>
          {pedido.payment.transactionId && (
            <p className="text-xs font-mono text-slate-400">TRX: {pedido.payment.transactionId}</p>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* CASO 1: PENDIENTE CON CÓDIGO (PagoEfectivo / Cuotéalo) */}
        {isPending && hasPaymentCode && !isTransferencia && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm text-slate-700 mb-2">
              <Banknote size={24} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Código de Pago (CIP)</h3>
            <div className="bg-white py-4 px-6 rounded-lg border-2 border-dashed border-slate-300 font-mono text-3xl font-black tracking-widest text-slate-900 select-all">
              {pedido.payment.paymentCode}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Usa este código en tu banca móvil, agente o agente corresponsal antes de que caduque. Tu orden se actualizará automáticamente una vez procesado el pago.
            </p>
          </div>
        )}

        {/* CASO 2: PENDIENTE POR BILLETERA QR */}
        {isPending && !hasPaymentCode && !isTransferencia && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900 text-center">Pago pendiente de confirmación</p>
            <p className="text-center">Has generado una orden de pago mediante billetera digital o plataforma de pagos. Si aún no has escaneado el QR o culminado el proceso, revisa tu correo electrónico para completarlo.</p>
          </div>
        )}

        {/* CASO 3: PENDIENTE (Transferencia Bancaria Manual) */}
        {isPending && isTransferencia && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left text-sm text-blue-800 space-y-2">
            <p className="font-semibold text-blue-900">Validación en proceso</p>
            <p>Hemos registrado tu pedido como transferencia bancaria. Si ya enviaste tu constancia o comprobante por WhatsApp, estamos validando la recepción en nuestras cuentas.</p>
            <p>Enviaremos la confirmación a <strong>{pedido.customerProfile.email}</strong>.</p>
          </div>
        )}

        {/* CASO 4: PAGO APROBADO */}
        {isApproved && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 text-left text-sm text-emerald-800 space-y-2.5">
            <div className="flex items-center gap-2 font-semibold text-emerald-900 mb-1">
              <CreditCard size={18} />
              <span>Transacción exitosa</span>
            </div>
            <p>El cobro por <strong>S/ {pedido.totalPrice.toFixed(2)}</strong> fue procesado de manera segura.</p>
            <p>Enviaremos el comprobante y los detalles del envío a <strong>{pedido.customerProfile.email}</strong>.</p>
          </div>
        )}

        {/* CASO 5: PAGO RECHAZADO */}
        {isRejected && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-left text-sm text-red-800 space-y-2">
            <p className="font-semibold text-red-900">Fondos insuficientes o método denegado</p>
            <p>El emisor no autorizó el cargo. No se te ha cobrado ningún monto por esta transacción.</p>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button asChild variant="default" className="w-full sm:w-auto h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" /> Seguir comprando
            </Link>
          </Button>

          {isRejected ? (
            <Button asChild variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-xl border-slate-200">
              <Link href="/checkout-v2">Reintentar pago</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="w-full sm:w-auto h-12 px-6 rounded-xl text-slate-600 hover:text-slate-900">
              <Link href="/mi-cuenta/pedidos">
                Mis pedidos <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}