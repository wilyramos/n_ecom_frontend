"use client";

import { useState, useActionState, useEffect, startTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { ProductLine, initialState } from "@/src/schemas/line.schema";
import { deleteLineAction } from "@/actions/line/lines.actions";
import type { Brand } from "@/src/services/brands";

import { Button } from "@/components/ui/button";
import { LineModal } from "./line-modal";
import { ConfirmModal } from "@/components/ui/modals/confirm-modal";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./line-columns";

interface LinesClientProps {
    initialData: ProductLine[];
    brands: Brand[];
    categories: { _id: string; nombre: string }[];
}

export function LinesClient({ initialData, brands, categories }: LinesClientProps) {
    const [deleteState, deleteAction, isDeleting] = useActionState(deleteLineAction, initialState);

    // Estados UI
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [editingLine, setEditingLine] = useState<ProductLine | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Escuchar resultado del Delete Action
    useEffect(() => {
        if (deleteState.timestamp) {
            if (deleteState.success) {
                toast.success(deleteState.message);
                setIsOpenDelete(false);
                setDeleteId(null);
            } else {
                toast.error(deleteState.message);
            }
        }
    }, [deleteState]);

    // Handlers
    const handleCreate = () => {
        setEditingLine(null);
        setIsOpenForm(true);
    };

    const handleEdit = (line: ProductLine) => {
        setEditingLine(line);
        setIsOpenForm(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsOpenDelete(true);
    };

    const onConfirmDelete = () => {
        if (deleteId) {
            startTransition(() => {
                deleteAction(deleteId);
            });
        }
    };

    const columns = getColumns({ onEdit: handleEdit, onDelete: handleDeleteClick });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end"> 
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Línea
                </Button>
            </div>

            <div className="rounded">
                <DataTable columns={columns} data={initialData} searchKey="nombre" />
            </div>

            <LineModal
                isOpen={isOpenForm}
                onClose={() => setIsOpenForm(false)}
                initialData={editingLine}
                brands={brands}
                categories={categories}
            />

            <ConfirmModal
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                onConfirm={onConfirmDelete}
                loading={isDeleting}
                title="¿Estás seguro?"
                description="Esta acción no se puede deshacer. Se eliminará permanentemente la línea seleccionada."
                confirmText="Sí, eliminar"
                variant="destructive"
            />
        </div>
    );
}