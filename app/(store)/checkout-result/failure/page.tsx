import Link from 'next/link';
import { X, RefreshCw, ShoppingBag, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { obtenerPedidoPorNumero } from '@/src/modules/checkout/services/pedido.service';

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
  
  // Extraemos el error EXACTO (Ej: "Fondos insuficientes") que la pasarela guardó en la base de datos
  if (orderNumber) {
    const pedido = await obtenerPedidoPorNumero(orderNumber);
    
    if (pedido?.payment?.gatewayData) {
      // Tipado seguro para evitar "any"
      const gData = pedido.payment.gatewayData as Record<string, unknown>;
      const lastError = gData?.lastError as Record<string, unknown> | undefined;
      const failureReason = gData?.failure_reason as Record<string, unknown> | undefined;
      
      const culqiMessage = (lastError?.user_message as string) || (failureReason?.user_message as string);
      
      if (culqiMessage) {
        errorMessage = culqiMessage;
      }
    }
  } else if (fallbackReason === 'canceled') {
    errorMessage = 'La operación fue cancelada durante el proceso de validación de identidad.';
  } else if (fallbackReason === 'expired') {
    errorMessage = 'El tiempo límite para completar la transacción ha expirado.';
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#FAFAFA]">
      <div className="w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
        
        {/* Cabecera del Error */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <X size={26} strokeWidth={2.5} />
          </div>

          <div className="space-y-1 w-full">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
              Pago denegado o incompleto
            </h1>
            <div className="mt-4 p-3.5 bg-red-50/80 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 max-w-sm mx-auto font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Detalles de la Orden */}
        {orderNumber && (
          <div className="border border-neutral-200 rounded-2xl p-5 space-y-3 bg-neutral-50/50">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Referencia de Orden</span>
              <span className="font-mono text-sm font-semibold text-neutral-900 select-all">#{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Estado del Cargo</span>
              <span className="text-xs font-bold text-red-600 uppercase">Rechazado</span>
            </div>
          </div>
        )}

        {/* Sugerencias para el Usuario */}
        <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-5 space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <AlertCircle size={15} />
            <span>Sugerencias para continuar:</span>
          </div>
          <ul className="text-[11px] text-blue-900/80 space-y-2 list-disc list-inside leading-relaxed">
            <li>Verifica que la tarjeta cuente con saldo disponible y compras por internet habilitadas.</li>
            <li>Revisa que los datos (CVV, fecha de expiración) ingresados coincidan exactamente.</li>
            <li>Si el banco bloquea la tarjeta por seguridad, intenta utilizando otro método como <strong>Yape</strong> o <strong>PagoEfectivo</strong> en la pantalla de pago.</li>
          </ul>
        </div>

        {/* Bloque de Contacto Directo */}
        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-2xl text-xs bg-white">
          <div className="flex items-center gap-2 text-neutral-600">
            <HelpCircle size={15} />
            <span>¿Tienes inconvenientes repetitivos?</span>
          </div>
          <a
            href="https://wa.me/51902900653?text=Hola,%20tuve%20un%20problema%20al%20realizar%20mi%20pago"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-neutral-900 hover:text-blue-600 hover:underline transition-colors"
          >
            Contactar Asesor
          </a>
        </div>

        {/* Botones de Acción */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button asChild className="w-full sm:flex-1 h-12 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-medium transition-colors shadow-sm">
            <Link href="/checkout-v2">
              <RefreshCw className="mr-2" size={14} /> Reintentar compra
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full sm:w-auto h-12 px-6 rounded-full text-neutral-700 hover:bg-neutral-100 text-xs font-medium transition-colors">
            <Link href="/">
              <ShoppingBag className="mr-2" size={14} /> Volver a la tienda
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}