import { getAdminSections } from "@/src/services/section-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import SectionFiltersComponent from "@/components/admin/sections/SectionFiltersComponent";
import SectionTableList from "@/components/admin/sections/SectionTableList";
import Pagination from "@/components/ui/Pagination";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { SectionType } from "@/src/schemas/section.schema";

interface SearchParams {
    page?: string;
    limit?: string;
    type?: string;
    isActive?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AdminSectionsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));

    // Mapeo controlado de parámetros según los tipos válidos de sección
    const typeFilter = params.type?.trim() as SectionType | undefined;

    // Consumo del servicio del módulo de secciones pasando la paginación para el admin
    const res = await getAdminSections(page, limit);

    const sections = res?.data || [];
    const total = Number(res?.meta?.total ?? 0);
    const pages = Math.max(1, Number(res?.meta?.pages ?? 1));

    return (
        <AdminPageWrapper
            title="Secciones de la Tienda"
            breadcrumbItems={[{ label: "Panel", href: "/admin" }]}
            breadcrumbCurrent="Secciones"
            showBackButton={false}
            actions={
                <Link
                    href="/admin/sections/new"
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Sección
                </Link>
            }
        >
            <div className="space-y-5">
                {/* Filtros adaptados para el tipo de componente y el estado de la sección */}
                <SectionFiltersComponent 
                    filters={{
                        type: typeFilter,
                        isActive: params.isActive
                    }} 
                />

                {/* Tabla/Lista interactiva que soporta ordenamiento e inactivación */}
                <SectionTableList initialSections={sections} />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Mostrando {sections.length} de {total} secciones configuradas
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/sections"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}