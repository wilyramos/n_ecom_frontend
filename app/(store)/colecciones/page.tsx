import MaintenanceNotice from '@/components/maintenceNotice'
import React from 'react'
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/site";

// SEO: página en mantenimiento (contenido vacío), no debe indexarse por ahora.
export const metadata: Metadata = {
    title: "Colecciones",
    robots: NOINDEX_ROBOTS,
};

export default function coleccionesPage() {
    return (
        <MaintenanceNotice />
    )
}
