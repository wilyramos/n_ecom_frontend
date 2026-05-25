// File: src/components/admin/slider/SliderTable.tsx
"use client";

import {
    useState, useCallback, useTransition,
    useRef, useEffect,
} from "react";
import { reorderSliderBannersAction, type ReorderItem } from "@/actions/slider-actions";
import type { SliderBanner }  from "@/src/schemas/slider.schema";
import BannerRow              from "./BannerRow";
import EmptyStateSlider       from "./EmptyStateSlider";
import Alert                  from "@/components/ui/Alert";
import {
    Table, TableHeader, TableHead, TableBody,
} from "@/components/ui/table";

interface SliderTableProps {
    banners: SliderBanner[];
}

const HEADERS = ["", "Banner", "Layout", "Orden", "Estado", ""] as const;

export default function SliderTable({ banners }: SliderTableProps) {
    const [items, setItems]               = useState<SliderBanner[]>(banners);
    const [dragSourceId, setDragSourceId] = useState<string | null>(null);
    const [dragOverId, setDragOverId]     = useState<string | null>(null);
    const [errorMsg, setErrorMsg]         = useState<string | null>(null);
    const [isPending, startTransition]    = useTransition();
    const debounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!dragSourceId) setItems(banners);
    }, [banners, dragSourceId]);

    const handleDragStart = useCallback((id: string) => {
        setDragSourceId(id);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDragSourceId(null);
        setDragOverId(null);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (id !== dragSourceId) setDragOverId(id);
    }, [dragSourceId]);

    const handleDrop = useCallback((targetId: string) => {
        if (!dragSourceId || dragSourceId === targetId) return;

        const sourceIdx = items.findIndex((b) => b._id === dragSourceId);
        const targetIdx = items.findIndex((b) => b._id === targetId);
        if (sourceIdx === -1 || targetIdx === -1) return;

        const reordered = [...items];
        const [moved]   = reordered.splice(sourceIdx, 1);
        reordered.splice(targetIdx, 0, moved);
        setItems(reordered);
        setDragSourceId(null);
        setDragOverId(null);

        const payload: ReorderItem[] = reordered.map((b, i) => ({
            id:    b._id,
            order: i,
        }));

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setErrorMsg(null);
            startTransition(async () => {
                const result = await reorderSliderBannersAction(payload);
                if (!result.success) {
                    setErrorMsg(result.message);
                    setItems(banners); // rollback
                }
            });
        }, 300);
    }, [dragSourceId, items, banners]);

    return (
        <div className="space-y-3">
            {errorMsg && (
                <Alert variant="error" mode="banner" onDismiss={() => setErrorMsg(null)}>
                    {errorMsg}
                </Alert>
            )}

            {isPending && (
                <Alert variant="info" mode="banner">
                    Guardando nuevo orden…
                </Alert>
            )}

            <Table>
                <TableHeader>
                    <tr>
                        {HEADERS.map((h, i) => (
                            <TableHead
                                key={i}
                                className="text-[11px] py-2.5 uppercase tracking-wider"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                {h}
                            </TableHead>
                        ))}
                    </tr>
                </TableHeader>

                <TableBody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={HEADERS.length}>
                                <EmptyStateSlider hasFilters={banners.length > 0} />
                            </td>
                        </tr>
                    ) : (
                        items.map((banner) => (
                            <BannerRow
                                key={banner._id}
                                banner={banner}
                                isDragging={dragSourceId === banner._id}
                                isDragOver={dragOverId   === banner._id}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                                onDrop={handleDrop}
                                onError={setErrorMsg}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}