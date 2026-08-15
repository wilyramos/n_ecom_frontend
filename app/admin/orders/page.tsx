// File: frontend/app/admin/orders/page.tsx
import { getOrders } from "@/src/services/orders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import DataTablePagination from "@/components/ui/DataTablePagination";
import OrdersTableFilters from "@/components/admin/orders/OrdersTableFilters";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";

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

function getDateDaysAgo(daysAgo: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000));

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export default async function PageOrders({ searchParams }: PageOrdersProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  // Por defecto: Última semana (hace 7 días hasta hoy)
  const defaultFechaInicio = getDateDaysAgo(7);
  const defaultFechaFin = getDateDaysAgo(0);

  const fecha = params.fecha !== undefined ? params.fecha : defaultFechaInicio;
  const fechaFin = params.fechaFin !== undefined ? params.fechaFin : defaultFechaFin;

  const data = await getOrders({
    page,
    limit,
    pedido: params.pedido,
    fecha,
    fechaFin,
    estadoPago: params.estadoPago,
    estadoEnvio: params.estadoEnvio,
    montoMin: params.montoMin,
    montoMax: params.montoMax,
  });

  const orders = data?.orders || [];
  const totalOrders = data?.totalOrders || 0;
  const totalPages = Math.ceil(totalOrders / limit) || 1;


  return (
    <AdminPageContainer maxWidth="default" spacing="default">
      <AdminPageHeader
        title="Gestión de Pedidos"
      />


      {/* Filtros */}
      <OrdersTableFilters initialFecha={fecha} initialFechaFin={fechaFin} />

      {/* Tabla con Estilos de Layout Admin */}
      <AdminCardWrapper padding="none">
        <OrdersTable orders={orders} />
        {totalOrders > 0 && (
          <div className="p-3 border-t border-zinc-100">
            <DataTablePagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalOrders}
              limit={limit}
              pathname="/admin/orders"
              itemLabel="pedidos"
            />
          </div>
        )}
      </AdminCardWrapper>
    </AdminPageContainer>
  );
}