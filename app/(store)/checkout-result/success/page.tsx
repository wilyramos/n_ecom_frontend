// fILE: frontend/app/%28store%29/checkout-result/success/page.tsx

import SuccessClient from "@/components/checkout/SuccessClient";
import { getOrder } from "@/src/services/orders";

type SearchParams = Promise<{ orderId?: string }>;

export default async function SuccessPageCheckout({ searchParams }: { searchParams: SearchParams }) {
    const { orderId } = await searchParams;
    
    if (!orderId) return <div className="text-center py-20 text-sm">Identificador del pedido ausente.</div>;

    const order = await getOrder(orderId);
    if (!order) return <div className="text-center py-20 text-sm">Pedido no localizado.</div>;

    return <SuccessClient order={order} />;
}