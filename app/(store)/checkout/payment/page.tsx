// File: frontend/app/(shop)/checkout/payment/page.tsx
import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import type { TOrder } from "@/src/schemas";
// import CheckoutCulqi from "@/components/checkout/culqi/CheckoutCulqi";
import CheckoutMercadoPago from "@/components/checkout/mercadopago/CheckoutMercadoPago";
import PaymentAccordionClient from "@/components/checkout/PaymentAccordionClient";

type PaymentPageProps = {
    searchParams: Promise<{ orderId: string; method?: string }>;
};

const CULQI_TRANSACTION_FEE = 0.037;

// Constantes matemáticas exactas de Mercado Pago con IGV (18%) incluido
const MP_FIXED_FEE_WITH_IGV = 1.18; // S/ 1.00 + 18% IGV
const MP_TOTAL_PERCENTAGE_FEE_WITH_IGV = 0.164964; // (3.49% + 10.49%) * 1.18

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { orderId, method } = await searchParams;

    if (!orderId) redirect("/carrito");

    const order = await getOrder(orderId);
    if (!order) redirect("/carrito");

    const normalizedOrder: TOrder = {
        ...order,
        user: typeof order.user === "object" && order.user !== null
            ? order.user._id ?? undefined
            : order.user ?? undefined,
    };

    // Cálculos de pasarela
    const culqiTotal = order.totalPrice * (1 + CULQI_TRANSACTION_FEE);

    // Aplicación de la fórmula reversa para Mercado Pago
    const mercadopagoTotal = (order.totalPrice + MP_FIXED_FEE_WITH_IGV) / (1 - MP_TOTAL_PERCENTAGE_FEE_WITH_IGV);

    // const completeCulqiOrder = {
    //     ...normalizedOrder,
    //     totalPrice: culqiTotal,
    //     culqiOrderId: order.payment?.culqiOrderId,
    // } as TOrder & { culqiOrderId?: string };

    const completeMPOrder = {
        ...normalizedOrder,
        totalPrice: mercadopagoTotal,
    } as TOrder;

    const waMessage = encodeURIComponent(
        `Hola, quisiera hacer el pago del pedido #${order.orderNumber} por S/ ${order.totalPrice.toFixed(2)}.`
    );

    return (
        <PaymentAccordionClient
            orderId={orderId}
            orderTotalPrice={order.totalPrice}
            culqiTotal={culqiTotal}
            mercadopagoTotal={mercadopagoTotal}
            waMessage={waMessage}
            currentMethod={method || "transferencia"}
            // checkoutCulqiComponent={<CheckoutCulqi order={completeCulqiOrder} />}
            checkoutMercadoPagoComponent={<CheckoutMercadoPago order={completeMPOrder} />}
        />
    );
}