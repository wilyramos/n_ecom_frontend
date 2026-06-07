"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SectionResponse, SECTION_TYPE_LABELS } from "@/src/schemas/section.schema";
import { reorderSectionsAction, deleteSectionAction } from "@/actions/section-action";
import { Edit2, Trash2, GripVertical, Eye, EyeOff, MoreVertical } from "lucide-react";
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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function SectionTableList({ initialSections }: { initialSections: SectionResponse[] }) {
    const [sections, setSections] = useState<SectionResponse[]>(initialSections);
    const [sectionToDelete, setSectionToDelete] = useState<SectionResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s._id === active.id);
        const newIndex = sections.findIndex((s) => s._id === over.id);
        const reorderedArray = arrayMove(sections, oldIndex, newIndex);
        
        setSections(reorderedArray);

        const payload = reorderedArray.map((s, i) => ({ id: s._id, order: i + 1 }));
        const result = await reorderSectionsAction(payload);
        
        if (!result.ok) {
            toast.error("Error al guardar orden");
            setSections(initialSections);
        }
    };

    const confirmDelete = async () => {
        if (!sectionToDelete) return;
        setIsDeleting(true);
        const result = await deleteSectionAction(sectionToDelete._id);
        setIsDeleting(false);
        if (result.ok) {
            toast.success("Eliminado");
            setSections((prev) => prev.filter((s) => s._id !== sectionToDelete._id));
            setSectionToDelete(null);
        } else {
            toast.error(result.error);
        }
    };

    if (!isMounted) return null; // Previene error de hidratación

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-center">Elementos</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <SortableContext items={sections.map((s) => s._id)} strategy={verticalListSortingStrategy}>
                        <TableBody>
                            {sections.map((section) => (
                                <SortableRow key={section._id} section={section} onDelete={() => setSectionToDelete(section)} />
                            ))}
                        </TableBody>
                    </SortableContext>
                </Table>
            </DndContext>

            <Dialog open={!!sectionToDelete} onOpenChange={(open) => !open && setSectionToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                        <DialogDescription>Se eliminará permanentemente: <strong>{sectionToDelete?.title}</strong></DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? "Eliminando..." : "Confirmar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function SortableRow({ section, onDelete }: { section: SectionResponse; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id });
    
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : "auto" };

    return (
        <tr ref={setNodeRef} style={style} className="border-b hover:bg-muted/30">
            <TableCell {...attributes} {...listeners} className="cursor-grab text-muted-foreground">
                <GripVertical className="w-4 h-4" />
            </TableCell>
            <TableCell className="font-medium">{section.title}</TableCell>
            <TableCell className="font-mono text-xs">{section.slug}</TableCell>
            <TableCell><span className="text-xs bg-primary/10 px-2 py-1 rounded-full">{SECTION_TYPE_LABELS[section.type]}</span></TableCell>
            <TableCell className="text-center">{section.blocks?.length || 0}</TableCell>
            <TableCell className="text-center">
                {section.isActive ? <span className="text-emerald-600 text-xs flex items-center justify-center"><Eye className="w-3 h-3 mr-1"/> Activo</span> : <span className="text-muted-foreground text-xs flex items-center justify-center"><EyeOff className="w-3 h-3 mr-1"/> Inactivo</span>}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/admin/sections/${section._id}/edit`}><Edit2 className="w-3.5 h-3.5 mr-2" /> Editar</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </tr>
    );
}