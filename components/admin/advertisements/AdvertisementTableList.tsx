"use client";

import { useState, useTransition } from "react";
import { TAdvertisement, AD_LAYOUT_LABELS } from "@/src/schemas/advertisement.schema";
import { toggleAdStatusAction, deleteAdvertisementAction } from "@/actions/advertisement-actions";
import { Edit2, Trash2, Calendar, Eye, EyeOff, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdvertisementTableListProps {
    initialAds: TAdvertisement[];
}

export default function AdvertisementTableList({ initialAds }: AdvertisementTableListProps) {
    const [ads, setAds]             = useState<TAdvertisement[]>(initialAds);
    const [isPending, startTransition] = useTransition();
    const [errorMsg, setErrorMsg]   = useState<string | null>(null);

    // Sincroniza cuando el padre revalida y entrega nuevos datos por prop
    // Solo si no hay una transición en curso para evitar sobreescribir el optimismo
    if (ads !== initialAds && !isPending) {
        setAds(initialAds);
    }

    const handleToggleActive = (id: string, currentStatus: boolean) => {
        setErrorMsg(null);
        // Actualización optimista inmediata
        setAds(prev =>
            prev.map(ad => ad._id === id ? { ...ad, isActive: !currentStatus } : ad)
        );

        startTransition(async () => {
            const res = await toggleAdStatusAction(id, currentStatus);
            if (!res.ok) {
                // Revierte si el servidor falla
                setAds(prev =>
                    prev.map(ad => ad._id === id ? { ...ad, isActive: currentStatus } : ad)
                );
                setErrorMsg(res.error || "No se pudo cambiar el estado del anuncio.");
            }
        });
    };

    const handleDeleteAd = (id: string) => {
        setErrorMsg(null);
        if (!confirm("¿Estás absolutamente seguro de eliminar permanentemente esta campaña publicitaria?")) return;

        startTransition(async () => {
            const res = await deleteAdvertisementAction(id);
            if (res.ok) {
                setAds(prev => prev.filter(ad => ad._id !== id));
            } else {
                setErrorMsg(res.error || "Error al procesar la eliminación.");
            }
        });
    };

    const layoutBadgeClass = (layout: string) =>
        layout === "modal_popup"
            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

    return (
        <div className="w-full space-y-3">

            {/* ── Banner de error no bloqueante (reemplaza alert()) ── */}
            {errorMsg && (
                <div className="flex items-center justify-between gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2.5 text-xs text-destructive font-medium">
                    <span>{errorMsg}</span>
                    <button
                        type="button"
                        onClick={() => setErrorMsg(null)}
                        className="shrink-0 text-destructive/70 hover:text-destructive transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="w-full overflow-hidden border border-border/60 rounded-xl bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                                <th className="py-3 px-4 w-[28%]">Detalle de Campaña</th>
                                <th className="py-3 px-4 w-[14%]">Miniatura</th>
                                <th className="py-3 px-4 w-[17%]">Formato</th>
                                <th className="py-3 px-4 w-[18%]">Vigencia Temporal</th>
                                <th className="py-3 px-4 w-[10%] text-center">Estado</th>
                                <th className="py-3 px-4 w-[13%] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-xs font-medium">
                            {ads.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                        No hay campañas publicitarias registradas.
                                    </td>
                                </tr>
                            )}
                            {ads.map((ad) => {
                                const hasDate = ad.startDate || ad.endDate;

                                return (
                                    <tr key={ad._id} className="hover:bg-muted/10 transition-colors group">

                                        {/* Detalle */}
                                        <td className="py-3 px-4 max-w-[200px]">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-foreground text-sm line-clamp-1">{ad.title}</p>
                                                {ad.subtitle && (
                                                    <p className="text-muted-foreground text-[11px] line-clamp-1">{ad.subtitle}</p>
                                                )}
                                                {ad.linkTo && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] text-primary/80 font-mono mt-1 break-all">
                                                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                                        {ad.linkTo}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Miniatura */}
                                        <td className="py-3 px-4">
                                            {ad.imageUrl ? (
                                                <div className="relative h-10 w-16 overflow-hidden rounded border border-border bg-muted/40 shadow-2xs">
                                                    <Image
                                                        src={ad.imageUrl}
                                                        alt={ad.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground/60 font-mono italic">
                                                    Sin imagen
                                                </span>
                                            )}
                                        </td>

                                        {/* Formato */}
                                        <td className="py-3 px-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold border",
                                                layoutBadgeClass(ad.layout)
                                            )}>
                                                {AD_LAYOUT_LABELS[ad.layout]}
                                            </span>
                                        </td>

                                        {/* Vigencia */}
                                        <td className="py-3 px-4 text-muted-foreground">
                                            {hasDate ? (
                                                <div className="flex flex-col gap-0.5 text-[10px] leading-tight font-mono">
                                                    {ad.startDate && (
                                                        <span>Inicia: {new Date(ad.startDate).toLocaleDateString("es-PE")}</span>
                                                    )}
                                                    {ad.endDate && (
                                                        <span>Vence: {new Date(ad.endDate).toLocaleDateString("es-PE")}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-semibold text-emerald-600/90 dark:text-emerald-400/90 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Siempre Vigente
                                                </span>
                                            )}
                                        </td>

                                        {/* Estado (toggle) */}
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() => handleToggleActive(ad._id, ad.isActive)}
                                                aria-label={ad.isActive ? "Desactivar de tienda" : "Activar en tienda"}
                                                title={ad.isActive ? "Desactivar de tienda" : "Activar en tienda"}
                                                className={cn(
                                                    "p-1.5 rounded-lg border transition-all cursor-pointer outline-none mx-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
                                                    ad.isActive
                                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                                                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                                )}
                                            >
                                                {ad.isActive
                                                    ? <Eye className="w-3.5 h-3.5" />
                                                    : <EyeOff className="w-3.5 h-3.5" />
                                                }
                                            </button>
                                        </td>

                                        {/* Acciones */}
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link href={`/admin/advertisements/${ad._id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                                        aria-label={`Editar campaña ${ad.title}`}
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isPending}
                                                    onClick={() => handleDeleteAd(ad._id)}
                                                    aria-label={`Eliminar campaña ${ad.title}`}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}