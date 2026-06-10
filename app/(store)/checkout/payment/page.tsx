import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import { FiClock } from "react-icons/fi";
import Image from "next/image";
import CheckoutCulqi from "@/components/checkout/culqi/CheckoutCulqi";
import CheckoutMercadoPago from "@/components/checkout/mercadopago/CheckoutMercadoPago";
import type { TOrder } from "@/src/schemas";

type PaymentPageProps = {
    searchParams: Promise<{ orderId: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { orderId } = await searchParams;

    if (!orderId) redirect("/carrito");

    const order = await getOrder(orderId);
    if (!order) redirect("/carrito");

    const completeOrder = {
        ...order,
        culqiOrderId: order.payment?.culqiOrderId,
    } as TOrder & { culqiOrderId?: string };

    return (
        <div className="max-w-2xl mx-auto bg-background p-6 border-2 border-border-default rounded-2xl">
            {/* Encabezado idéntico en estructura y peso al formulario inicial */}
            <header className="flex flex-col gap-1 mb-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-fg-primary">
                        <FiClock size={16} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-fg-primary">
                        Finalizar tu Pago
                    </h2>
                </div>
            </header>

            <div className="py-2 mb-4">
                <p className="text-sm text-fg-muted">
                    Elige tu método de pago preferido para completar la transacción.
                </p>
            </div>

            {/* Pasarelas de Pago adaptadas al entorno de inputs */}
            <div className="space-y-4">

                {/* Bloque Culqi: Tarjetas de Crédito / Débito, CIP */}
                <div className="rounded-xl border border-border-default p-5 bg-background hover:border-border-hover transition-colors space-y-4">
                    <div className="flex items-center justify-between border-b border-border-default pb-3">
                        <div className="flex items-center gap-2">
                            <Image src="/payments/logoculqi.png" alt="Culqi" width={55} height={20} className="object-contain" />
                        </div>
                        <div className="flex items-center gap-1.5 ">
                            <Image src="/payments/bcp.png" alt="BCP" width={22} height={14} />
                            <Image src="/payments/interbank.png" alt="Interbank" width={22} height={14} />
                            <Image src="/payments/cuotealo.webp" alt="Cuotealo" width={22} height={14} />
                            <Image src="/payments/visa.png" alt="Visa" width={22} height={14} />
                            <Image src="/payments/mastercard.png" alt="Mastercard" width={22} height={14} />
                            <Image src="/payments/yape.png" alt="Yape" width={22} height={14} />
                        </div>
                    </div>
                    <div className="w-full">
                        <CheckoutCulqi order={completeOrder} />
                    </div>
                </div>

                {/* Bloque Mercado Pago: Billeteras Digitales y Efectivo */}
                <div className="rounded-xl border border-border-default p-5 bg-background hover:border-border-hover transition-colors space-y-4">
                    <div className="flex items-center justify-between border-b border-border-default pb-3">
                        <div className="flex items-center gap-2">
                            <Image src="/payments/mercadopago.png" alt="Mercado Pago" width={80} height={20} className="object-contain" />
                        </div>
                        <div className="flex items-center gap-1.5 ">
                            <Image src="/payments/visa.png" alt="Visa" width={22} height={14} />
                            <Image src="/payments/mastercard.png" alt="Mastercard" width={22} height={14} />
                            <Image src="/payments/diners.png" alt="Diners" width={22} height={14} />
                        </div>
                    </div>
                    <div className="w-full">
                        <CheckoutMercadoPago order={completeOrder} />
                    </div>
                </div>

            </div>

        </div>
    );
}