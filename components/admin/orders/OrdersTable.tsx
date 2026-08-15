// File: frontend/components/admin/orders/OrdersTable.tsx
"use client";

import type { TOrder } from "@/src/schemas";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import {
  AdminTable,
  AdminTableHead,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";
import { Eye } from "lucide-react";

interface OrdersTableProps {
  orders: TOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <AdminTable>
        <tbody>
          <AdminTableEmpty
            title="No se encontraron pedidos"
            description="Intenta cambiar los filtros de fecha, estado o búsqueda."
            colSpan={6}
          />
        </tbody>
      </AdminTable>
    );
  }

  return (
    <AdminTable>
      <AdminTableHead>
        <tr>
          <AdminTableHeaderCell width="120px">N° Pedido</AdminTableHeaderCell>
          <AdminTableHeaderCell width="140px">Fecha</AdminTableHeaderCell>
          <AdminTableHeaderCell width="150px">Total / Pago</AdminTableHeaderCell>
          <AdminTableHeaderCell>Dirección de Envío</AdminTableHeaderCell>
          <AdminTableHeaderCell width="120px" align="center">Estado Envío</AdminTableHeaderCell>
          <AdminTableHeaderCell width="90px" align="right">Opciones</AdminTableHeaderCell>
        </tr>
      </AdminTableHead>
      <tbody>
        {orders.map((order) => (
          <AdminTableRow key={order._id} id={order._id}>
            <AdminTableCell bold>
              <Link
                href={`/admin/orders/${order._id}`}
                className="text-zinc-900 hover:underline font-mono text-xs"
              >
                {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
              </Link>
            </AdminTableCell>

            <AdminTableCell>
              <span className="text-zinc-500 text-xs">{formatDate(order.createdAt)}</span>
            </AdminTableCell>

            <AdminTableCell>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-zinc-900 text-xs">
                  S/. {order.totalPrice.toFixed(2)}
                </span>
                <div>
                  <PaymentStatusBadge status={order.payment.status} />
                </div>
              </div>
            </AdminTableCell>

            <AdminTableCell>
              <div className="flex flex-col text-xs text-zinc-600 max-w-[280px]">
                <span className="font-medium text-zinc-800 truncate">
                  {order.shippingAddress?.direccion || "Sin dirección"}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {order.shippingAddress?.distrito || ""}{" "}
                  {order.shippingAddress?.departamento ? `(${order.shippingAddress.departamento})` : ""}
                </span>
              </div>
            </AdminTableCell>

            <AdminTableCell align="center">
              <OrderStatusBadge status={order.status} />
            </AdminTableCell>

            <AdminTableCell align="right">
              <Link
                href={`/admin/orders/${order._id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                title="Ver detalle del pedido"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver</span>
              </Link>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </tbody>
    </AdminTable>
  );
}