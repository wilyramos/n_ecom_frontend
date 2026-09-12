// File: app/(admin)/admin/slider/page.tsx
import { SliderService } from "@/src/services/slider-service";
import NuevoBanner       from "@/components/admin/slider/NuevoBanner";
import SliderFilters     from "@/components/admin/slider/SliderFilters";
import SliderTable       from "@/components/admin/slider/SliderTable";
import Pagination        from "@/components/ui/Pagination";

interface SearchParams {
    page?:     string;
    limit?:    string;
    search?:   string;
    isActive?: string;
    layout?:   string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function SliderPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page   = Math.max(1, Number(params.page ?? 1));
    const limit  = Math.max(1, Number(params.limit ?? 10));
    const search = params.search?.trim() || undefined;
    const layout = params.layout?.trim() || undefined;
    const isActive =
        params.isActive === "true"  ? true  :
        params.isActive === "false" ? false :
        undefined;

    const { data: banners, total, pages } = await SliderService.getAllAdmin({
        page,
        limit,
        search,
        isActive,
        ...(layout ? { layout } : {}),
    });

    return (
        <div className="space-y-6 p-6">
            {/* Header directo */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Slider Banners
                    </h1>
                   
                </div>
                <NuevoBanner />
            </div>

            {/* Contenido principal */}
            <div className="space-y-5">
                <SliderFilters
                    filters={{
                        search:   params.search,
                        isActive: params.isActive,
                        layout:   params.layout,
                    }}
                />

                <SliderTable banners={banners} />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-200">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                            Mostrando {banners.length} de {total} banners
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/slider"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}