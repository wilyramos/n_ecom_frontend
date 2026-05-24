"use client";

import { useState } from "react";
import { Search, Globe, ChevronRight, Edit3 } from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Tipos
import type { TApiProduct } from "@/src/schemas";

interface SEOProductProps {
    product?: TApiProduct;
}

export default function SEOProduct({ product }: SEOProductProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
    const [metaDescription, setMetaDescription] = useState(product?.metaDescription ?? "");

    const titleLen = metaTitle.length;
    const descLen = metaDescription.length;

    // Lógica de colores semánticos usando tus variables
    const getCounterColor = (len: number, max: number) => {
        if (len === 0) return "text-[var(--color-text-tertiary)]";
        return len <= max ? "text-[var(--color-success)]" : "text-[var(--color-accent-warm)]";
    };

    // Limpieza de HTML para la descripción por defecto
    const plainDescription = product?.descripcion?.replace(/<[^>]*>/g, "") || "";

    return (
        <div className="p-5 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] rounded-xl space-y-4">
            
            {/* Inputs ocultos para que el Server Action reciba los datos */}
            <input type="hidden" name="metaTitle" value={metaTitle} />
            <input type="hidden" name="metaDescription" value={metaDescription} />

            {/* Header de la sección */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[var(--color-bg-tertiary)] rounded-md">
                        <Globe className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
                        SEO & Metadatos
                    </span>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button 
                            type="button"
                            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Editar
                        </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-2xl bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Search className="w-5 h-5 text-[var(--color-accent-warm)]" />
                                Optimización SEO
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Vista Previa Google dentro del Modal */}
                            <div className="border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] p-5 rounded-lg space-y-1">
                                <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-tight mb-2">
                                    Vista previa en buscadores
                                </p>
                                <p className="text-[#1a0dab] text-xl font-medium truncate leading-tight">
                                    {metaTitle || product?.nombre || "Título del producto | neoshop"}
                                </p>
                                <p className="text-[#006621] text-[14px] flex items-center gap-1">
                                    https://neoshopimportaciones.com <ChevronRight className="w-3 h-3 text-[var(--color-text-tertiary)]" /> {product?.slug ?? "producto"}
                                </p>
                                <p className="text-[14px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed pt-1">
                                    {metaDescription || plainDescription || "Optimiza tu presencia en Google con una descripción atractiva..."}
                                </p>
                            </div>

                            {/* Inputs de edición */}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <LabelWithTooltip 
                                            htmlFor="metaTitle"
                                            label="Meta Title" 
                                            tooltip="Aparece como el título azul en Google." 
                                        />
                                        <span className={`text-[10px] font-bold ${getCounterColor(titleLen, 60)}`}>
                                            {titleLen} / 60
                                        </span>
                                    </div>
                                    <Input 
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        placeholder="Ej: iPhone 15 Pro Max Titanium | neoshop"
                                        className="bg-[var(--color-bg-primary)] border-[var(--color-border-strong)]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <LabelWithTooltip 
                                            label="Meta Description" 
                                            tooltip="El texto que convence al usuario de hacer clic."
                                            htmlFor="metaDescription"
                                        />
                                        <span className={`text-[10px] font-bold ${getCounterColor(descLen, 160)}`}>
                                            {descLen} / 160
                                        </span>
                                    </div>
                                    <Textarea 
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Escribe un resumen atractivo del producto..."
                                        className="bg-[var(--color-bg-primary)] border-[var(--color-border-strong)] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="border-t border-[var(--color-border-subtle)] pt-4">
                            <Button 
                                className="w-full bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-text-inverse)]"
                                onClick={() => setIsOpen(false)}
                            >
                                Confirmar Cambios SEO
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Preview Simplificada en el Formulario Principal */}
            <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border-default)]">
                <p className="text-[13px] font-bold text-[#1a0dab] truncate">
                    {metaTitle || product?.nombre || "Sin título definido"}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1 mt-1">
                    {metaDescription || plainDescription || "Sin descripción meta..."}
                </p>
            </div>

            <p className="text-[10px] text-[var(--color-text-tertiary)] italic leading-tight">
                * Los metadatos optimizados mejoran el ranking en buscadores y el CTR de tus productos.
            </p>
        </div>
    );
}