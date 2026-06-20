// File: frontend/src/components/admin/page/PageTableList.tsx

"use client";

import React, { useTransition, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import type { Page } from "@/src/schemas/page.schema";
import { updatePageAction, deletePageAction } from "@/actions/page-actions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    initialPages: Page[];
}

const IMMUTABLE_SLUGS = ["terminos-y-condiciones", "cambios-devoluciones"];

export default function PageTableList({ initialPages }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Control de estado para el Dialog modal de eliminación estructural
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

    const handleToggleStatus = async (page: Page) => {
        if (isPending) return;

        const mockFormData = new FormData();
        mockFormData.append("title", page.title);
        mockFormData.append("slug", page.slug);
        mockFormData.append("content", page.content);
        mockFormData.append("isActive", String(!page.isActive));
        if (page.seo?.metaTitle) mockFormData.append("metaTitle", page.seo.metaTitle);
        if (page.seo?.metaDescription) mockFormData.append("metaDescription", page.seo.metaDescription);

        startTransition(async () => {
            const res = await updatePageAction(page._id, page.slug, { success: false, message: "" }, mockFormData);
            if (res.success) {
                toast.success(`Estado de la página modificado.`);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        });
    };

    const openDeleteModal = (page: Page) => {
        if (IMMUTABLE_SLUGS.includes(page.slug)) return;
        setPageToDelete(page);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeletePage = () => {
        if (!pageToDelete) return;

        startTransition(async () => {
            const res = await deletePageAction(pageToDelete._id, pageToDelete.slug);
            setIsDeleteDialogOpen(false);
            setPageToDelete(null);

            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className="relative">
            {isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
                </div>
            )}

            <div className="">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="font-semibold text-zinc-900 text-xs">Título</TableHead>
                            <TableHead className="font-semibold text-zinc-900 text-xs">Ruta (Slug)</TableHead>
                            <TableHead className="font-semibold text-zinc-900 text-xs">Estado</TableHead>
                            <TableHead className="font-semibold text-zinc-900 text-xs text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                        {initialPages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-zinc-400 font-normal">
                                    No se encontraron páginas configuradas bajo este criterio.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialPages.map((page) => {
                                const isImmutable = IMMUTABLE_SLUGS.includes(page.slug);
                                return (
                                    <TableRow key={page._id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-semibold text-zinc-900">
                                            {page.title}
                                        </TableCell>
                                        <TableCell className="font-mono text-zinc-400 text-[11px]">
                                            /{page.slug}
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(page)}
                                                disabled={isPending}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition-all disabled:opacity-50 ${page.isActive
                                                        ? "bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800"
                                                        : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300"
                                                    }`}
                                            >
                                                {page.isActive ? (
                                                    <>
                                                        <Eye className="h-3 w-3" /> Publicada
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-3 w-3" /> Oculta
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs px-2 text-zinc-600 gap-1"
                                            >
                                                <Link href={`/admin/pages/${page._id}`}>
                                                    <Edit2 className="h-3 w-3" /> Editar
                                                </Link>
                                            </Button>

                                            {!isImmutable && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={isPending}
                                                    onClick={() => openDeleteModal(page)}
                                                    className="h-7 text-xs px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Controlado de confirmación destructiva shadcn/ui */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Remover página institucional?</DialogTitle>
                        <DialogDescription>
                            Esta operación eliminará permanentemente la vista de{" "}
                            <span className="font-semibold text-zinc-900">
                                {pageToDelete?.title}
                            </span>{" "}
                            (/{pageToDelete?.slug}) de la base de datos. Los usuarios externos que intenten acceder experimentarán un error 404.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeletePage}
                            disabled={isPending}
                        >
                            Confirmar Eliminación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}