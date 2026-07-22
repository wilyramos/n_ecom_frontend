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
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, ShieldAlert, FileText, MapPin, User, ArrowRight } from "lucide-react";

type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <AdminPageWrapper title="Pedido no encontrado">
                <div className="text-center py-10">
                    <p className="text-muted-foreground">El pedido solicitado no existe o fue removido del sistema.</p>
                </div>
            </AdminPageWrapper>
        );
    }

    const currency = order.currency || "PEN";

    return (
        <AdminPageWrapper
            title={`Pedido ${order.orderNumber}`}

            actions={
                <div className="flex gap-2">
                    <PrintOrderButton orderId={id} />
                    <PrintLabelButton orderId={id} />
                </div>
            }
        >
            <div className="space-y-6">
                {/* Cabecera Principal y Estados */}
                <div className="flex items-start justify-between border-b border-border pb-5 flex-wrap gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Registrado el {formatDate(order.createdAt)}</span>
                        </div>
                        {order.updatedAt && (
                            <p className="text-[11px] text-muted-foreground/70 pl-5.5">
                                Última actualización: {formatDate(order.updatedAt)}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.payment.status} />
                    </div>
                </div>

                {/* Acciones del Administrador (Cambios de Estado Interno) */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Gestión de Estado de Operación</span>
                    </div>
                    <OrderActions orderId={id} currentStatus={order.status} />
                </div>

                {/* Grilla Informativa Estructural */}
                <div className="grid md:grid-cols-3 gap-5">
                    {/* Tarjeta 1: Información de Contacto Perfil del Cliente */}
                    <div className="bg-background border border-border rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-muted pb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-bold text-foreground">Identificación del Cliente</h2>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><strong>Nombres:</strong> {order.customerProfile.nombre} {order.customerProfile.apellidos}</p>
                            <p><strong>Email:</strong> {order.customerProfile.email}</p>
                            <p><strong>Teléfono / Móvil:</strong> {order.customerProfile.telefono}</p>
                            <p><strong>Documento:</strong> <Badge variant="outline" className="ml-1 font-mono">{order.customerProfile.tipoDocumento}: {order.customerProfile.numeroDocumento}</Badge></p>
                            {order.user && (
                                <p className="text-xs text-muted-foreground pt-1 border-t border-dashed border-muted mt-2">
                                    👤 Usuario registrado con ID relacional activo.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tarjeta 2: Detalles de Transacción Financiera */}
                    <div className="bg-background border border-border rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-muted pb-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-bold text-foreground">Transacción y Pasarela</h2>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><strong>Pasarela:</strong> <span className="uppercase font-semibold tracking-wider text-xs">{order.payment.provider}</span></p>
                            {order.payment.method && <p><strong>Medio Pago:</strong> <span className="capitalize">{order.payment.method}</span></p>}
                            {order.payment.transactionId && (
                                <p className="text-xs truncate" title={order.payment.transactionId}>
                                    <strong>Cargo ID:</strong> <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">{order.payment.transactionId}</code>
                                </p>
                            )}

                            {/* Inyección de Campos Dinámicos de Auditoría Culqi */}
                            {order.payment.provider === 'culqi' && (
                                <div className="mt-2 pt-2 border-t border-dashed border-muted space-y-1.5 text-xs text-muted-foreground">
                                    {order.payment.culqiOrderId && <p><strong>Orden Culqi:</strong> <span className="font-mono">{order.payment.culqiOrderId}</span></p>}
                                    {order.payment.culqiOrderState && <p><strong>Estado Culqi:</strong> <span className="font-semibold text-orange-600 uppercase text-[10px]">{order.payment.culqiOrderState}</span></p>}
                                    {order.payment.culqiPaymentCode && (
                                        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 p-2 rounded-lg mt-1">
                                            <p className="font-bold text-orange-700 dark:text-orange-400 text-xs">Código CIP (PagoEfectivo):</p>
                                            <p className="font-mono text-base font-black text-foreground tracking-widest text-center py-0.5">{order.payment.culqiPaymentCode}</p>
                                        </div>
                                    )}
                                    {order.payment.culqiPaidAt && (
                                        <p>
                                            <strong>Pago Confirmado:</strong>{" "}
                                            {formatDate(new Date(order.payment.culqiPaidAt * 1000))}
                                        </p>
                                    )}                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tarjeta 3: Logística de Dirección de Envío Estructurada */}
                    <div className="bg-background border border-border rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-muted pb-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-bold text-foreground">Información de Despacho</h2>
                        </div>
                        <div className="space-y-1.5 text-sm">
                            <p className="font-semibold text-foreground">{order.shippingAddress?.direccion} {order.shippingAddress?.numero || ''}</p>
                            {order.shippingAddress?.pisoDpto && <p className="text-xs text-muted-foreground"><strong>Interior/Piso/Dpto:</strong> {order.shippingAddress.pisoDpto}</p>}
                            <p className="text-xs text-muted-foreground font-medium">{order.shippingAddress?.distrito} &bull; {order.shippingAddress?.provincia} &bull; {order.shippingAddress?.departamento}</p>
                            {order.shippingAddress?.referencia && (
                                <div className="mt-2 text-xs bg-muted/50 p-2 rounded-lg border border-dotted border-border leading-relaxed">
                                    <strong>Referencia:</strong> {order.shippingAddress.referencia}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabla Unificada de Desglose de Productos Históricos */}
                <div className="bg-background border border-border rounded-xl p-5 shadow-xs">
                    <h2 className="text-sm font-bold text-foreground mb-4">Ítems del Pedido</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border">
                                <TableHead className="text-left font-bold text-xs uppercase tracking-wider">Detalle del Producto</TableHead>
                                <TableHead className="text-center font-bold text-xs uppercase tracking-wider w-24">Cantidad</TableHead>
                                <TableHead className="text-right font-bold text-xs uppercase tracking-wider w-32">Precio Unitario</TableHead>
                                <TableHead className="text-right font-bold text-xs uppercase tracking-wider w-36">Subtotal Ítem</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, i) => (
                                <TableRow key={i} className="border-b border-muted hover:bg-muted/10 transition-colors">
                                    <TableCell className="py-3 flex items-start gap-3">
                                        <div className="relative h-11 w-11 shrink-0 rounded-lg border border-border overflow-hidden bg-muted">
                                            <Image
                                                src={item.imagen || "/logomini.svg"}
                                                alt={item.nombre || "Producto"}
                                                fill
                                                className="object-contain"
                                                unoptimized={true}
                                                quality={10}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm text-foreground leading-none">{item.nombre}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground">ID: {String(item.productId)}</p>
                                            {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 && (
                                                <div className="flex gap-1 flex-wrap pt-0.5">
                                                    {Object.entries(item.variantAttributes).map(([key, val]) => (
                                                        <span key={key} className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border font-medium capitalize">
                                                            {key}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold py-3 text-sm text-foreground">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-mono py-3 text-sm text-foreground">{currency} {item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono font-bold py-3 text-sm text-foreground">{currency} {(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Bloques de Flujo Histórico y Auditoría de Resumen Comercial */}
                <div className="grid md:grid-cols-12 gap-5">
                    {/* Línea de Tiempo del Pedido */}
                    <div className="bg-background border border-border rounded-xl p-5 shadow-xs md:col-span-7 space-y-4">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                            <span>Trazabilidad Histórica de Auditoría</span>
                        </h3>
                        <div className="relative border-l-2 border-muted pl-4 ml-2 space-y-4">
                            {order.statusHistory?.map((h, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[21px] mt-1.5 h-2 w-2 rounded-full bg-border ring-4 ring-background" />
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold uppercase tracking-wider text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                                            {h.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(String(h.changedAt))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumen Comercial de Montos y Costos */}
                    <div className="bg-background border border-border rounded-xl p-5 shadow-xs md:col-span-5 h-fit space-y-3.5">
                        <h3 className="font-bold text-sm text-foreground border-b border-muted pb-2">Estructura Comercial</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal Neto:</span>
                                <span className="font-mono">{currency} {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground border-b border-muted pb-2.5">
                                <span>Costo de Envío Logístico:</span>
                                <span className="font-mono">{currency} {order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1 text-foreground">
                                <span className="font-bold text-base flex items-center gap-1">
                                    Total Recaudado <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                </span>
                                <span className="font-mono text-lg font-black text-orange-600">{currency} {order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageWrapper>
    );
}