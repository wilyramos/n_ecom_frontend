import { SaleService, SaleFilters } from "@/src/services/sale-service";
import { SalesTable } from "@/src/components/sales/sales-table";
import { SalesFilters } from "@/src/components/sales/sales-filters";
import Pagination from "@/components/ui/Pagination";

interface SalesPageProps {
    searchParams: Promise<SaleFilters>;
}

export default async function SalesPage({ searchParams }: SalesPageProps) {
    const filters = await searchParams;

    const {
        sales,
        totalPages,
        currentPage,
        total
    } = await SaleService.getHistory(filters);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground">
            {/* Filtros y Exportación */}
            <SalesFilters />

            {/* Contenedor de Tabla */}
            <div className="flex flex-col rounded-sm border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <SalesTable initialData={sales} />
                </div>

                {/* Footer con Paginación e información */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted border-t border-border">
                    <div className="hidden sm:block">
                        <p className="text-xs text-muted-foreground font-medium">
                            Página <span className="font-bold text-foreground">{currentPage}</span> de {totalPages}
                        </p>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={Number(filters.limit) || 10}
                        pathname="/sales"
                    />
                    <div className="hidden sm:block">
                        <p className="text-xs text-muted-foreground font-medium">
                            Total de ventas: <span className="font-bold text-foreground">{total}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}