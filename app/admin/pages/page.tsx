// File: frontend/app/admin/pages/page.tsx

import React from 'react';
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageService } from "@/src/services/page-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageFiltersComponent from "@/components/admin/pages/PageFiltersComponent";
import PageTableList from '@/components/admin/pages/PageTableList';
import Pagination from "@/components/ui/Pagination";
import { PagesQuerySchema } from "@/src/schemas/page.schema";

interface SearchParams {
    page?: string;
    limit?: string;
    isActive?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AdminPagesPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));

    // Validación controlada de los parámetros de consulta con el esquema del frontend
    const queryParsed = PagesQuerySchema.parse({
        page,
        limit,
    });

    const res = await PageService.getAllPages(queryParsed);

    const pagesData = res?.data || [];
    const total = Number(res?.meta?.total ?? 0);
    const totalPages = Math.max(1, Number(res?.meta?.pages ?? 1));

    // Filtrado adaptativo en servidor opcional (en caso de que tu backend no procese isActive en el listado completo)
    const filteredPages = params.isActive 
        ? pagesData.filter(p => String(p.isActive) === params.isActive)
        : pagesData;

    return (
        <AdminPageWrapper
            title="Páginas de contenido"
            showBackButton={false}
            actions={
                <Link
                    href="/admin/pages/create"
                    className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Página
                </Link>
            }
        >
            <div className="space-y-5">
                {/* Componente controlado de filtros nativos URL */}
                <PageFiltersComponent 
                    filters={{
                        isActive: params.isActive
                    }} 
                />

                {/* Listado estructural interactivo con soporte de estados */}
                <PageTableList 
                    initialPages={filteredPages} 
                />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-zinc-100">
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                            Mostrando {filteredPages.length} de {total} páginas configuradas
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            limit={limit}
                            pathname="/admin/pages"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}