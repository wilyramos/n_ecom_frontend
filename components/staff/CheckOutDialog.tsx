// File: frontend/components/staff/attendance/CheckOutDialog.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CheckOutDialogProps {
    open: boolean;
    isPending: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function CheckOutDialog({ open, isPending, onOpenChange, onConfirm }: CheckOutDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>¿Confirmar salida?</DialogTitle>
                    <DialogDescription>
                        La marca se registrará con la hora oficial del servidor.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        variant="destructive"
                    >
                        {isPending ? 'Registrando...' : 'Confirmar salida'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}