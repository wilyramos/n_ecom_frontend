"use client";

import { useOptimistic, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    GripVertical, Pencil, Eye, Layers,
    ToggleLeft, ToggleRight,
} from "lucide-react";
import { toggleSliderBannerAction } from "@/actions/slider-actions";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import DeleteSliderButton from "./DeleteSliderButton";
import { TableRow, TableCell } from "@/components/ui/table";

const LAYOUT_LABEL: Record<string, string> = {
    "image-only": "Solo imagen",
    "default": "Texto + imagen",
    "media-left": "Imagen izquierda",
    "background-media": "Fondo",
};

interface BannerRowProps {
    banner: SliderBanner;
    isDragging: boolean;
    isDragOver: boolean;
    onDragStart: (id: string) => void;
    onDragOver: (e: React.DragEvent, id: string) => void;
    onDragEnd: () => void;
    onDrop: (targetId: string) => void;
    onError: (msg: string) => void;
}

export default function BannerRow({
    banner,
    isDragging, isDragOver,
    onDragStart, onDragOver, onDragEnd, onDrop,
    onError,
}: BannerRowProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticActive, setOptimistic] = useOptimistic(banner.isActive);

    const handleToggle = () => {
        startTransition(async () => {
            setOptimistic(!optimisticActive);
            const result = await toggleSliderBannerAction(banner._id);
            if (!result.success) onError(result.message);
        });
    };

    return (
        <TableRow
            draggable
            onDragStart={() => onDragStart(banner._id)}
            onDragOver={(e) => onDragOver(e, banner._id)}
            onDragEnd={onDragEnd}
            onDrop={() => onDrop(banner._id)}
            className={[
                "group select-none transition-colors",
                isDragging ? "opacity-40" : "",
                isDragOver ? "bg-[var(--color-action-primary-light)]" : "",
            ].join(" ")}
        >
            {/* Handle */}
            <TableCell className="w-8 px-3">
                <GripVertical
                    className="h-4 w-4 cursor-grab active:cursor-grabbing"
                    style={{ color: "var(--color-text-tertiary)" }}
                />
            </TableCell>

            {/* Thumbnail + nombre interno + título */}
            <TableCell>
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="relative h-9 w-14 shrink-0 rounded-md overflow-hidden"
                        style={{ border: "1px solid var(--color-border-subtle)" }}
                    >
                        {banner.media?.imageUrl ? (
                            <Image
                                src={banner.media.imageUrl}
                                alt={banner.media.altText ?? banner.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                            />
                        ) : (
                            <div
                                className="flex h-full w-full items-center justify-center"
                                style={{ background: "var(--color-bg-tertiary)" }}
                            >
                                <Layers
                                    className="h-3.5 w-3.5"
                                    style={{ color: "var(--color-text-tertiary)" }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        {/* name es el identificador interno, siempre presente */}
                        <p
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            {banner.name}
                        </p>
                        {/* título es el texto visible en el banner, opcional */}
                        {banner.title && (
                            <p
                                className="text-xs truncate mt-0.5"
                                style={{ color: "var(--color-text-tertiary)" }}
                            >
                                {banner.title}
                            </p>
                        )}
                    </div>
                </div>
            </TableCell>

            {/* Layout */}
            <TableCell>
                <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                        background: "var(--color-bg-tertiary)",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {LAYOUT_LABEL[banner.design.layout] ?? banner.design.layout}
                </span>
            </TableCell>

            {/* Orden */}
            <TableCell>
                <span
                    className="text-sm tabular-nums"
                    style={{ color: "var(--color-text-tertiary)" }}
                >
                    #{banner.order}
                </span>
            </TableCell>

            {/* Estado */}
            <TableCell>
                <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={optimisticActive
                        ? { background: "var(--color-success-light)", color: "var(--color-success)" }
                        : { background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }
                    }
                >
                    {optimisticActive ? "Activo" : "Inactivo"}
                </span>
            </TableCell>

            {/* Acciones */}
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                    <ActionIcon href={`/admin/slider/${banner._id}/preview`} label="Preview">
                        <Eye className="h-3.5 w-3.5" />
                    </ActionIcon>
                    <ActionIcon href={`/admin/slider/${banner._id}`} label="Editar">
                        <Pencil className="h-3.5 w-3.5" />
                    </ActionIcon>
                    <button
                        onClick={handleToggle}
                        disabled={isPending}
                        className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
                        style={{
                            color: optimisticActive
                                ? "var(--color-success)"
                                : "var(--color-text-tertiary)"
                        }}
                        aria-label={optimisticActive ? "Desactivar" : "Activar"}
                    >
                        {optimisticActive
                            ? <ToggleRight className="h-4 w-4" />
                            : <ToggleLeft className="h-4 w-4" />
                        }
                    </button>
                    <DeleteSliderButton
                        bannerId={banner._id}
                        bannerName={banner.name}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}

function ActionIcon({ href, label, children }: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-surface-hover)]"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-label={label}
            title={label}
        >
            {children}
        </Link>
    );
}