import { getOrders } from "@/src/services/orders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import Pagination from "@/components/ui/Pagination";
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

export default async function pageOrders({ searchParams }: PageOrdersProps) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 25;

    // Get orders from the backend
    const data = await getOrders({
        page,
        limit,
        pedido: params.pedido,
        fecha: params.fecha,
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
        <AdminPageWrapper
            title="Pedidos"
            showBackButton={false}
        >
            <div className="space-y-4">
                <OrdersTableFilters />

                {!orders ? (
                    <div className="flex flex-col">
                        <h2 className="text-lg sm:text-xlpy-10">
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
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            limit={limit}
                            pathname="/admin/orders"
                        />
                    </>
                )}
            </div>
        </AdminPageWrapper>
    );
}