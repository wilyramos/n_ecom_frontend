"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ExternalLink, Trash2 } from "lucide-react";
import { AdminTableActions, type ActionItem } from "@/src/components/admin/layout/admin-table-actions";
import DeleteProductDialog from "./DeleteProductDialog";

interface Props {
    productId: string;
    slug: string;
}

export default function ProductMenuAction({ productId, slug }: Props) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const actions: ActionItem[] = [
        {
            label: "Editar",
            icon: Pencil,
            onClick: () => router.push(`/admin/products/${productId}`),
        },
        {
            label: "Ver en tienda",
            icon: ExternalLink,
            onClick: () => window.open(`/productos/${slug}`, "_blank"),
        },
        {
            label: "Eliminar",
            icon: Trash2,
            variant: "destructive",
            onClick: () => setIsDeleteDialogOpen(true),
        },
    ];

    return (
        <>
            <AdminTableActions actions={actions} label="Acciones de producto" />
            <DeleteProductDialog
                productId={productId}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </>
    );
}