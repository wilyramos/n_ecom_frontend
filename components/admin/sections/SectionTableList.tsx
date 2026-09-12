// File: components/admin/sections/SectionTableList.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionResponse, SECTION_TYPE_LABELS } from "@/src/schemas/section.schema";
import { reorderSectionsAction, deleteSectionAction } from "@/actions/section-action";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

// Dnd-kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Layout components
import {
    AdminTable,
    AdminTableHead,
    AdminTableHeaderCell,
    AdminTableRow,
    AdminTableCell,
    AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";
import { AdminTableActions } from "@/src/components/admin/layout/admin-table-actions";
import { cn } from "@/lib/utils";

export default function SectionTableList({
    initialSections,
}: {
    initialSections: SectionResponse[];
}) {
    const router = useRouter();
    const [sections, setSections] = useState<SectionResponse[]>(initialSections);
    const [sectionToDelete, setSectionToDelete] = useState<SectionResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setSections(initialSections);
    }, [initialSections]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s._id === active.id);
        const newIndex = sections.findIndex((s) => s._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reorderedArray = arrayMove(sections, oldIndex, newIndex);
        setSections(reorderedArray);

        const payload = reorderedArray.map((s, i) => ({ id: s._id, order: i + 1 }));
        const result = await reorderSectionsAction(payload);

        if (!result.ok) {
            toast.error("Error al guardar el orden");
            setSections(initialSections);
        }
    };

    const confirmDelete = async () => {
        if (!sectionToDelete) return;
        setIsDeleting(true);
        const result = await deleteSectionAction(sectionToDelete._id);
        setIsDeleting(false);

        if (result.ok) {
            toast.success("Sección eliminada");
            setSections((prev) => prev.filter((s) => s._id !== sectionToDelete._id));
            setSectionToDelete(null);
        } else {
            toast.error(result.error || "No se pudo eliminar la sección");
        }
    };

    if (!isMounted) return null;

    return (
        <>
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <AdminTable>
                        <AdminTableHead>
                            <tr>
                                <AdminTableHeaderCell width="40px" />
                                <AdminTableHeaderCell>Título</AdminTableHeaderCell>
                                <AdminTableHeaderCell>Slug</AdminTableHeaderCell>
                                <AdminTableHeaderCell>Tipo</AdminTableHeaderCell>
                                <AdminTableHeaderCell align="center">Elementos</AdminTableHeaderCell>
                                <AdminTableHeaderCell align="center">Estado</AdminTableHeaderCell>
                                <AdminTableHeaderCell align="right">Acciones</AdminTableHeaderCell>
                            </tr>
                        </AdminTableHead>

                        <tbody>
                            {sections.length === 0 ? (
                                <AdminTableEmpty
                                    colSpan={7}
                                    title="No hay secciones configuradas"
                                    description="Crea tu primera sección usando el botón superior."
                                />
                            ) : (
                                <SortableContext
                                    items={sections.map((s) => s._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {sections.map((section) => (
                                        <AdminTableRow
                                            key={section._id}
                                            id={section._id}
                                            isDraggable
                                        >
                                            <AdminTableCell bold>
                                                <span className="text-slate-900">{section.title}</span>
                                            </AdminTableCell>

                                            <AdminTableCell>
                                                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
                                                    {section.slug}
                                                </code>
                                            </AdminTableCell>

                                            <AdminTableCell>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                    {SECTION_TYPE_LABELS[section.type] ?? section.type}
                                                </span>
                                            </AdminTableCell>

                                            <AdminTableCell align="center">
                                                <span className="text-xs text-slate-600 font-medium tabular-nums">
                                                    {section.blocks?.length || 0}
                                                </span>
                                            </AdminTableCell>

                                            <AdminTableCell align="center">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
                                                        section.isActive
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                                    )}
                                                >
                                                    {section.isActive ? (
                                                        <>
                                                            <Eye className="w-3 h-3" /> Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" /> Inactivo
                                                        </>
                                                    )}
                                                </span>
                                            </AdminTableCell>

                                            <AdminTableCell align="right">
                                                <div className="flex items-center justify-end">
                                                    <AdminTableActions
                                                        actions={[
                                                            {
                                                                label: "Editar",
                                                                icon: Edit2,
                                                                onClick: () =>
                                                                    router.push(`/admin/sections/${section._id}/edit`),
                                                            },
                                                            {
                                                                label: "Eliminar",
                                                                icon: Trash2,
                                                                variant: "destructive",
                                                                onClick: () => setSectionToDelete(section),
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            </AdminTableCell>
                                        </AdminTableRow>
                                    ))}
                                </SortableContext>
                            )}
                        </tbody>
                    </AdminTable>
                </DndContext>
            </div>

            {/* Modal de Eliminación */}
            <Dialog
                open={!!sectionToDelete}
                onOpenChange={(open) => !open && setSectionToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                        <DialogDescription>
                            Se eliminará permanentemente la sección:{" "}
                            <strong>{sectionToDelete?.title}</strong>. Esta acción no se puede revertir.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Confirmar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}