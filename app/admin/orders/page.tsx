// File: frontend/app/admin/orders/page.tsx
import { getOrders } from "@/src/services/orders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import DataTablePagination from "@/components/ui/DataTablePagination";
import OrdersTableFilters from "@/components/admin/orders/OrdersTableFilters";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

type PageOrdersProps = {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        pedido?: string;
        fecha?: string;
        fechaFin?: string;
        estadoPago?: string;
        estadoEnvio?: string;
        montoMin?: string;
        montoMax?: string;
    }>;
};

function getTodayDateString(): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    return `${year}-${month}-${day}`;
}

export default async function pageOrders({ searchParams }: PageOrdersProps) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10; // Cambiado a 10 por defecto

    const fecha = params.fecha ?? getTodayDateString();

    const data = await getOrders({
        page,
        limit,
        pedido: params.pedido,
        fecha,
        fechaFin: params.fechaFin,
        estadoPago: params.estadoPago,
        estadoEnvio: params.estadoEnvio,
        montoMin: params.montoMin,
        montoMax: params.montoMax,
    });

    const orders = data?.orders;
    const totalOrders = data?.totalOrders || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    return (
        <AdminPageWrapper title="Pedidos" showBackButton={false}>
            <div className="space-y-4">
                <OrdersTableFilters initialFecha={fecha} />

                {!orders ? (
                    <div className="flex flex-col">
                        <h2 className="text-lg sm:text-xl py-10">
                            No hay pedidos disponibles.
                        </h2>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex justify-center">
                        <h2 className="text-base sm:text-lg">
                            No se encontraron pedidos con los filtros aplicados.
                        </h2>
                    </div>
                ) : (
                    <>
                        <OrdersTable orders={orders} />
                        <DataTablePagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalOrders}
                            limit={limit}
                            pathname="/admin/orders"
                            itemLabel="pedidos"
                        />
                    </>
                )}
            </div>
        </AdminPageWrapper>
    );
}