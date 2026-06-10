import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import SuccessClient from "@/components/checkout/SuccessClient";
import PendingClient from "@/components/checkout/PendingClient";

type ResultadoPageProps = {
    searchParams: Promise<{
        status?: string;
        orderId?: string;
        payment_id?: string;
        collection_status?: string;
        external_reference?: string;
    }>;
};

export default async function ResultadoPage({ searchParams }: ResultadoPageProps) {
    const params = await searchParams;
    const { status, orderId } = params;

    // Validación de seguridad elemental
    if (!orderId) redirect("/carrito");

    const order = await getOrder(orderId);
    if (!order) redirect("/carrito");

    // ── DELEGACIÓN DE FLUJOS SEGÚN EL RETORNO DE MERCADO PAGO ──

    if (status === 'success' || status === 'approved') {
        // Forzamos el estado visual aprobado sincronizado con la redirección inmediata del cliente
        const enrichedOrder = {
            ...order,
            payment: { ...order.payment, status: 'approved' as const }
        };
        return <SuccessClient order={enrichedOrder} />;
    }

    if (status === 'pending' || status === 'in_process') {
        const enrichedOrder = {
            ...order,
            payment: { ...order.payment, status: 'pending' as const }
        };
        return <PendingClient order={enrichedOrder} />;
    }

    // ── CASO DE PAGO FALLIDO / RECHAZADO (FAILURE) ──
    return (
        <div className="flex items-center justify-center px-4 py-20 bg-[var(--color-background)]">
            <div className="w-full max-w-lg p-10 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
                <div className="flex justify-center">
                    <FiAlertCircle className="text-7xl text-red-500 animate-bounce" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                        Pago no completado
                    </h1>
                    <p className="text-sm text-[var(--color-muted-foreground)] tracking-wide">
                        Hubo un problema al procesar tu transacción. Las razones comunes incluyen fondos insuficientes, denegación bancaria o vencimiento de la sesión.
                    </p>
                </div>

                <div className="text-left text-sm text-[var(--color-foreground)] space-y-3 bg-[var(--color-accent)] rounded-xl border border-[var(--color-border)] p-5">
                    <p className="flex justify-between">
                        <span className="text-[var(--color-muted-foreground)]">Número de orden:</span>
                        <span className="font-semibold">{order.orderNumber}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-[var(--color-muted-foreground)]">Total a pagar:</span>
                        <span className="font-semibold">
                            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: order.currency || 'PEN' }).format(order.totalPrice)}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Link
                        href={`/checkout/payment?orderId=${orderId}`}
                        className="w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-primary-foreground)] py-2.5 px-6 rounded-full text-sm font-bold tracking-wide hover:bg-[var(--color-action-primary-hover)] transition flex items-center justify-center gap-2 shadow-sm"
                    >
                        Intentar con otra tarjeta / método
                    </Link>
                    <Link
                        href="/"
                        className="w-full sm:w-auto border border-[var(--color-border)] text-[var(--color-foreground)] py-2.5 px-6 rounded-full text-sm font-medium tracking-wide hover:bg-[var(--color-accent)] transition flex items-center justify-center gap-2"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}