"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

const PrinterHeader = () => (
  <div className="relative z-20 bg-[#1c1c1e] rounded-t-2xl p-4 pb-2 shadow-xl mx-auto w-[100%]">
    <div className="flex justify-between items-center mb-3 px-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-semibold">
        NEOSHOP
      </span>
      <div className="flex items-center gap-1.5">
        <Loader2 size={10} className="animate-spin text-blue-400" />
        <span className="text-[10px] text-blue-400 uppercase tracking-widest font-mono">Verificando</span>
      </div>
    </div>
    <div className="w-full h-2.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-b border-neutral-700/50 relative z-30" />
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

type Params = { [key: string]: string | string[] | undefined };

export default function VerifyingPageCheckout({ searchParams }: { searchParams: Promise<Params> }) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const orderNumber = typeof resolvedSearchParams.orderNumber === "string" ? resolvedSearchParams.orderNumber : null;

  const [message, setMessage] = useState("Confirmando estado de la transacción de forma segura...");
  const attemptsRef = useRef(0);
  const maxAttempts = 6;

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const pollStatus = async () => {
      attemptsRef.current += 1;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/tracking/${orderNumber}`, {
          cache: "no-store",
        });

        // 🛑 SI EL PEDIDO NO EXISTE EN BD (404), CORTAR DE INMEDIATO
        if (res.status === 404) {
          stopPolling();
          setMessage("El pedido solicitado no existe o no fue encontrado.");
          router.push(`/checkout-result/failure?order=${orderNumber}&reason=not_found`);
          return;
        }

        if (!res.ok) {
          if (attemptsRef.current >= maxAttempts) {
            stopPolling();
            router.push(`/checkout-result/failure?order=${orderNumber}`);
          }
          return;
        }

        const data = await res.json();
        const order = data?.data;

        if (!order) {
          if (attemptsRef.current >= maxAttempts) {
            stopPolling();
            router.push(`/checkout-result/failure?order=${orderNumber}`);
          }
          return;
        }

        const status = order.status;
        const paymentStatus = order.payment?.status;

        // 1. PAGO APROBADO DEFINITIVO
        if (paymentStatus === "approved" || status === "processing" || status === "paid_but_out_of_stock") {
          stopPolling();
          setMessage("¡Pago confirmado con éxito!");
          router.push(`/checkout-result/success/${order.orderNumber}`);
          return;
        }

        // 2. PAGO RECHAZADO / CANCELADO
        if (paymentStatus === "rejected" || paymentStatus === "refunded" || status === "canceled") {
          stopPolling();
          setMessage("La operación ha sido declinada por el banco.");
          router.push(`/checkout-result/failure?order=${order.orderNumber}`);
          return;
        }

        // 3. PENDIENTE DE PAGO (PagoEfectivo / CIP)
        if (paymentStatus === "pending" && order.payment?.paymentCode) {
          stopPolling();
          setMessage("Código de pago generado con éxito.");
          router.push(`/checkout-result/pending?orderNumber=${order.orderNumber}`);
          return;
        }

      } catch (err) {
        console.error("❌ [Verifying] Fallo de conexión en polling:", err);
      }

      // Límite de intentos alcanzado
      if (attemptsRef.current >= maxAttempts) {
        stopPolling();
        router.push(`/checkout-result/failure?order=${orderNumber}`);
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 2500);

    return () => stopPolling();
  }, [orderNumber, router]);

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center py-6 px-4 font-sans selection:bg-neutral-900 selection:text-white">
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
            <div className="bg-white pt-10 pb-6 rounded-b-none overflow-hidden">
              <div className="px-8 flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                  <ShieldCheck size={28} strokeWidth={2.5} className="text-blue-600" />
                </div>

                <h1 className="text-xl font-bold tracking-widest text-neutral-900 uppercase font-mono">
                  Validando...
                </h1>

                <p className="text-xs text-neutral-500 mt-4 leading-relaxed max-w-[260px]">
                  {message}
                </p>
              </div>

              <Barcode orderNumber={orderNumber || "000000000000"} />
            </div>
            <ZigZagBorder />
          </div>
        </div>
      </div>
    </main>
  );
}