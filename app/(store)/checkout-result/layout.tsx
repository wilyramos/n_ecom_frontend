// File: frontend/app/(store)/checkout-result/layout.tsx
// Layout solo de metadatos: los resultados de pago son páginas privadas
// y no deben indexarse. No añade marcado al DOM.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX_ROBOTS } from "@/lib/site";

export const metadata: Metadata = {
    title: "Resultado de la compra",
    robots: NOINDEX_ROBOTS,
};

export default function CheckoutResultLayout({ children }: { children: ReactNode }) {
    return children;
}
