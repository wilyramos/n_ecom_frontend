import Link from 'next/link';
import { X, RefreshCw, ShoppingBag, AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { obtenerPedidoPorNumero } from '@/src/modules/checkout/services/pedido.service';

// --- Subcomponentes de UI (Diseño de Ticket) ---

const PrinterHeader = () => (
  <div className="relative z-20 bg-[#1c1c1e] rounded-t-2xl p-4 pb-2 shadow-xl mx-auto w-[100%]">
    <div className="flex justify-between items-center mb-3 px-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-semibold">
        NEOSHOP
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-red-400 uppercase tracking-widest font-mono">Denegado</span>
      </div>
    </div>
    <div className="w-full h-2.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-b border-neutral-700/50 relative z-30" />
  </div>
);

const TicketDivider = () => (
  <div className="px-6 py-1">
    <div className="border-t-2 border-dashed border-neutral-200" />
  </div>
);

const ZigZagBorder = () => (
  <svg className="w-full h-3 text-white block drop-shadow-sm" viewBox="0 0 100 10" preserveAspectRatio="none">
    <polygon fill="currentColor" points="0,0 100,0 100,10 95,0 90,10 85,0 80,10 75,0 70,10 65,0 60,10 55,0 50,10 45,0 40,10 35,0 30,10 25,0 20,10 15,0 10,10 5,0 0,10" />
  </svg>
);

const Barcode = ({ orderNumber }: { orderNumber: string }) => (
  <div className="px-8 pt-5 pb-2 flex flex-col items-center justify-center opacity-80 border-t border-dashed border-neutral-200 mt-4">
    <div className="h-10 w-full bg-[repeating-linear-gradient(90deg,#171717,#171717_2px,transparent_2px,transparent_4px,#171717_4px,#171717_5px,transparent_5px,transparent_8px,#171717_8px,#171717_12px,transparent_12px,transparent_14px)]" />
    <p className="font-mono text-[10px] tracking-[0.4em] mt-3 text-neutral-500">{orderNumber}</p>
  </div>
);

// --- Componente Principal ---

interface FailurePageProps {
  searchParams: Promise<{
    order?: string;
    reason?: string;
  }>;
}

export default async function FailurePage({ searchParams }: FailurePageProps) {
  const resolvedParams = await searchParams;
  const orderNumber = resolvedParams?.order;
  const fallbackReason = resolvedParams?.reason?.toLowerCase();

  let errorMessage = 'No pudimos procesar la transacción con el medio de pago seleccionado.';

  if (orderNumber) {
    try {
      const pedido = await obtenerPedidoPorNumero(orderNumber);

      if (pedido?.payment?.gatewayData) {
        const gData = pedido.payment.gatewayData as Record<string, unknown>;
        const lastError = gData?.lastError as Record<string, unknown> | undefined;
        const failureReason = gData?.failure_reason as Record<string, unknown> | undefined;

        const culqiMessage = (lastError?.user_message as string) || (failureReason?.user_message as string);

        if (culqiMessage) {
          errorMessage = culqiMessage;
        }
      }
    } catch {
      // Si el pedido no se encuentra o falla la consulta, mantenemos el mensaje de fallback
    }
  }

  if (fallbackReason === 'not_found') {
    errorMessage = 'No se encontró el registro del pedido solicitado o fue eliminado.';
  } else if (fallbackReason === 'canceled') {
    errorMessage = 'La operación fue cancelada durante el proceso de verificación de identidad.';
  } else if (fallbackReason === 'expired') {
    errorMessage = 'El tiempo límite para completar la transacción ha expirado.';
  }

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center py-12 px-4 font-sans selection:bg-neutral-900 selection:text-white">
      <style>{`
        @keyframes printTicket {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }
        .animate-print {
          animation: printTicket 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div className="w-full max-w-[400px]">
        <PrinterHeader />

        <div className="relative z-10 w-full overflow-hidden -mt-2 pt-2">
          <div className="animate-print relative drop-shadow-2xl pb-4">
            <div className="bg-white pt-8 pb-6 rounded-b-none overflow-hidden">
              
              {/* Icono y Título */}
              <div className="px-8 flex flex-col items-center text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                  <X size={28} strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-bold tracking-widest text-neutral-900 uppercase font-mono">
                  Pago Denegado
                </h1>
                <p className="text-[10px] text-red-600 mt-1 uppercase tracking-wider font-semibold">
                  Operación no procesada
                </p>

                <div className="mt-4 p-3.5 bg-red-50/70 border border-red-100 rounded-xl w-full">
                  <p className="text-xs text-red-600 font-medium leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <TicketDivider />

              {/* Detalles de la Transacción */}
              <div className="px-8 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Referencia</span>
                  <span className="font-mono text-sm font-semibold text-neutral-900">
                    {orderNumber ? `#${orderNumber}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Estado</span>
                  <span className="font-mono text-xs font-bold text-red-600 uppercase">Rechazado</span>
                </div>
              </div>

              <TicketDivider />

              {/* Sugerencias y Pasos Siguientes */}
              <div className="px-8 py-4 bg-neutral-50/60">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
                  <AlertCircle size={13} />
                  <span>Sugerencias</span>
                </div>
                <ul className="text-[11px] text-neutral-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Verifica que la tarjeta tenga compras por internet activas.</li>
                  <li>Revisa los datos ingresados (CVV y expiración).</li>
                  <li>Prueba utilizando <strong>Yape</strong> o <strong>PagoEfectivo</strong> en el checkout.</li>
                </ul>
              </div>

              {/* Asistencia */}
              <div className="px-8 pt-3 pb-1 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">¿Necesitas ayuda?</span>
                <a
                  href={`https://wa.me/51902900653?text=Hola,%20tuve%20un%20problema%20con%20el%20pago%20de%20mi%20orden%20${orderNumber || ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-neutral-900 hover:text-blue-600 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <MessageCircle size={12} /> Contactar soporte
                </a>
              </div>

              <Barcode orderNumber={orderNumber || '000000000000'} />
            </div>

            <ZigZagBorder />
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex flex-col gap-3 px-2">
          <Button asChild className="w-full h-12 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg">
            <Link href="/checkout-v2">
              <RefreshCw className="mr-2" size={15} /> Intentar nuevamente
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full h-12 border-neutral-300 text-neutral-700 hover:bg-white rounded-xl text-sm font-medium transition-all bg-transparent shadow-sm">
            <Link href="/">
              <ShoppingBag className="mr-2" size={15} /> Volver a la tienda
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}