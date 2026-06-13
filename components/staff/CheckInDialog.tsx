// File: frontend/components/staff/attendance/CheckInDialog.tsx

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

interface CheckInDialogProps {
    open: boolean;
    isPending: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function CheckInDialog({ open, isPending, onOpenChange, onConfirm }: CheckInDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>¿Confirmar entrada?</DialogTitle>
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isPending ? 'Registrando...' : 'Confirmar entrada'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}