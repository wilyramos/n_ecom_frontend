"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Receipt, Printer, RotateCcw, AlertTriangle, FileText } from "lucide-react";
import { Sale } from "@/src/schemas/sale.schema";
import { refundSaleAction, getSaleDetailsAction } from "@/src/actions/sale-actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Props {
    sale: Sale;
}

export function SaleDetailsModal({ sale: initialSale }: Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [sale, setSale] = React.useState<Sale>(initialSale);
    const [isLoading, setIsLoading] = React.useState(false);

    const [isPending, startTransition] = React.useTransition();
    const [showRefundConfirm, setShowRefundConfirm] = React.useState(false);
    const [refundReason, setRefundReason] = React.useState("Devolución solicitada por cliente");

    React.useEffect(() => {
        if (isOpen && initialSale._id) {
            setIsLoading(true);
            getSaleDetailsAction(initialSale._id)
                .then((result) => {
                    if (result.success && result.data) {
                        setSale(result.data);
                    } else {
                        toast.error(result.message || "Error al obtener los detalles");
                    }
                })
                .catch(() => {
                    toast.error("Error de red al intentar cargar detalles");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!isOpen) {
            setSale(initialSale);
        }
    }, [isOpen, initialSale]);

    const handleRefund = async () => {
        startTransition(async () => {
            const result = await refundSaleAction(sale._id!, refundReason);
            if (result.success) {
                setShowRefundConfirm(false);
                toast.success("Venta anulada exitosamente");
                setSale((prev) => ({ ...prev, status: "REFUNDED" }));
            } else {
                toast.error("Error al anular la venta: " + result.message);
            }
        });
    };

    const isRefundable = sale.status === "COMPLETED";

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                        <Eye className="size-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] border-border bg-card text-card-foreground rounded-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-black uppercase text-foreground">
                            <Receipt className="size-5 text-muted-foreground" />
                            Detalle de Venta: {sale.receiptNumber}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Realizada el {sale.createdAt ? format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm") : "-"} por {typeof sale.employee === 'object' ? sale.employee?.nombre : 'Empleado'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-2 max-h-[60vh] overflow-y-auto pr-2 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center z-10">
                                <SpinnerLoading />
                            </div>
                        )}

                        {/* Datos del Cliente */}
                        <div className="grid gap-2 border-b border-border pb-4">
                            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Información del Cliente</h4>
                            <div className="grid grid-cols-2 text-sm gap-y-1">
                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="font-medium text-foreground">{sale.customerSnapshot?.nombre || "Cliente Varios"}</span>
                                <span className="text-muted-foreground">Documento:</span>
                                <span className="font-mono text-foreground">{sale.customerSnapshot?.numeroDocumento || "-"}</span>
                            </div>
                        </div>

                        {/* Listado de Productos */}
                        <div className="grid gap-2">
                            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Productos</h4>
                            <div className="rounded-sm border border-border overflow-hidden">
                                <Table className="text-xs">
                                    <TableHeader className="bg-muted">
                                        <TableRow className="hover:bg-transparent border-border">
                                            <TableHead className="px-3 py-2 text-left h-auto font-bold text-muted-foreground">Item</TableHead>
                                            <TableHead className="px-3 py-2 text-center h-auto font-bold text-muted-foreground">Cant.</TableHead>
                                            <TableHead className="px-3 py-2 text-right h-auto font-bold text-muted-foreground">Precio</TableHead>
                                            <TableHead className="px-3 py-2 text-right h-auto font-bold text-muted-foreground">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-border">
                                        {sale.items.map((item, idx) => (
                                            <TableRow key={idx} className="hover:bg-transparent border-border">
                                                <TableCell className="px-3 py-2 font-medium text-foreground">
                                                    {typeof item.product === 'object' ? item.product.nombre : 'Producto'}
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-center text-foreground">{item.quantity}</TableCell>
                                                <TableCell className="px-3 py-2 text-right text-muted-foreground">S/ {item.price.toFixed(2)}</TableCell>
                                                <TableCell className="px-3 py-2 text-right font-bold text-foreground">S/ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="flex flex-col items-end gap-1 px-2">
                            <div className="flex w-full max-w-[200px] justify-between text-xs">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="text-foreground">S/ {sale.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex w-full max-w-[200px] justify-between font-black text-base border-t border-border mt-1 pt-1">
                                <span className="text-foreground">Total:</span>
                                <span className="text-foreground">S/ {sale.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Historial de Auditoría */}
                        <div className="grid gap-2 bg-muted/50 p-3 rounded-sm border border-border">
                            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Historial de Auditoría</h4>
                            {sale.statusHistory?.map((history, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                    <span className={history.status === 'REFUNDED' ? 'text-destructive font-bold' : 'font-medium text-foreground'}>
                                        {history.status}
                                    </span>
                                    <span className="text-muted-foreground font-mono text-[11px]">{format(new Date(history.changedAt), "dd/MM/yyyy HH:mm:ss")}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 border-t border-border pt-3">
                        {isRefundable && (
                            <Button
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 rounded-sm"
                                onClick={() => setShowRefundConfirm(true)}
                            >
                                <RotateCcw className="size-4 mr-2" />
                                Anular Venta
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-border bg-card text-foreground hover:bg-muted rounded-sm">
                                    <Printer className="size-4 mr-2" />
                                    Imprimir
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 border-border bg-popover text-popover-foreground rounded-sm">
                                <DropdownMenuItem onClick={() => window.open(`/api/sales/${sale._id}/ticket`, '_blank')}>
                                    <Printer className="size-4 mr-2 text-muted-foreground" />
                                    <span>Ticket 80mm</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/api/sales/${sale._id}/pdf`, '_blank')}>
                                    <FileText className="size-4 mr-2 text-muted-foreground" />
                                    <span>Documento A4</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Confirmación Anulación */}
            <Dialog open={showRefundConfirm} onOpenChange={setShowRefundConfirm}>
                <DialogContent className="sm:max-w-[400px] border-destructive/30 bg-card text-card-foreground rounded-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive font-black">
                            <AlertTriangle className="size-5" />
                            Confirmar Anulación
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Esta acción restablecerá el stock de los productos y ajustará el balance de caja actual.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-3 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Motivo de la anulación:</label>
                        <Input
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Ej: Error en cobro, devolución..."
                            className="bg-background border-border text-foreground rounded-sm"
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setShowRefundConfirm(false)} disabled={isPending} className="rounded-sm">
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRefund}
                            disabled={isPending || !refundReason}
                            className="rounded-sm"
                        >
                            {isPending ? <SpinnerLoading /> : <RotateCcw className="size-4 mr-2" />}
                            Confirmar Anulación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}