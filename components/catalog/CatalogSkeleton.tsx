import { cn } from "@/lib/utils";

// Sub-componente para animar bloques grises
function Skeleton({ className }: { className?: string }) {
    return <div className={cn("animate-pulse bg-gray-200 ", className)} />;
}

export default function CatalogSkeleton() {
    return (
        <div className="container mx-auto px-4 md:px-6 max-w-7xl pb-20">

            {/* 1. Header Skeleton */}
            <div className="pt-8 flex flex-col gap-6 pb-6 border-b border-gray-100">
                {/* Breadcrumbs */}
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                </div>

                {/* Title & Sort */}
                <div className="flex justify-between items-end">
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-64 md:w-96 " /> {/* Título H1 */}
                        <Skeleton className="h-4 w-32" /> {/* Contador */}
                    </div>
                    <Skeleton className="h-10 w-40 hidden sm:block" /> {/* Select Sort */}
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 mt-8 relative">

                {/* 2. Sidebar Skeleton (Desktop) */}
                <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-8">
                    {/* Bloque Categorías */}
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-24 mb-4" /> {/* Título Filtro */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>

                    {/* Bloque Precio */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <Skeleton className="h-5 w-20 mb-4" />
                        <Skeleton className="h-6 w-full" />
                    </div>

                    {/* Bloque Marcas */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <Skeleton className="h-5 w-24 mb-4" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={`brand-${i}`} className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 " />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* 3. Main Content Skeleton */}
                <main className="lg:col-span-9 xl:col-span-10 flex flex-col gap-8">

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-9 w-28 rounded-full" />
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                {/* Imagen Card */}
                                <Skeleton className="aspect-[3/4] w-full" />
                                {/* Info Card */}
                                <div className="space-y-2 mt-1 px-1">
                                    <Skeleton className="h-3 w-16" /> {/* Brand */}
                                    <Skeleton className="h-4 w-full" /> {/* Title Line 1 */}
                                    <Skeleton className="h-4 w-2/3" />  {/* Title Line 2 */}
                                    <div className="flex gap-2 pt-1">
                                        <Skeleton className="h-5 w-20" /> {/* Price */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}