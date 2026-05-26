// File: frontend/app/admin/orders/%5Bid%5D/page.tsx

import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FaBoxOpen, FaArchive } from "react-icons/fa"; // Añadidas iconos
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import Image from "next/image";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import OrderActions from "@/components/admin/orders/OrderActions";
import PrintOrderButton from "@/components/admin/orders/PrintOrderButton";
import PrintLabelButton from "@/components/admin/orders/PrintLabelButton";


type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-lg text-gray-600">Pedido no encontrado</h1>
                <Link href="/admin/orders" className="mt-3 inline-block text-sm text-blue-600 underline">
                    Volver a pedidos
                </Link>
            </div>
        );
    }

    const currency = order.currency || "PEN";

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-gray-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <FaBoxOpen className="text-gray-500" />
                        {order.orderNumber}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Creado el {formatDate(order.createdAt)}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Acciones Rápida */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg border">
                <div className="flex gap-2">
                    <Link href="/admin/orders" className="text-sm text-gray-700 bg-white border px-3 py-1.5 rounded hover:bg-gray-100 transition-colors shadow-sm">
                        &larr; Volver
                    </Link>

                    <OrderActions orderId={id} currentStatus={order.status} />
                </div>

                <div className="flex gap-2 items-center">
                    <PrintOrderButton orderId={id} />
                    <PrintLabelButton orderId={id} />

                    {/* Botón de archivar (puedes volverlo su propio componente luego) */}
                    <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                        <FaArchive className="text-gray-400" /> Archivar
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Cliente */}
                <div className="bg-white border rounded p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Cliente</h2>
                    <p className="text-sm"><strong>Nombre:</strong> {order.customerProfile.nombre} {order.customerProfile.apellidos}</p>
                    <p className="text-sm"><strong>Email:</strong> {order.customerProfile.email}</p>
                </div>

                {/* Pago */}
                <div className="bg-white border rounded p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Pago</h2>
                    <p className="text-sm"><strong>Método:</strong> {order.payment.provider}</p>
                    <p className="text-sm"><strong>ID pago:</strong> {order.payment.transactionId || "—"}</p>
                    <p className="text-sm">
                        <strong>Estado:</strong> <PaymentStatusBadge status={order.payment.status} />
                    </p>
                </div>

                {/* Envío */}
                <div className="bg-white border rounded p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Envío</h2>
                    <p className="text-sm">{order.shippingAddress?.direccion}</p>
                    <p className="text-sm">
                        {order.shippingAddress?.distrito}, {order.shippingAddress?.provincia}, {order.shippingAddress?.departamento}
                    </p>
                    {order.shippingAddress?.referencia && (
                        <p className="text-sm"><strong>Ref:</strong> {order.shippingAddress.referencia}</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded p-4 overflow-x-auto">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Productos</h2>
                <table className="w-full text-sm min-w-[500px]">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                        <tr>
                            <th className="text-left py-2 px-3">Producto</th>
                            <th className="text-center py-2 px-3">Cantidad</th>
                            <th className="text-right py-2 px-3">Precio</th>
                            <th className="text-right py-2 px-3">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, i) => {
                            const imagenurl = item.imagen;
                            const variantAttrs = item.variantAttributes || {};
                            return (
                                <tr key={i} className="border-b">
                                    <td className="py-2 px-3 flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={imagenurl || "/logomini.svg"}
                                                alt={item.nombre || "Producto sin imagen"}
                                                className="w-10 h-10 object-cover rounded"
                                                width={40}
                                                height={40}
                                            />
                                            <span>{item.nombre}</span>
                                        </div>
                                        {Object.keys(variantAttrs).length > 0 && (
                                            <div className="text-xs text-gray-500 ml-12">
                                                {Object.entries(variantAttrs).map(([key, value]) => (
                                                    <span key={key}>{key}: {value} </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center py-2 px-3">{item.quantity}</td>
                                    <td className="text-right py-2 px-3">{currency} {item.price.toFixed(2)}</td>
                                    <td className="text-right py-2 px-3">{currency} {(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Notas + Historial + Totales */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Historial con diseño mejorado */}
                <div className="bg-white border rounded p-4 shadow-sm">
                    <h3 className="font-semibold text-sm text-gray-700 mb-4 border-b pb-2">Historial de movimientos</h3>
                    {order.statusHistory?.length ? (
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                            {[...order.statusHistory].reverse().map((h, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium ${h.status === 'canceled' ? 'text-red-600' : 'text-gray-800'}`}>
                                                {h.status.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                            {h.status === 'canceled' && (
                                                <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded ml-2 border border-red-100">
                                                    STOCK RESTAURADO
                                                </span>
                                            )}
                                            {h.status === 'processing' && (
                                                <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded ml-2 border border-green-100">
                                                    STOCK DESCONTADO
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">{formatDate(String(h.changedAt))}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Sin movimientos registrados</p>
                    )}
                </div>

                {/* Totales (Tu código se mantiene igual) */}
                <div className="bg-white border rounded p-4 space-y-2 shadow-sm">
                    <h3 className="font-semibold text-gray-700 text-base">Resumen del pedido</h3>
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>Subtotal:</span>
                        <span>{currency} {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>Envío:</span>
                        <span>{currency} {order.shippingCost.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-black">
                        <span>Total:</span>
                        <span>{currency} {order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}