// File: frontend/src/components/admin/page/EditPageForm.tsx

"use client";

import { useActionState, useEffect, useRef, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { updatePageAction, deletePageAction } from "@/actions/page-actions";
import PageFormFields from "./PageFormFields";
import type { ActionState } from "@/actions/page-actions";
import type { Page } from "@/src/schemas/page.schema";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Save, ExternalLink } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    id: string;
    initialData: Page;
}

const INITIAL_STATE: ActionState<Page> = {
    success: false,
    message: "",
};

const IMMUTABLE_SLUGS = ["terminos-y-condiciones", "cambios-devoluciones"];

export default function EditPageForm({ id, initialData }: Props) {
    const router = useRouter();
    const isFirstRender = useRef(true);
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const isImmutable = IMMUTABLE_SLUGS.includes(initialData.slug);

    const updateActionWithParams = updatePageAction.bind(null, id, initialData.slug);
    const [state, dispatch, isPending] = useActionState(updateActionWithParams, INITIAL_STATE);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (state.success) {
            toast.success(state.message || "Página actualizada correctamente.");
            router.push("/admin/pages");
            return;
        }

        if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    const handleDeleteClick = () => {
        if (isImmutable) return;
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setIsDeleteDialogOpen(false);
        startDeleteTransition(async () => {
            const res = await deletePageAction(id, initialData.slug);
            if (res.success) {
                toast.success(res.message);
                router.push("/admin/pages");
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className="w-full">
            <form action={dispatch} className="flex flex-col gap-4 w-full mt-6" noValidate>
                <PageFormFields
                    initialData={initialData}
                    fields={state.success ? undefined : state.fields}
                    fieldErrors={state.success ? undefined : state.fieldErrors}
                />

                <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-t border-zinc-100 sticky bottom-0 z-10 mt-8 rounded-b-lg">
                    <div className="flex items-center gap-4">
                        <a
                            href={`/${initialData.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
                        >
                            Ver en la tienda <ExternalLink className="w-3 h-3" />
                        </a>

                        {!isImmutable && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isPending || isDeleting}
                                onClick={handleDeleteClick}
                                className="h-auto p-0 text-xs font-medium text-zinc-400 hover:text-red-600 hover:bg-transparent gap-1.5 transition-colors"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                )}
                                Eliminar página
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 px-5 text-xs text-zinc-600 bg-white hover:bg-zinc-50 font-medium"
                        >
                            <Link href="/admin/pages">
                                Cancelar
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || isDeleting}
                            size="sm"
                            className="h-9 px-8 bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 disabled:bg-zinc-300 gap-1.5"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Modal de confirmación destructiva con Dialog de shadcn/ui */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Remover página institucional?</DialogTitle>
                        <DialogDescription>
                            Esta operación eliminará permanentemente la vista de{" "}
                            <span className="font-semibold text-zinc-900">
                                {initialData.title}
                            </span>{" "}
                            (/{initialData.slug}) del sistema. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={isDeleting}
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={confirmDelete}
                        >
                            Confirmar Eliminación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}