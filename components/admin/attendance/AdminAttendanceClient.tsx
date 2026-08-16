// File: frontend/components/admin/attendance/AdminAttendanceClient.tsx
"use client";

import { useState } from "react";
import { AdminAttendance, AttendanceGlobalStats, AttendanceQuery } from "@/src/schemas/attendance.schema";
import AttendanceFilters from "@/components/admin/attendance/AttendanceFilters";
import AttendanceStats from "@/components/admin/attendance/AttendanceStats";
import AttendanceTable from "@/components/admin/attendance/AttendanceTable";
import DataTablePagination from "@/components/ui/DataTablePagination";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { Eye, EyeOff } from "lucide-react";

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
    const [showMetrics, setShowMetrics] = useState(true);

    return (
        <AdminPageContainer maxWidth="default" spacing="default">
            <AdminPageHeader
                title="Control de Asistencias"
                actions={
                    <AdminButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMetrics((prev) => !prev)}
                        className="flex items-center gap-1.5 cursor-pointer text-xs h-8 border-admin-border"
                    >
                        {showMetrics ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showMetrics ? "Ocultar Métricas y Cálculo" : "Mostrar Métricas y Cálculo"}
                    </AdminButton>
                }
            />

            {/* Métricas y Calculadora con animación suave */}
            {showMetrics && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <AttendanceStats records={records} globalStats={globalStats} />
                </div>
            )}

            {/* Filtros de Rango y Búsqueda */}
            <AttendanceFilters current={query} />

            {/* Tabla con Estilos de Layout Admin */}
            <AdminCardWrapper padding="none">
                <AttendanceTable data={records} />

                {total > 0 && (
                    <div className="p-3 border-t border-admin-border">
                        <DataTablePagination
                            currentPage={page}
                            totalPages={pages}
                            totalItems={total}
                            limit={limit}
                            pathname="/admin/attendance"
                            itemLabel="asistencias"
                        />
                    </div>
                )}
            </AdminCardWrapper>
        </AdminPageContainer>
    );
}