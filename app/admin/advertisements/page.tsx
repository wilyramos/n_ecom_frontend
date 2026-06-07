import { AdvertisementService } from "@/src/services/advertisement-service";
import { verifySession } from "@/src/auth/dal";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import AdvertisementFiltersComponent from "@/components/admin/advertisements/AdvertisementFiltersComponent";
import AdvertisementTableList from "@/components/admin/advertisements/AdvertisementTableList";
import Pagination from "@/components/ui/Pagination";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { AdLayout } from "@/src/schemas/advertisement.schema";

interface SearchParams {
    page?: string;
    limit?: string;
    layout?: string;
    isActive?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AdminAdvertisementsPage({ searchParams }: PageProps) {
    const session = await verifySession();
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));

    // Mapeo controlado de parámetros según los tipos válidos de layout de avisos
    const layoutFilter = params.layout?.trim() as AdLayout | undefined;

    // Consumo del servicio pasando token de sesión y parámetros de paginación para el admin
    const res = await AdvertisementService.getAllPaginated(page, limit, session.token);

    const advertisements = res?.data || [];
    const total = Number(res?.meta?.total ?? 0);
    const pages = Math.max(1, Number(res?.meta?.pages ?? 1));

    return (
        <AdminPageWrapper
            title="Campañas y Avisos Publicitarios"
            breadcrumbItems={[{ label: "Panel", href: "/admin" }]}
            breadcrumbCurrent="Avisos"
            showBackButton={false}
            actions={
                <Link
                    href="/admin/advertisements/create"
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Campaña
                </Link>
            }
        >
            <div className="space-y-5">
                {/* Filtros adaptados para el tipo de renderizado (layout) y estado del anuncio */}
                <AdvertisementFiltersComponent 
                    filters={{
                        layout: layoutFilter,
                        isActive: params.isActive
                    }} 
                />

                {/* Tabla/Lista interactiva que soporta alternado de estado (on/off) y eliminación */}
                <AdvertisementTableList 
                    initialAds={advertisements} 
                />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Mostrando {advertisements.length} de {total} anuncios configurados
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/advertisements"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}