"use client";

import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DeleteProduct,
    type DeleteProductState,
} from "@/actions/product/delete-product-action";

interface Props {
    productId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const initialState: DeleteProductState = {
    errors: [],
    success: "",
};

export default function DeleteProductDialog({
    productId,
    open,
    onOpenChange,
    onSuccess,
}: Props) {
    const [isPending, startTransition] = useTransition();
    const deleteProductWithId = DeleteProduct.bind(null, productId);
    const [state, dispatch] = useActionState(deleteProductWithId, initialState);

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
            onOpenChange(false);
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [state, onOpenChange, onSuccess]);

    const handleDelete = () => {
        startTransition(() => {
            dispatch();
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader className="flex flex-col items-center gap-2 text-center pt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-base font-bold text-zinc-900">
                        ¿Eliminar producto del catálogo?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500">
                        Esta acción no se puede deshacer. Se removerán las variantes, especificaciones y registros vinculados.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-3">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Eliminando...</span>
                            </>
                        ) : (
                            <span>Confirmar Eliminación</span>
                        )}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}