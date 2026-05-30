//File: frontend/components/checkout/mercadopago/CheckoutProMP.tsx

'use client'

import { useState } from "react";
import { createMPPreferenceWithOrderId } from "@/actions/checkout/create-mp-preference-orderid.ts";
import { Button } from "@/components/ui/button";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { GoLinkExternal } from "react-icons/go";

export default function CheckoutProMP({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);

      const initPoint = await createMPPreferenceWithOrderId(orderId);

      if (initPoint) {
        window.location.href = initPoint;
      } else {
        setError("No se pudo obtener el enlace de pago.");
      }
    } catch (err) {
      console.error("❌ Error al crear preferencia MP:", err);
      setError("Error al conectar con Mercado Pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-3 mt-3">
      <Button
        onClick={handlePay}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg py-2 transition-all cursor-pointer"
      >
        {loading ? (
          <>
            <SpinnerLoading />
            <span>Procesando pago...</span>
          </>
        ) : (
          <>
            <GoLinkExternal size={18} />
            <span>Pagar Ahora</span>
          </>
        )}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
