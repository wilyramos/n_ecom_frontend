// File: frontend/app/admin/attendance/page.tsx

import { AttendanceService } from "@/src/services/attendance.service";
import { AttendanceQuery, AdminAttendance } from "@/src/schemas/attendance.schema";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import AttendanceFilters from "@/components/admin/attendance/AttendanceFilters";
import AttendanceStats from "@/components/admin/attendance/AttendanceStats";
import AttendanceTable from "@/components/admin/attendance/AttendanceTable";
import Pagination from "@/components/ui/Pagination";

interface SearchParams {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    search?: string; // <-- Asegurar que esté definido en la interfaz
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AdminAttendancePage({ searchParams }: PageProps) {
    // 1. Resolver la promesa de los parámetros de búsqueda de la URL
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));

    // 2. Construir la query combinando el tipado base y agregando la propiedad 'search'
    const query: AttendanceQuery & { search?: string } = {
        page,
        limit,
        startDate: params.startDate?.trim() || undefined,
        endDate: params.endDate?.trim() || undefined,
        search: params.search?.trim() || undefined, // <-- El error estaba aquí, faltaba capturarlo e incluirlo
    };

    let records: AdminAttendance[] = [];
    let total = 0;
    let pages = 1;

    const hasInvalidRange = query.startDate && query.endDate && new Date(query.startDate) > new Date(query.endDate);

    if (!hasInvalidRange) {
        // 3. Ahora el objeto query lleva el parámetro 'search' hacia 'AttendanceService.getAdminReport'
        const res = await AttendanceService.getAdminReport(query).catch((error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            console.error('[AdminAttendancePage]', errorMessage);
            return null;
        });

        if (res) {
            records = res.data;
            total = res.meta.total;
            pages = Math.max(1, res.meta.pages);
        }
    }

    return (
        <AdminPageWrapper title="Asistencias" showBackButton={false}>
            <div className="space-y-6">
                <AttendanceStats records={records} />

                <AttendanceFilters current={query} />

                <div className="">
                    <AttendanceTable data={records} />
                </div>

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Mostrando {records.length} de {total} registros
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/attendance"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}