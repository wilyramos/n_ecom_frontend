// File: src/components/admin/slider/BannerRow.tsx
"use client";

import { useOptimistic, useTransition, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Pencil,
    Eye,
    Layers,
    ToggleLeft,
    ToggleRight,
    ImageIcon,
    PanelLeft,
    SquareSplitHorizontal,
    Maximize,
} from "lucide-react";
import { toggleSliderBannerAction } from "@/actions/slider-actions";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import DeleteSliderButton from "./DeleteSliderButton";
import { AdminTableRow, AdminTableCell } from "@/src/components/admin/layout/admin-table";
import { cn } from "@/lib/utils";

const LAYOUT_CONFIG: Record<
    string,
    { label: string; icon: ElementType; style: string }
> = {
    "default": {
        label: "Texto + Imagen",
        icon: SquareSplitHorizontal,
        style: "bg-blue-50 text-blue-700 border-blue-200",
    },
    "media-left": {
        label: "Imagen Izquierda",
        icon: PanelLeft,
        style: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    "background-media": {
        label: "Fondo Completo",
        icon: Maximize,
        style: "bg-purple-50 text-purple-700 border-purple-200",
    },
    "image-only": {
        label: "Solo Imagen",
        icon: ImageIcon,
        style: "bg-slate-100 text-slate-700 border-slate-200",
    },
};

interface BannerRowProps {
    banner: SliderBanner;
    onError: (msg: string) => void;
}

export default function BannerRow({ banner, onError }: BannerRowProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticActive, setOptimistic] = useOptimistic(banner.isActive);

    const handleToggle = () => {
        startTransition(async () => {
            setOptimistic(!optimisticActive);
            const result = await toggleSliderBannerAction(banner._id);
            if (!result.success) onError(result.message);
        });
    };

    const layout = LAYOUT_CONFIG[banner.design?.layout] ?? {
        label: banner.design?.layout || "Personalizado",
        icon: Layers,
        style: "bg-slate-100 text-slate-700 border-slate-200",
    };
    const LayoutIcon = layout.icon;

    return (
        <AdminTableRow id={banner._id} isDraggable>
            {/* Miniatura + Título */}
            <AdminTableCell>
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-10 w-16 shrink-0 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                        {banner.media?.imageUrl ? (
                            <Image
                                src={banner.media.imageUrl}
                                alt={banner.title || "Banner Image"}
                                fill
                                className={cn(
                                    "object-cover",
                                    banner.media.objectFit === "contain" && "object-contain"
                                )}
                                sizes="64px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Layers className="h-4 w-4 text-slate-400" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                            {banner.title || "Sin título definido"}
                        </p>
                        {banner.subtitle && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {banner.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </AdminTableCell>

            {/* Layout Badge */}
            <AdminTableCell>
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border",
                        layout.style
                    )}
                >
                    <LayoutIcon className="h-3 w-3 shrink-0" />
                    {layout.label}
                </span>
            </AdminTableCell>

            {/* Orden */}
            <AdminTableCell>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                    #{banner.order}
                </span>
            </AdminTableCell>

            {/* Estado */}
            <AdminTableCell>
                <span
                    className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border",
                        optimisticActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                >
                    {optimisticActive ? "Activo" : "Inactivo"}
                </span>
            </AdminTableCell>

            {/* Acciones */}
            <AdminTableCell align="right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={`/admin/slider/${banner._id}/preview`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        title="Vista Previa"
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                        href={`/admin/slider/${banner._id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        title="Editar"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                        type="button"
                        onClick={handleToggle}
                        disabled={isPending}
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-40 cursor-pointer",
                            optimisticActive
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        )}
                        aria-label={optimisticActive ? "Desactivar" : "Activar"}
                    >
                        {optimisticActive ? (
                            <ToggleRight className="h-4 w-4" />
                        ) : (
                            <ToggleLeft className="h-4 w-4" />
                        )}
                    </button>
                    <DeleteSliderButton
                        bannerId={banner._id}
                        bannerName={banner.title ?? "Banner"}
                    />
                </div>
            </AdminTableCell>
        </AdminTableRow>
    );
}