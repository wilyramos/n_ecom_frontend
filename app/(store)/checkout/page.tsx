//File: frontend/app/%28store%29/checkout/page.tsx

import { FiShoppingBag } from "react-icons/fi";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getCurrentUser } from "@/src/auth/currentUser";

export default async function CheckoutPage() {
    // No redirigir si no hay usuario — simplemente pasar null
    const user = await getCurrentUser().catch(() => null);

    return (
        <div className="max-w-2xl mx-auto bg-background p-6 border-2 border-border-default rounded-2xl">
            <header className="flex flex-col gap-1 mb-8 pb-6 border-b border-border-default">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-fg-muted">
                    Paso 01
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-fg-primary">
                        <FiShoppingBag size={16} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-fg-primary">
                        Datos y envío
                    </h2>
                </div>
            </header>

            <CheckoutForm user={user} />
        </div>
    );
}