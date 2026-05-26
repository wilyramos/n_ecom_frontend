import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import PaymentMethodsAccordion from "@/components/checkout/PaymentMethodsAccordion";
import { FiCreditCard } from "react-icons/fi";

type PaymentPageProps = {
  searchParams: Promise<{ orderId: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/checkout");

  const order = await getOrder(orderId);
  if (!order) return <p className="text-center py-10 text-fg-muted">Orden no encontrada o acceso denegado</p>;
  if (order.payment.status === "approved") return <p className="text-center py-10 text-fg-muted">Pago ya realizado</p>;

  return (
    <div className="max-w-2xl mx-auto bg-background p-6 md:p-10 border-2 border-border-default rounded-2xl">
      <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-border-default">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-fg-muted">
          Paso 02
        </span>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-fg-primary">
            <FiCreditCard size={16} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-fg-primary">
            Método de pago
          </h2>
        </div>
      </div>

      <PaymentMethodsAccordion order={order} />
    </div>
  );
}