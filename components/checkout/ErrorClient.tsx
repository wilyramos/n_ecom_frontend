import Link from "next/link";
import { FiAlertCircle, FiShoppingCart, FiHome } from "react-icons/fi";

type ErrorClientProps = {
    errorMessage?: string;
    orderId?: string;
};

export default function ErrorClient({ errorMessage, orderId }: ErrorClientProps) {
    return (
        <div className="flex items-center justify-center px-4 py-20 min-h-screen bg-[var(--color-bg-primary)]">
            <div className="w-full max-w-lg bg-[var(--color-bg-tertiary)] shadow-sm rounded-3xl p-10 text-center border border-[var(--color-error)]/20">
                <FiAlertCircle className="text-[var(--color-error)] text-7xl mx-auto mb-6 animate-pulse" />

                <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-2 flex items-center justify-center gap-2">
                    ¡Algo salió mal!
                </h1>

                <p className="text-[var(--color-text-secondary)] text-sm mb-8 tracking-wide">
                    {errorMessage || 'No pudimos procesar tu pago o hubo un problema con tu orden.'}
                    <br />
                    Por favor, revisa los detalles e intenta nuevamente.
                </p>

                {orderId && (
                    <p className="text-left text-sm text-[var(--color-text-primary)] mb-6 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
                        <span className="font-medium text-[var(--color-text-secondary)]">ID de Orden:</span> {orderId}
                    </p>
                )}

                {/* Acciones */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/checkout"
                        className="w-full sm:w-auto bg-[var(--color-error)] text-[var(--color-text-inverse)] py-2.5 px-6 rounded-full text-sm font-medium tracking-wide hover:bg-[var(--color-error)]/90 transition flex items-center justify-center gap-2 shadow-md"
                    >
                        <FiShoppingCart className="text-lg" />
                        Volver al Carrito
                    </Link>
                    <Link
                        href="/"
                        className="w-full sm:w-auto border border-[var(--color-border-strong)] text-[var(--color-text-primary)] py-2.5 px-6 rounded-full text-sm tracking-wide hover:bg-[var(--color-surface-hover)] transition flex items-center justify-center gap-2"
                    >
                        <FiHome className="text-lg" />
                        Ir al Inicio
                    </Link>
                </div>

                <div className="mt-10 pt-6 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-tertiary)]">
                    Si el problema persiste, por favor,{" "}
                    <a href="mailto:soporte@neoshopimportaciones.com" className="text-[var(--color-action-primary)] hover:underline">
                        contacta a soporte
                    </a>.
                    <br className="mb-2" />
                    O vía WhatsApp al{" "}
                    <a href="https://wa.me/51925054636" className="text-[var(--color-action-primary)] font-medium hover:underline">
                        +51 925054636
                    </a>.
                </div>
            </div>
        </div>
    );
}