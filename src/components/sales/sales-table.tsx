"use client";

import { Sale } from "@/src/schemas/sale.schema";
import { format } from "date-fns";
import { SaleDetailsModal } from "./sale-details-modal";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const statusStyles: Record<string, string> = {
    COMPLETED: "bg-brand-action/20 text-brand-charcoal dark:text-brand-action border-brand-action/40",
    REFUNDED: "bg-destructive/10 text-destructive border-destructive/20",
    QUOTE: "bg-muted text-muted-foreground border-border",
    CANCELED: "bg-muted text-muted-foreground border-border opacity-70",
    PARTIALLY_REFUNDED: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

export function SalesTable({ initialData }: { initialData: Sale[] }) {
    return (
        <div className="w-full overflow-x-auto">
            <Table className="w-full text-sm text-left">
                <TableHeader className="bg-muted border-b border-border">
                    <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground h-auto">Fecha</TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground h-auto">Comprobante</TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground h-auto">Cliente</TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground h-auto">Método</TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground h-auto">Estado</TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground text-right h-auto">Total</TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-muted-foreground text-center h-auto">Detalle</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                    {initialData.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={7} className="px-4 py-10 text-center text-muted-foreground bg-card">
                                No se encontraron ventas con los filtros aplicados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialData.map((sale) => (
                            <TableRow
                                key={sale._id}
                                className="hover:bg-muted/50 transition-colors border-border"
                            >
                                <TableCell className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                    {format(new Date(sale.createdAt!), "dd/MM/yy HH:mm")}
                                </TableCell>
                                <TableCell className="px-4 py-3 font-mono text-xs font-bold text-foreground">
                                    {sale.receiptNumber}
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {sale.customerSnapshot?.nombre || "Cliente Varios"}
                                        </span>
                                        <span className="text-muted-foreground text-xs font-mono">
                                            {sale.customerSnapshot?.numeroDocumento || "S/D"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-xs">
                                    <span className="bg-muted px-2 py-0.5 rounded-sm border border-border text-foreground font-medium uppercase">
                                        {sale.paymentMethod}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-sm text-[10px] font-black border block w-fit tracking-wider uppercase",
                                        statusStyles[sale.status] || "bg-muted text-muted-foreground border-border"
                                    )}>
                                        {sale.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right font-black text-foreground">
                                    S/ {sale.totalPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <SaleDetailsModal sale={sale} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}