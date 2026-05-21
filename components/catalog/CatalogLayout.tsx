"use client";

import type { CatalogResponse } from "@/src/schemas/catalog";
import CatalogHeader from "./CatalogHeader";
import CatalogMobileFilters from "./CatalogMobileFilters";
import CatalogSidebar from "./CatalogSidebar";
import CatalogGrid from "./CatalogGrid";
import CatalogPagination from "./CatalogPagination";

interface CatalogLayoutProps {
    products: CatalogResponse['products'];
    filters: CatalogResponse['filters'];
    pagination: CatalogResponse['pagination'];
    context: CatalogResponse['context'];
    isFallback: boolean;
}

export default function CatalogLayout({
    products,
    filters,
    pagination,
    context,
    isFallback
}: CatalogLayoutProps) {
    const getTitle = () => {
        if (context.searchQuery) {
            return `Resultados para "${context.searchQuery}"`;
        }

        const parts = [];
        if (context.lineName) parts.push(context.lineName);
        if (context.brandName) parts.push(context.brandName);
        if (context.categoryName) parts.push(context.categoryName);

        return parts.length > 0 ? parts.join(" / ") : "Catálogo";
    };

    const breadcrumbs = [
        { label: "Inicio", href: "/" },
        { label: "Catálogo", href: "/catalogo" },
    ];

    if (context.categoryName) breadcrumbs.push({ label: context.categoryName, href: "#" });
    if (context.brandName) breadcrumbs.push({ label: context.brandName, href: "#" });
    if (context.lineName) breadcrumbs.push({ label: context.lineName, href: "#" });

    return (
        <section className="min-h-screen bg-surface-primary max-w-7xl mx-auto pt-4">
            {/* HEADER SECTION */}
            <div className="container mx-auto px-4 md:px-6">
                <CatalogHeader
                    title={getTitle()}
                    totalProducts={pagination.totalItems}
                    breadcrumbs={breadcrumbs}
                    filters={filters} // Pasamos los filtros para el Drawer móvil
                />
            </div>

            {/* MOBILE STICKY FILTER BAR */}
            <div
                className="
        lg:hidden
        sticky
        top-[70px]
        z-20
        bg-surface-primary/95
        backdrop-blur-md
        border-b border-border-default
    "
            >
                <div className="container mx-auto px-4 md:px-6 py-2">
                    <CatalogMobileFilters filters={filters} />
                </div>
            </div>

            {/* MAIN CONTENT - Grid Layout */}
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex gap-6 lg:gap-8">

                    {/* DESKTOP SIDEBAR */}
                    <aside className="hidden lg:block lg:w-44 xl:w-64 flex-shrink-0">
                        <div className="sticky top-36">
                            <CatalogSidebar filters={filters} />
                        </div>
                    </aside>

                    {/* MAIN GRID AREA */}
                    <main className="flex-1 min-w-0">
                        <CatalogGrid products={products} isFallback={isFallback} />

                        {!isFallback && pagination.totalPages > 1 && (
                            <div className="mt-12 pt-8 border-t border-border-default">
                                <CatalogPagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
}