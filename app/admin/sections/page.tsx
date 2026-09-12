// File: frontend/app/admin/sections/page.tsx
import { getAdminSections } from "@/src/services/section-service";
import SectionFiltersComponent from "@/components/admin/sections/SectionFiltersComponent";
import SectionTableList from "@/components/admin/sections/SectionTableList";
import SectionPaginationWrapper from "@/components/admin/sections/SectionPaginationWrapper";
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
    const typeFilter = params.type?.trim() as SectionType | undefined;

    const res = await getAdminSections(page, limit);

    const sections = res?.data || [];
    const total = Number(res?.meta?.total ?? 0);
    const pages = Math.max(1, Number(res?.meta?.pages ?? 1));

    return (
        <div className="space-y-6 p-6">
            {/* Header directo */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Secciones de la Tienda
                    </h1>
                  
                </div>

                <Link
                    href="/admin/sections/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Sección
                </Link>
            </div>

            {/* Contenido principal */}
            <div className="space-y-4">
                <SectionFiltersComponent
                    filters={{
                        type: typeFilter,
                        isActive: params.isActive,
                    }}
                />

                <div className="flex flex-col">
                    <SectionTableList initialSections={sections} />

                    {total > 0 && (
                        <SectionPaginationWrapper
                            currentPage={page}
                            totalPages={pages}
                            pageSize={limit}
                            totalItems={total}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}