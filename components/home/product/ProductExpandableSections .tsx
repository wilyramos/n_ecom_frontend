"use client";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import { Info, List, Package, Ruler } from "lucide-react";

type Props = {
    producto: ProductWithCategoryResponse
};

export default function ProductExpandableSections({ producto }: Props) {
    const descripcionRaw = producto.descripcion ?? "";
    const specsArray = producto.especificaciones ?? [];

    const hasWeight = Boolean(producto.weight);
    const hasDimensions = Boolean(
        producto.dimensions?.length ||
        producto.dimensions?.width ||
        producto.dimensions?.height
    );
    const hasPhysicalData = hasWeight || hasDimensions;

    const hasDescripcion = Boolean(descripcionRaw.trim().length > 0);
    const hasSpecs = Boolean(specsArray.length > 0 || hasPhysicalData);

    if (!hasDescripcion && !hasSpecs) return null;

    return (
        <Accordion type="multiple" className="w-full space-y-1 bg-surface-primary pt-4">
            
            {/* SECCIÓN 1: INFORMACIÓN (DESCRIPCIÓN) */}
            {hasDescripcion && (
                <AccordionItem value="info" className="border-b border-border-default">
                    <AccordionTrigger className="py-6 hover:no-underline group px-1">
                        <div className="flex items-center gap-3">
                            <Info size={20} className="text-fg-muted group-hover:text-action-primary-hover transition-colors" />
                            <span className="text-base font-semibold tracking-tight text-fg-primary">
                                Información del producto
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-10 pt-2 px-1">
                        <div className="prose prose-sm max-w-none 
                            text-fg-primary
                            prose-headings:text-fg-primary 
                            prose-headings:font-semibold
                            prose-strong:text-fg-primary
                            prose-strong:font-semibold
                            prose-p:leading-relaxed
                            prose-a:text-action-primary
                            prose-a:hover:text-action-primary-hover
                            text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: descripcionRaw }}
                        />
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* SECCIÓN 2: ESPECIFICACIONES TÉCNICAS Y FÍSICAS */}
            {hasSpecs && (
                <AccordionItem value="specs" className="border-b border-border-default">
                    <AccordionTrigger className="py-6 hover:no-underline group px-1">
                        <div className="flex items-center gap-3">
                            <List size={20} className="text-fg-muted group-hover:text-action-primary-hover transition-colors" />
                            <span className="text-base font-semibold tracking-tight text-fg-primary">
                                Especificaciones técnicas
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-10 pt-2 px-1">
                        <div className="flex flex-col gap-6 w-full">
                            
                            {/* Tabla de especificaciones dinámicas */}
                            {specsArray.length > 0 && (
                                <div className="w-full overflow-hidden border border-border-default bg-surface-primary">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-fg-primary border-b border-border-default bg-surface-secondary">
                                                    Características
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-default">
                                            {specsArray.map((spec) => (
                                                <tr key={spec.key} className="group hover:bg-surface-secondary transition-colors">
                                                    <td className="px-5 py-3 text-xs font-medium text-fg-muted w-[40%]">
                                                        {spec.key}
                                                    </td>
                                                    <td className="px-5 py-3 text-sm font-semibold text-fg-primary w-[60%]">
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Tabla de datos físicos */}
                            {hasPhysicalData && (
                                <div className="w-full overflow-hidden border border-border-default bg-surface-primary">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-fg-primary border-b border-border-default bg-surface-secondary">
                                                    <div className="flex items-center gap-2">
                                                        <Package size={13} />
                                                        Físico y embalaje
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-default">
                                            {hasWeight && (
                                                <tr className="group hover:bg-surface-secondary transition-colors">
                                                    <td className="px-5 py-3 text-xs font-medium text-fg-muted w-[40%]">
                                                        Peso
                                                    </td>
                                                    <td className="px-5 py-3 text-sm font-semibold text-fg-primary w-[60%]">
                                                        {producto.weight} kg
                                                    </td>
                                                </tr>
                                            )}
                                            {hasDimensions && (
                                                <tr className="group hover:bg-surface-secondary transition-colors">
                                                    <td className="px-5 py-3 text-xs font-medium text-fg-muted w-[40%]">
                                                        <div className="flex items-center gap-1.5">
                                                            <Ruler size={11} />
                                                            Dimensiones
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-sm font-semibold text-fg-primary w-[60%]">
                                                        {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height} cm
                                                        <span className="ml-1.5 block text-[10px] font-normal text-fg-muted md:inline">
                                                            (largo × ancho × alto)
                                                        </span>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}

        </Accordion>
    );
}