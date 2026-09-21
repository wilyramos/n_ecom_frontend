// File: app/(admin)/admin/claims/page.tsx
import { Suspense } from "react";
import { ClaimService } from "@/src/services/claim-service";
import ClaimsTable from "@/components/admin/claims/ClaimsTable";
import ClaimsFilter from "@/components/admin/claims/ClaimsFilter";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";

interface PageProps {
    searchParams: Promise<{
        estado?: string;
        search?: string;
        page?: string;
        limit?: string;
    }>;
}

export const metadata = {
    title: "Libro de Reclamaciones - Panel de Administración",
};

export default async function AdminClaimsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const currentLimit = params.limit ? parseInt(params.limit, 10) : 10;
    const currentEstado = params.estado || undefined;
    const currentSearch = params.search || undefined;

    const response = await ClaimService.getAllAdminClaims({
        estado: currentEstado,
        search: currentSearch,
        page: currentPage,
        limit: currentLimit,
    });

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            {/* Barra de Filtros Integrada */}
            <ClaimsFilter />

            {/* Tabla y Paginación */}
            <Suspense
                fallback={
                    <div className="h-64 w-full animate-pulse rounded-xl bg-slate-100 border border-slate-200" />
                }
            >
                <ClaimsTable
                    claims={response.data || []}
                    total={response.total || 0}
                    page={response.page || 1}
                    pages={response.pages || 1}
                    limit={currentLimit}
                />
            </Suspense>
        </AdminPageContainer>
    );
}