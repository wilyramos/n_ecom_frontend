// File: frontend/app/admin/attendance/page.tsx

import { AttendanceService } from "@/src/services/attendance.service";
import { AttendanceQuery, AdminAttendance, AttendanceGlobalStats } from "@/src/schemas/attendance.schema";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import AttendanceFilters from "@/components/admin/attendance/AttendanceFilters";
import AttendanceStats from "@/components/admin/attendance/AttendanceStats";
import AttendanceTable from "@/components/admin/attendance/AttendanceTable";
import DataTablePagination from "@/components/ui/DataTablePagination";

interface SearchParams {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AdminAttendancePage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));

    const query: AttendanceQuery & { search?: string } = {
        page,
        limit,
        startDate: params.startDate?.trim() || undefined,
        endDate: params.endDate?.trim() || undefined,
        search: params.search?.trim() || undefined,
    };

    let records: AdminAttendance[] = [];
    let total = 0;
    let pages = 1;
    let globalStats: AttendanceGlobalStats = {
        globalWorkHours: 0,
        globalTotalRecords: 0,
        globalActiveDays: 0
    };

    const hasInvalidRange = query.startDate && query.endDate && new Date(query.startDate) > new Date(query.endDate);

    if (!hasInvalidRange) {
        const res = await AttendanceService.getAdminReport(query).catch((error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            console.error('[AdminAttendancePage]', errorMessage);
            return null;
        });

        if (res) {
            records = res.data;
            total = res.meta.total;
            pages = Math.max(1, res.meta.pages);
            globalStats = res.stats;
        }
    }

    return (
        <AdminPageWrapper title="Asistencias" showBackButton={false}>
            <div className="space-y-6">
                <AttendanceStats records={records} globalStats={globalStats} />

                <AttendanceFilters current={query} />

                <div className="">
                    <AttendanceTable data={records} />
                </div>

                {total > 0 && (
                    <DataTablePagination
                        currentPage={page}
                        totalPages={pages}
                        totalItems={total}
                        limit={limit}
                        pathname="/admin/attendance"
                        itemLabel="asistencias"
                    />
                )}
            </div>
        </AdminPageWrapper>
    );
}