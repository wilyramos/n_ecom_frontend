import { redirect } from "next/navigation";
import { obtenerPedidoPorNumero } from "@/src/modules/checkout/services/pedido.service";
import PendingClient from "@/components/checkout/PendingClient";

type SearchParams = Promise<{ orderNumber?: string }>;

export default async function PendingPageCheckout({ searchParams }: { searchParams: SearchParams }) {
    const { orderNumber } = await searchParams;

    if (!orderNumber) {
        redirect('/');
    }

    // Usamos el mismo estándar: buscar por orderNumber
    const order = await obtenerPedidoPorNumero(orderNumber);
    
    if (!order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center py-20 text-sm text-neutral-500">
                Pedido no localizado.
            </div>
        );
    }

    // SSR: Si el usuario vuelve aquí y ya lo pagó en el agente, lo mandamos a éxito.
    if (order.payment.status === 'approved') {
        redirect(`/checkout-result/success/${order.orderNumber}`);
    }
    
    // SSR: Si el CIP venció, lo mandamos a fallo.
    if (order.status === 'canceled') {
        redirect(`/checkout-result/failure?order=${order.orderNumber}`);
    }

    // Renderiza el componente cliente inyectando la data de la orden tipeada
    return <PendingClient order={order} />;
}