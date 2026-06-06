// File: frontend/app/(store)/checkout/payment/page.tsx
import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import { FiClock } from "react-icons/fi";
import CheckoutCulqi from "@/components/checkout/culqi/CheckoutCulqi";
import type { TOrder } from "@/src/schemas";

type PaymentPageProps = {
  searchParams: Promise<{ orderId: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/carrito");
  }

  const order = await getOrder(orderId);

  if (!order) {
    redirect("/carrito");
  }

  const completeOrder = {
    ...order,
    culqiOrderId: order.payment?.culqiOrderId
  } as TOrder & { culqiOrderId?: string };

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 bg-surface-primary border-border-default rounded-3xl shadow-sm text-foreground border-2">
      <div className="text-center space-y-3 pb-6 border-b border-border-default">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl"
          style={{ backgroundColor: 'rgba(167, 199, 170, 0.15)', color: 'var(--color-brand-action, #a7c7aa)' }}
        >
          <FiClock />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Finalizar tu Pago</h1>
       
      </div>

      <div className="py-12 text-center space-y-2">
        <p className="text-sm text-fg-muted">
          Puedes pagar usando Tarjetas de Crédito/Débito, Yape, PagoEfectivo, Banca Móvil o Códigos QR.
        </p>
      </div>

      <div className="pt-6 border-t border-border-default flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <CheckoutCulqi order={completeOrder} />
        </div>
      </div>
    </div>
  );
}