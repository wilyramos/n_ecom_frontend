// File: frontend/components/admin/attendance/AdminAttendanceClient.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Fingerprint } from "lucide-react";

import {
    AdminAttendance,
    AttendanceGlobalStats,
    AttendanceQuery,
} from "@/src/schemas/attendance.schema";
import AttendanceFilters from "@/components/admin/attendance/AttendanceFilters";
import AttendanceStats from "@/components/admin/attendance/AttendanceStats";
import AttendanceTable from "@/components/admin/attendance/AttendanceTable";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import { AdminTablePagination } from "@/src/components/admin/layout/admin-table-pagination";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

interface AdminAttendanceClientProps {
    records: AdminAttendance[];
    total: number;
    pages: number;
    page: number;
    limit: number;
    globalStats: AttendanceGlobalStats;
    query: AttendanceQuery & { search?: string };
}

export default function AdminAttendanceClient({
    records,
    total,
    pages,
    page,
    limit,
    globalStats,
    query,
}: AdminAttendanceClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showMetrics, setShowMetrics] = useState(true);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageSizeChange = (newLimit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", String(newLimit));
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            {/* Barra de Acciones Superior */}
            <AdminActionBar
                leftContent={
                    <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-semibold text-zinc-900">
                            Asistencias Registradas
                        </span>
                        <span className="text-[11px] text-slate-400">
                            ({total} registros encontrados)
                        </span>
                    </div>
                }
            >
                <AdminButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMetrics((prev) => !prev)}
                    icon={showMetrics ? EyeOff : Eye}
                >
                    {showMetrics ? "Ocultar Métricas" : "Mostrar Métricas"}
                </AdminButton>
            </AdminActionBar>

            {/* Métricas y Calculadora de Horas */}
            {showMetrics && (
                <AttendanceStats records={records} globalStats={globalStats} />
            )}

            {/* Filtros Integrados de Rango y Búsqueda */}
            <AttendanceFilters current={query} />

            {/* Tabla Principal con Paginador Oficial */}
            <AdminCardWrapper padding="none">
                <AttendanceTable data={records} />

                <AdminTablePagination
                    currentPage={page}
                    totalPages={pages}
                    pageSize={limit}
                    totalItems={total}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </AdminCardWrapper>
        </AdminPageContainer>
    );
}