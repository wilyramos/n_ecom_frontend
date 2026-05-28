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

    const getCounterColor = (len: number, max: number) => {
        if (len === 0) return "text-muted-foreground";
        return len <= max ? "text-emerald-600" : "text-destructive";
    };

    const plainDescription = product?.descripcion?.replace(/<[^>]*>/g, "") || "";

    return (
        <div className="p-5 border border-border bg-card rounded-xl space-y-4">
            
            <input type="hidden" name="metaTitle" value={metaTitle} />
            <input type="hidden" name="metaDescription" value={metaDescription} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-muted rounded-md">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                        SEO & Metadatos
                    </span>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-primary hover:text-primary/90">
                            <Edit3 className="w-3.5 h-3.5" /> Editar
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-2xl bg-background border-border">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Search className="w-5 h-5 text-primary" />
                                Optimización SEO
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Vista Previa */}
                            <div className="border border-border bg-muted/30 p-5 rounded-lg space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-2">
                                    Vista previa en buscadores
                                </p>
                                <p className="text-[#1a0dab] text-xl font-medium truncate leading-tight">
                                    {metaTitle || product?.nombre || "Título del producto | neoshop"}
                                </p>
                                <p className="text-[#006621] text-[14px] flex items-center gap-1">
                                    https://neoshopimportaciones.com <ChevronRight className="w-3 h-3 text-muted-foreground" /> {product?.slug ?? "producto"}
                                </p>
                                <p className="text-[14px] text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                                    {metaDescription || plainDescription || "Optimiza tu presencia en Google con una descripción atractiva..."}
                                </p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <LabelWithTooltip htmlFor="metaTitle" label="Meta Title" tooltip="Aparece como el título azul en Google." />
                                        <span className={`text-[10px] font-bold ${getCounterColor(titleLen, 60)}`}>
                                            {titleLen} / 60
                                        </span>
                                    </div>
                                    <Input 
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        placeholder="Ej: iPhone 15 Pro Max Titanium | neoshop"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <LabelWithTooltip label="Meta Description" tooltip="Texto persuasivo para el buscador." htmlFor="metaDescription" />
                                        <span className={`text-[10px] font-bold ${getCounterColor(descLen, 160)}`}>
                                            {descLen} / 160
                                        </span>
                                    </div>
                                    <Textarea 
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Escribe un resumen atractivo del producto..."
                                        className="resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="border-t border-border pt-4">
                            <Button className="w-full" onClick={() => setIsOpen(false)}>
                                Confirmar Cambios SEO
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Preview Simplificada */}
            <div className="p-4 rounded-lg bg-muted/20 border border-border border-dashed">
                <p className="text-[13px] font-bold text-[#1a0dab] truncate">
                    {metaTitle || product?.nombre || "Sin título definido"}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">
                    {metaDescription || plainDescription || "Sin descripción meta..."}
                </p>
            </div>

            <p className="text-[10px] text-muted-foreground italic leading-tight">
                * Los metadatos optimizados mejoran el ranking en buscadores y el CTR de tus productos.
            </p>
        </div>
    );
}