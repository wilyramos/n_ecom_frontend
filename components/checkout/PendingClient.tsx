'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { IPedido } from '@/src/modules/checkout/types/pedido.types';
import Link from 'next/link';
import { Clock, ShoppingBag, MapPin, User, ReceiptText, CreditCard, Zap, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// --- Subcomponentes de UI (Diseño de Ticket) ---

const PrinterHeader = () => (
  <div className="relative z-20 bg-[#1c1c1e] rounded-t-2xl p-4 pb-2 shadow-xl mx-auto w-[100%]">
    <div className="flex justify-between items-center mb-3 px-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-semibold">
        NEOSHOP
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-orange-400 uppercase tracking-widest font-mono">Pendiente</span>
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

interface PendingClientProps {
  order: IPedido;
}

export default function PendingClient({ order }: PendingClientProps) {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (order?.payment?.status === 'pending') {
      clearCart();
    }
  }, [order, clearCart]);

  const { provider } = order.payment;
  const { customerProfile, shippingAddress, items } = order;

  const formatCurrency = (amount: number) => `S/ ${amount.toFixed(2)}`;

  const fechaCompra = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleDateString('es-PE');

  const copyToClipboard = () => {
    if (order.payment?.paymentCode) {
      navigator.clipboard.writeText(order.payment.paymentCode);
      toast.success('Código CIP copiado al portapapeles');
    }
  };

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
                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                  <Clock size={28} strokeWidth={2.5} className="animate-pulse" />
                </div>
                <h1 className="text-xl font-bold tracking-widest text-neutral-900 uppercase font-mono">
                  Pago en Proceso
                </h1>
                <p className="text-[10px] text-orange-600 mt-1 uppercase tracking-wider font-semibold">
                  Esperando confirmación
                </p>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed max-w-[260px]">
                  Completa la acción en tu app bancaria o agente autorizado para confirmar tu compra.
                </p>
              </div>

              {/* Caja de Código CIP Destacada */}
              {order.payment?.paymentCode && (
                <div className="mx-8 mb-4 mt-2 p-4 bg-orange-50 rounded-xl border border-orange-200 text-center relative overflow-hidden group">
                  <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">
                    Código de Pago (CIP)
                  </div>
                  <div className="font-mono text-3xl font-black text-neutral-900 tracking-wider py-1">
                    {order.payment.paymentCode}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="mt-2 text-[11px] text-orange-600 flex items-center justify-center gap-1.5 w-full font-semibold hover:text-orange-700 transition-colors uppercase tracking-wider"
                  >
                    <Copy size={13} strokeWidth={2.5} /> Copiar código
                  </button>
                </div>
              )}

              <TicketDivider />

              <div className="px-8 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Orden No.</span>
                  <span className="font-mono text-sm font-semibold text-neutral-900">#{order.orderNumber}</span>
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
                  <span className="font-mono">{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span className="uppercase tracking-wider">Envío</span>
                  <span className="font-mono">{formatCurrency(order.shippingCost || 0)}</span>
                </div>
                {order.recargoFinanciero > 0 && (
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span className="uppercase tracking-wider">Cargos</span>
                    <span className="font-mono">{formatCurrency(order.recargoFinanciero)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black text-neutral-900 mt-3 pt-3 border-t-2 border-black">
                  <span className="uppercase tracking-widest">Total a Pagar</span>
                  <span className="font-mono tracking-tight text-orange-600">{formatCurrency(order.totalPrice || 0)}</span>
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
                        {order.deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Dirección de Envío'}
                      </span>
                      <span className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                        {shippingAddress.direccion}<br />
                        {shippingAddress.distrito}, {shippingAddress.provincia}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Barcode orderNumber={order.orderNumber} />
            </div>

            <ZigZagBorder />
          </div>
        </div>

        {/* --- Botones de Acción --- */}
        <div className="mt-6 flex flex-col gap-3 px-2">
          {/* Botón Verificar Pago */}
          <Link
            href={`/checkout-result/verifying?orderNumber=${order.orderNumber}`}
            className="w-full flex items-center justify-center gap-2 h-12 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCw size={16} /> Ya pagué, verificar pago
          </Link>

          {/* Botón Volver a la Tienda */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 h-12 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <ShoppingBag size={16} /> Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}