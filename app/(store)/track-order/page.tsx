import MaintenanceNotice from '@/components/maintenceNotice'
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/site";

// SEO: página en mantenimiento (contenido vacío), no debe indexarse por ahora.
export const metadata: Metadata = {
    title: "Seguimiento de pedido",
    robots: NOINDEX_ROBOTS,
};

export default function page() {
    return (
        <MaintenanceNotice />
    )
}
