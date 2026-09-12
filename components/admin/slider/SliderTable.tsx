// File: src/components/admin/slider/SliderTable.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
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
import { reorderSliderBannersAction, type ReorderItem } from "@/actions/slider-actions";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import BannerRow from "./BannerRow";
import { Alert } from "@/components/ui/Alert";
import {
    AdminTable,
    AdminTableHead,
    AdminTableHeaderCell,
    AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";

interface SliderTableProps {
    banners: SliderBanner[];
}

export default function SliderTable({ banners }: SliderTableProps) {
    const [items, setItems] = useState<SliderBanner[]>(banners);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setItems(banners);
    }, [banners]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((b) => b._id === active.id);
        const newIndex = items.findIndex((b) => b._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);

        const payload: ReorderItem[] = reordered.map((b, i) => ({
            id: b._id,
            order: i,
        }));

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setErrorMsg(null);
            startTransition(async () => {
                const result = await reorderSliderBannersAction(payload);
                if (!result.success) {
                    setErrorMsg(result.message);
                    setItems(banners);
                }
            });
        }, 300);
    };

    return (
        <div className="space-y-3">
            {errorMsg && <Alert>{errorMsg}</Alert>}
            {isPending && <Alert>Guardando nuevo orden…</Alert>}

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
                                <AdminTableHeaderCell>Banner</AdminTableHeaderCell>
                                <AdminTableHeaderCell>Layout</AdminTableHeaderCell>
                                <AdminTableHeaderCell>Orden</AdminTableHeaderCell>
                                <AdminTableHeaderCell>Estado</AdminTableHeaderCell>
                                <AdminTableHeaderCell align="right">Acciones</AdminTableHeaderCell>
                            </tr>
                        </AdminTableHead>

                        <tbody>
                            {items.length === 0 ? (
                                <AdminTableEmpty
                                    colSpan={6}
                                    title="No hay banners registrados"
                                    description="Crea un banner o modifica los filtros de búsqueda."
                                />
                            ) : (
                                <SortableContext
                                    items={items.map((b) => b._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {items.map((banner) => (
                                        <BannerRow
                                            key={banner._id}
                                            banner={banner}
                                            onError={setErrorMsg}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </tbody>
                    </AdminTable>
                </DndContext>
            </div>
        </div>
    );
}