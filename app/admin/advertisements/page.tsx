// File: frontend/app/admin/advertisements/page.tsx

import Link from "next/link";
import { Plus } from "lucide-react";
import { AdvertisementService } from "@/src/services/advertisement-service";
import { verifySession } from "@/src/auth/dal";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import AdvertisementFiltersComponent from "@/components/admin/advertisements/AdvertisementFiltersComponent";
import AdvertisementTableList from "@/components/admin/advertisements/AdvertisementTableList";
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

    const layoutFilter = params.layout?.trim() as AdLayout | undefined;

    const res = await AdvertisementService.getAllPaginated(page, limit, session.token);

    const advertisements = res?.data || [];
    const total = Number(res?.meta?.total ?? 0);
    const totalPages = Math.max(1, Number(res?.meta?.pages ?? 1));

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            <AdminActionBar
                leftContent={
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900">
                            Campañas y Avisos Publicitarios
                        </span>
                        <span className="text-[11px] text-zinc-400 font-medium">
                            ({total} totales)
                        </span>
                    </div>
                }
            >
                <Link
                    href="/admin/advertisements/create"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5 stroke-[2]" />
                    <span>Nueva Campaña</span>
                </Link>
            </AdminActionBar>

            <AdminCardWrapper padding="none" className="border-zinc-200/80 shadow-2xs">
                <AdvertisementFiltersComponent
                    filters={{
                        layout: layoutFilter,
                        isActive: params.isActive,
                    }}
                />

                <AdvertisementTableList
                    initialAds={advertisements}
                    pagination={{
                        currentPage: page,
                        totalPages,
                        pageSize: limit,
                        totalItems: total,
                    }}
                />
            </AdminCardWrapper>
        </AdminPageContainer>
    );
}