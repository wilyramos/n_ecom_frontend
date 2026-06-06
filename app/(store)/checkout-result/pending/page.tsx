import { getOrder } from "@/src/services/orders";
import PendingClient from "@/components/checkout/PendingClient";

type SearchParams = Promise<{ orderId?: string }>;

export default async function PendingPageCheckout({ searchParams }: { searchParams: SearchParams }) {
    const { orderId } = await searchParams;

    if (!orderId) return <div className="text-center py-20 text-sm">Identificador del pedido ausente.</div>;

    const order = await getOrder(orderId);
    if (!order) return <div className="text-center py-20 text-sm">Pedido no localizado.</div>;

    return <PendingClient order={order} />;
}