// File: app/(admin)/admin/claims/page.tsx
import { ClaimService } from "@/src/services/claim-service";
import ClaimsTable from "@/components/admin/claims/ClaimsTable";
import ClaimsFilter from "@/components/admin/claims/ClaimsFilter";
import { Suspense } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

interface PageProps {
    searchParams: Promise<{
        estado?: string;
        search?: string;
        page?: string;
    }>;
}

export const metadata = {
    title: "Libro de Reclamaciones - Panel de Administración",
};

export default async function AdminClaimsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const currentEstado = params.estado || undefined;
    const currentSearch = params.search || undefined;

    const response = await ClaimService.getAllAdminClaims({
        estado: currentEstado,
        search: currentSearch,
        page: currentPage,
        limit: 10,
    });

    const breadcrumbs = [
        { label: "Dashboard", href: "/admin" }
    ];

    return (
        <AdminPageWrapper
            title="Libro de Reclamaciones"
            breadcrumbItems={breadcrumbs}
            breadcrumbCurrent="Reclamaciones"
            showBackButton={false}
        >
            <div className="space-y-6">
                <div className="-mt-4 mb-2">
                    <p className="text-sm text-gray-500">
                        Audita, gestiona y responde a las incidencias, quejas y reclamos registrados por tus clientes de manera formal.
                    </p>
                </div>

                {/* Filtros de búsqueda */}
                <ClaimsFilter />

                {/* Tabla con Suspense */}
                <Suspense fallback={<div className="h-40 w-full animate-pulse rounded-xl bg-gray-100 border border-gray-200" />}>
                    <ClaimsTable
                        claims={response.data}
                        total={response.total}
                        page={response.page}
                        pages={response.pages}
                    />
                </Suspense>
            </div>
        </AdminPageWrapper>
    );
}