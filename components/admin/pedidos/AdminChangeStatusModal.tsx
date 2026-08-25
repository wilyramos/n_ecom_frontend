// File: frontend/components/admin/pedidos/AdminChangeStatusModal.tsx

'use client';

import { useState, useTransition } from 'react';
import { EstadoPedido, IPedido } from '@/src/modules/checkout/types/pedido.types';
import { updateAdminPedidoStatusAction } from '@/src/modules/checkout/actions/admin-pedidos.actions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    pedido: IPedido;
    onStatusUpdated: (updatedPedido: IPedido) => void;
}

const STATUS_CONFIG: Record<
    EstadoPedido,
    { label: string; description: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
    awaiting_payment: {
        label: 'Esperando Pago',
        description: 'El cliente aún no completa la transacción en la pasarela.',
        variant: 'outline',
    },
    processing: {
        label: 'En Proceso',
        description: 'Pago recibido. El pedido está listo para embalaje y preparación.',
        variant: 'default',
    },
    shipped: {
        label: 'Enviado',
        description: 'El paquete está en manos del operador logístico o courier.',
        variant: 'secondary',
    },
    delivered: {
        label: 'Entregado',
        description: 'La orden fue recibida conforme por el cliente final.',
        variant: 'default',
    },
    canceled: {
        label: 'Cancelado',
        description: 'La orden se anula y se repone automáticamente el inventario.',
        variant: 'destructive',
    },
    paid_but_out_of_stock: {
        label: 'Sin Stock',
        description: 'Cobro procesado pero requiere revisión manual de inventario.',
        variant: 'destructive',
    },
};

export default function AdminChangeStatusModal({ pedido, onStatusUpdated }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<EstadoPedido>(pedido.status);
    const [isPending, startTransition] = useTransition();

    const currentConfig = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.awaiting_payment;
    const targetConfig = STATUS_CONFIG[selectedStatus] || STATUS_CONFIG.awaiting_payment;

    const isChangingToCanceled = selectedStatus === 'canceled' && pedido.status !== 'canceled';
    const hasChanges = selectedStatus !== pedido.status;

    const handleConfirm = () => {
        if (!hasChanges) return;

        startTransition(async () => {
            const res = await updateAdminPedidoStatusAction(pedido._id, selectedStatus);

            if (res.success && res.data) {
                onStatusUpdated(res.data);
                toast.success(`Estado actualizado a "${targetConfig.label}" correctamente.`);
                setOpen(false);
            } else {
                toast.error(res.message || 'Error al actualizar el estado del pedido.');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold shadow-xs">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Gestionar Estado</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[460px]">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        Actualizar Estado del Pedido
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500">
                        Modifica el estado logístico de la orden <span className="font-semibold text-zinc-800">#{pedido.orderNumber}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                    {/* Comparador de Estado */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                        <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                Estado Actual
                            </span>
                            <Badge variant={currentConfig.variant} className="text-xs">
                                {currentConfig.label}
                            </Badge>
                        </div>

                        <ArrowRight className="h-4 w-4 text-zinc-400 shrink-0 mx-2" />

                        <div className="space-y-1 text-right">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                Nuevo Estado
                            </span>
                            <Badge variant={targetConfig.variant} className="text-xs">
                                {targetConfig.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Selector Shadcn */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-700">
                            Selecciona el nuevo estado operativo:
                        </label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(val) => setSelectedStatus(val as EstadoPedido)}
                        >
                            <SelectTrigger className="w-full h-9 text-xs">
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="awaiting_payment">Esperando Pago</SelectItem>
                                <SelectItem value="processing">En Proceso (Pago Confirmado)</SelectItem>
                                <SelectItem value="shipped">Enviado (En Courier)</SelectItem>
                                <SelectItem value="delivered">Entregado (Completado)</SelectItem>
                                <SelectItem value="canceled">Cancelado (Anulación)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-zinc-500 pt-0.5">
                            {targetConfig.description}
                        </p>
                    </div>

                    {/* Alerta Condicional de Seguridad */}
                    {isChangingToCanceled && (
                        <Alert variant="destructive" className="py-2.5">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="text-xs font-bold">Atención: Reposición de Inventario</AlertTitle>
                            <AlertDescription className="text-[11px] leading-relaxed">
                                Al cancelar este pedido, las unidades reservadas retornarán de forma inmediata al stock activo de la tienda.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                        className="text-xs"
                    >
                        Cerrar
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleConfirm}
                        disabled={isPending || !hasChanges}
                        className="text-xs font-semibold bg-zinc-900 hover:bg-black gap-1.5"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Aplicando cambios...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Confirmar Cambio</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}