//File: frontend/app/%28store%29/checkout/page.tsx

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getCurrentUser } from "@/src/auth/currentUser";

export default async function CheckoutPage() {
    // No redirigir si no hay usuario — simplemente pasar null
    const user = await getCurrentUser().catch(() => null);

    return (
        <div className="max-w-2xl mx-auto p-4">
          

            <CheckoutForm user={user} />
        </div>
    );
}