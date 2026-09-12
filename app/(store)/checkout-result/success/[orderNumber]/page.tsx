import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Check, ShoppingBag, ArrowRight, MapPin, User, ReceiptText, CreditCard, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { obtenerPedidoPorNumero } from '@/src/modules/checkout/services/pedido.service';

// --- Subcomponentes de UI ---

const PrinterHeader = () => (
  <div className="relative z-20 bg-[#1c1c1e] rounded-t-2xl p-4 pb-2 shadow-xl mx-auto w-[100%]">
    <div className="flex justify-between items-center mb-3 px-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-semibold">
        NEOSHOP
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-green-400 uppercase tracking-widest font-mono">Ok</span>

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
  <div className="px-8 pt-5 pb-2 flex flex-col items-center justify-center opacity-80">
    <div className="h-10 w-full bg-[repeating-linear-gradient(90deg,#171717,#171717_2px,transparent_2px,transparent_4px,#171717_4px,#171717_5px,transparent_5px,transparent_8px,#171717_8px,#171717_12px,transparent_12px,transparent_14px)]" />
    <p className="font-mono text-[10px] tracking-[0.4em] mt-3 text-neutral-500">{orderNumber}</p>
  </div>
);

// --- Componente Principal ---

interface SuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams?.orderNumber;

  if (!orderNumber || orderNumber === 'undefined') {
    redirect('/');
  }

  const pedido = await obtenerPedidoPorNumero(orderNumber);

  if (!pedido) {
    redirect('/');
  }

  if (['rejected', 'refunded', 'canceled'].includes(pedido.payment.status)) {
    redirect(`/checkout-result/failure?order=${orderNumber}`);
  }

  if (pedido.payment.status === 'pending') {
    redirect(`/checkout-result/pending?orderNumber=${orderNumber}`);
  }

  const { provider } = pedido.payment;
  const { customerProfile, shippingAddress, items } = pedido;

  const formatCurrency = (amount: number) => `S/ ${amount.toFixed(2)}`;

  const fechaCompra = pedido.createdAt
    ? new Date(pedido.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleDateString('es-PE');

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

              <div className="px-8 flex flex-col items-center text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-bold tracking-widest text-neutral-900 uppercase font-mono">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-[10px] text-green-600 mt-1 uppercase tracking-wider font-semibold">
                  Transacción Aprobada
                </p>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed max-w-[260px]">
                  Te hemos enviado un correo con los detalles de tu compra y el comprobante electrónico.
                </p>
              </div>

              <TicketDivider />

              <div className="px-8 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Orden No.</span>
                  <span className="font-mono text-sm font-semibold text-neutral-900">#{pedido.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fecha</span>
                  <span className="font-mono text-xs text-neutral-900">{fechaCompra}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Método</span>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-900 uppercase">
                    {provider === 'powerpay' && <><Zap size={13} /><span>Powerpay</span></>}
                    {provider === 'transferencia' && <><ReceiptText size={13} /><span>Transferencia</span></>}
                    {!['powerpay', 'transferencia'].includes(provider) && <><CreditCard size={13} /><span>{provider}</span></>}
                  </div>
                </div>
              </div>

              <TicketDivider />

              <div className="px-8 py-4 space-y-4">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Artículos</div>
                <div className="space-y-3">
                  {items?.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="flex flex-col pr-4">
                          <span className="font-medium text-neutral-900 leading-tight">{item.nombre}</span>
                          <span className="font-mono text-xs text-neutral-500 mt-0.5">{item.quantity} x {formatCurrency(item.price)}</span>
                        </div>
                        <span className="font-mono text-neutral-900 font-medium whitespace-nowrap">
                          {formatCurrency(item.quantity * item.price)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-neutral-500 italic">No hay detalles de productos.</div>
                  )}
                </div>
              </div>

              <TicketDivider />

              <div className="px-8 py-4 space-y-2">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span className="uppercase tracking-wider">Subtotal</span>
                  <span className="font-mono">{formatCurrency(pedido.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span className="uppercase tracking-wider">Envío</span>
                  <span className="font-mono">{formatCurrency(pedido.shippingCost || 0)}</span>
                </div>
                {pedido.recargoFinanciero > 0 && (
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span className="uppercase tracking-wider">Cargos</span>
                    <span className="font-mono">{formatCurrency(pedido.recargoFinanciero)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black text-neutral-900 mt-3 pt-3 border-t-2 border-black">
                  <span className="uppercase tracking-widest">Total</span>
                  <span className="font-mono tracking-tight">{formatCurrency(pedido.totalPrice || 0)}</span>
                </div>
              </div>

              <TicketDivider />

              <div className="px-8 py-4 bg-neutral-50/50">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Detalles de Entrega</div>
                <div className="space-y-4">
                  <div className="flex gap-2.5 items-start">
                    <User size={15} className="text-neutral-400 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-neutral-900">{customerProfile.nombre} {customerProfile.apellidos}</span>
                      <span className="text-[11px] font-mono text-neutral-500">{customerProfile.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <MapPin size={15} className="text-neutral-400 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-neutral-900">
                        {pedido.deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Dirección de Envío'}
                      </span>
                      <span className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                        {shippingAddress.direccion}<br />
                        {shippingAddress.distrito}, {shippingAddress.provincia}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Barcode orderNumber={pedido.orderNumber} />

            </div>

            <ZigZagBorder />

          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 px-2">
          <Button asChild className="w-full sm:flex-1 h-12 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg">
            <Link href="/">
              <ShoppingBag className="mr-2" size={16} /> Seguir comprando
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:flex-1 h-12 border-neutral-300 text-neutral-700 hover:bg-white rounded-xl text-sm font-medium transition-all bg-transparent">
            <Link href="/profile/pedidos">
              Mis pedidos <ArrowRight className="ml-1.5" size={16} />
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}