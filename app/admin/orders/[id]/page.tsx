// File: frontend/app/admin/orders/[id]/page.tsx
import { getOrder } from "@/src/services/orders";
import { formatDate } from "@/lib/utils";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import Image from "next/image";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import OrderActions from "@/components/admin/orders/OrderActions";
import PrintOrderButton from "@/components/admin/orders/PrintOrderButton";
import PrintLabelButton from "@/components/admin/orders/PrintLabelButton";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <AdminPageWrapper title="Pedido no encontrado">
                <div className="text-center py-10">
                    <p className="text-muted-foreground">El pedido solicitado no existe.</p>
                </div>
            </AdminPageWrapper>
        );
    }

    const currency = order.currency || "PEN";

    return (
        <AdminPageWrapper
            title={`Pedido ${order.orderNumber}`}
            breadcrumbItems={[{ label: "Pedidos", href: "/admin/orders" }]}
            breadcrumbCurrent="Detalles"
            actions={
                <div className="flex gap-2">
                    <PrintOrderButton orderId={id} />
                    <PrintLabelButton orderId={id} />
                  
                </div>
            }
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-start justify-between border-b border-border pb-4 flex-wrap gap-3">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Creado el {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Quick Actions */}
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <OrderActions orderId={id} currentStatus={order.status} />
                </div>

                {/* Cards Info */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-background border border-border rounded-lg p-4">
                        <h2 className="text-sm font-semibold text-foreground mb-2">Cliente</h2>
                        <p className="text-sm"><strong>Nombre:</strong> {order.customerProfile.nombre} {order.customerProfile.apellidos}</p>
                        <p className="text-sm"><strong>Email:</strong> {order.customerProfile.email}</p>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-4">
                        <h2 className="text-sm font-semibold text-foreground mb-2">Pago</h2>
                        <p className="text-sm"><strong>Método:</strong> {order.payment.provider}</p>
                        <p className="text-sm"><strong>Estado:</strong> <PaymentStatusBadge status={order.payment.status} /></p>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-4">
                        <h2 className="text-sm font-semibold text-foreground mb-2">Envío</h2>
                        <p className="text-sm">{order.shippingAddress?.direccion}</p>
                        <p className="text-sm">{order.shippingAddress?.distrito}, {order.shippingAddress?.departamento}</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-background border border-border rounded-lg p-4">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Productos</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Cantidad</TableHead>
                                <TableHead className="text-right">Precio</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell className="flex items-center gap-3">
                                        <Image src={item.imagen || "/logomini.svg"} alt={item.nombre || "Producto"} width={40} height={40} className="rounded border" />
                                        {item.nombre}
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{currency} {item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{currency} {(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* History & Totals */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-background border border-border rounded-lg p-4">
                        <h3 className="font-semibold text-sm mb-4">Historial</h3>
                        {order.statusHistory?.map((h, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">{h.status}: {formatDate(String(h.changedAt))}</p>
                        ))}
                    </div>
                    <div className="bg-background border border-border rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-sm">Resumen</h3>
                        <div className="flex justify-between text-sm"><span>Total:</span> <strong>{currency} {order.totalPrice.toFixed(2)}</strong></div>
                    </div>
                </div>
            </div>
        </AdminPageWrapper>
    );
}