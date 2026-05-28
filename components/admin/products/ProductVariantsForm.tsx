"use client";

import { useState, useMemo } from "react";
import type { TApiVariant, ProductWithCategoryResponse } from "@/src/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, AlertCircle, ArrowUpDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import MediaLibraryDialog from "./MediaLibraryDialog";

interface CategoryAttr {
    name: string;
    values: string[];
    isVariant?: boolean;
}

interface Props {
    product?: ProductWithCategoryResponse;
    categoryAttributes: CategoryAttr[];
    globalImagesPool: string[];     // Pool de imágenes del padre
    onUploadToPool: (urls: string[]) => void; // Función para subir al padre
}

export default function ProductVariantsForm({ product, categoryAttributes, globalImagesPool, onUploadToPool }: Props) {
    const variantAttributes = categoryAttributes.filter((attr) => attr.isVariant);
    const [variants, setVariants] = useState<TApiVariant[]>(product?.variants ?? []);
    const [errors, setErrors] = useState<string[]>([]);
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [sortMethod, setSortMethod] = useState<string>("default");

    
    const getValidationErrors = (currentVariants: TApiVariant[]) => {
        const newErrors: string[] = [];
        if (!variantAttributes.length) return newErrors;

        const usedAttrsPerVariant = currentVariants.map((variant) => {
            return Object.entries(variant.atributos)
                .filter(([, val]) => val && val.trim() !== "")
                .map(([key]) => key);
        });

        const referenceAttrs = usedAttrsPerVariant.find(attrs => attrs.length > 0) ?? [];

        usedAttrsPerVariant.forEach((attrs, index) => {
            referenceAttrs.forEach((refAttr) => {
                if (!attrs.includes(refAttr)) {
                    newErrors.push(`La variante #${index + 1} requiere un valor para "${refAttr}".`);
                }
            });

            const extraAttrs = attrs.filter(a => !referenceAttrs.includes(a));
            if (extraAttrs.length) {
                newErrors.push(`La variante #${index + 1} tiene atributos extra: ${extraAttrs.join(", ")}.`);
            }
        });
        return newErrors;
    };

    const handleSort = (method: string) => {
        setSortMethod(method);
        if (method === "default") return;

        const sorted = [...variants].sort((a, b) => {
            if (method === "incomplete") {
                const aIncomplete = variantAttributes.some(attr => !a.atributos[attr.name]);
                const bIncomplete = variantAttributes.some(attr => !b.atributos[attr.name]);
                return aIncomplete === bIncomplete ? 0 : aIncomplete ? -1 : 1;
            }
            if (method === "alphabetical") {
                const aSummary = variantAttributes.map(attr => a.atributos[attr.name] || "").join("");
                const bSummary = variantAttributes.map(attr => b.atributos[attr.name] || "").join("");
                return aSummary.localeCompare(bSummary);
            }
            if (method === "price") return (a.precio || 0) - (b.precio || 0);
            if (method === "stock") return (a.stock || 0) - (b.stock || 0);
            return 0;
        });
        setVariants(sorted);
    };

    const addVariant = (event: React.FormEvent) => {
        event.preventDefault();
        const attributes: Record<string, string> = {};
        variantAttributes.forEach((attr) => (attributes[attr.name] = ""));

        const newVariant: TApiVariant = {
            _id: crypto.randomUUID(),
            precio: 0,
            precioComparativo: 0,
            stock: 0,
            sku: "",
            barcode: "",
            atributos: attributes,
            imagenes: [],
        };

        const nextVariants = [...variants, newVariant];
        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
        setOpenItems((prev) => [...prev, newVariant._id!]);
        setSortMethod("default");
    };

    const updateVariant = <K extends keyof TApiVariant>(index: number, key: K, value: TApiVariant[K]) => {
        const nextVariants = [...variants];
        nextVariants[index] = { ...nextVariants[index], [key]: value };
        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
    };

    const updateAttribute = (index: number, attrName: string, value: string) => {
        const nextVariants = [...variants];
        nextVariants[index] = {
            ...nextVariants[index],
            atributos: { ...nextVariants[index].atributos, [attrName]: value },
        };
        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
    };

    const removeVariant = (index: number) => {
        const nextVariants = variants.filter((_, i) => i !== index);
        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
    };

    const variantsToSubmit = useMemo(() => variants.map(v => ({
        ...v,
        atributos: Object.fromEntries(
            Object.entries(v.atributos).filter(([key]) =>
                variantAttributes.some(c => c.name === key)
            )
        ),
        imagenes: v.imagenes ?? [],
    })), [variants, variantAttributes]);

    if (!variantAttributes?.length) {
        return (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-sm text-gray-500 italic text-center">
                La categoría seleccionada no tiene atributos configurados para generar variantes.
            </div>
        );
    }

    return (
        <div className="space-y-4 my-4 border rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center border-b pb-4">
                <div className="space-y-0.5">
                    <h3 className="text-sm font-bold uppercase tracking-tight">Variantes del Producto</h3>
                    <p className="text-[10px] text-muted-foreground">Gestiona precios, stock y fotos específicas por combinación.</p>
                </div>

                {variants.length > 1 && (
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                        <Select value={sortMethod} onValueChange={handleSort}>
                            <SelectTrigger className="h-8 w-[160px] text-[10px] uppercase font-bold">
                                <SelectValue placeholder="Ordenar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Orden original</SelectItem>
                                <SelectItem value="incomplete">Incompletas primero</SelectItem>
                                <SelectItem value="alphabetical">Alfabético</SelectItem>
                                <SelectItem value="price">Menor Precio</SelectItem>
                                <SelectItem value="stock">Menor Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-[11px] space-y-1">
                    <div className="flex items-center gap-2 font-black uppercase">
                        <AlertCircle className="w-3.5 h-3.5" /> Errores de configuración:
                    </div>
                    <ul className="list-disc list-inside opacity-90 font-medium">
                        {errors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
                        {errors.length > 3 && <li>... y {errors.length - 3} avisos más.</li>}
                    </ul>
                </div>
            )}

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
                {variants.map((variant, index) => {
                    const isIncomplete = variantAttributes.some(attr => !variant.atributos[attr.name]);
                    const summary = variantAttributes
                        .map((attr) => variant.atributos[attr.name])
                        .filter(Boolean)
                        .join(" / ");

                    return (
                        <AccordionItem
                            key={variant._id}
                            value={variant._id!}
                            className={`border rounded-lg px-4 overflow-hidden transition-colors ${isIncomplete ? "bg-red-50/30 border-red-100" : "bg-card"}`}
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center border overflow-hidden relative">
                                            {variant.imagenes?.[0] ? (
                                                <Image src={variant.imagenes[0]} alt="" fill className="object-cover" unoptimized />
                                            ) : (
                                                <span className="text-[10px] font-bold text-muted-foreground/50">#{(index + 1)}</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[11px] font-black uppercase tracking-wider ${!summary ? 'text-muted-foreground italic' : ''}`}>
                                                {summary || "Variante nueva"}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium">SKU: {variant.sku || '—'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter pr-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-muted-foreground">Precio</span>
                                            <span>S/ {variant.precio || '0.00'}</span>
                                        </div>
                                        <div className="flex flex-col items-end border-l pl-4">
                                            <span className="text-muted-foreground">Stock</span>
                                            <span className={variant.stock === 0 ? 'text-destructive' : ''}>{variant.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="pt-2 pb-6 space-y-6">
                                {/* MULTIMEDIA DE LA VARIANTE */}
                                <div className="p-4 rounded-xl border border-dashed bg-muted/20 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Multimedia Específica</Label>
                                        <MediaLibraryDialog 
                                            selectedImages={variant.imagenes || []}
                                            globalImagesPool={globalImagesPool}
                                            onConfirmSelection={(imgs) => updateVariant(index, "imagenes", imgs)}
                                            onUploadSuccess={onUploadToPool}
                                            triggerLabel="Asignar Fotos"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[48px] items-center">
                                        {variant.imagenes && variant.imagenes.length > 0 ? (
                                            variant.imagenes.map((url, i) => (
                                                <div key={i} className="relative w-12 h-12 rounded-lg border bg-white overflow-hidden shadow-sm group">
                                                    <Image src={url} alt="" fill className="object-cover" unoptimized />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-muted-foreground italic pl-1">Esta variante usa la imagen principal o no tiene fotos asignadas.</p>
                                        )}
                                    </div>
                                </div>

                                {/* ATRIBUTOS */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {variantAttributes.map((attr) => (
                                        <div key={attr.name} className="space-y-1.5">
                                            <Label className={`text-[10px] font-bold uppercase ${!variant.atributos[attr.name] ? 'text-destructive' : ''}`}>
                                                {attr.name}
                                            </Label>
                                            <Select
                                                value={variant.atributos[attr.name] || ""}
                                                onValueChange={(val) => updateAttribute(index, attr.name, val === "__none__" ? "" : val)}
                                            >
                                                <SelectTrigger className="h-9 text-xs font-medium">
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">— Ninguno —</SelectItem>
                                                    {attr.values.map((val) => (
                                                        <SelectItem key={val} value={val}>{val}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>

                                {/* DATOS COMERCIALES */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Precio</Label>
                                        <Input
                                            type="number"
                                            value={variant.precio ?? ""}
                                            onChange={(e) => updateVariant(index, "precio", parseFloat(e.target.value) || 0)}
                                            className="h-9 text-xs font-mono"
                                            min={0}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Precio Comparativo</Label>
                                        <Input
                                            type="number"
                                            value={variant.precioComparativo ?? ""}
                                            onChange={(e) => updateVariant(index, "precioComparativo", parseFloat(e.target.value) || 0)}
                                            className="h-9 text-xs font-mono"
                                            min={0}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Stock</Label>
                                        <Input
                                            type="number"
                                            value={variant.stock ?? ""}
                                            onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                                            className="h-9 text-xs font-mono"
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">SKU</Label>
                                        <Input
                                            type="text"                                            value={variant.sku ?? ""}
                                            onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                            className="h-9 text-xs font-mono uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t pt-4 mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeVariant(index)}
                                        className="h-8 text-[10px] font-bold uppercase text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                        Eliminar Variante
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            <div className="pt-4 flex gap-3">
                <Button 
                    onClick={addVariant} 
                    size="sm" 
                    variant="default" 
                    className="flex-1 h-10 gap-2 border-dashed border-2 font-bold uppercase text-[11px]"
                >
                    <Plus className="w-4 h-4" /> Añadir Nueva Variante
                </Button>
            </div>

            {/* PERSISTENCIA DE DATOS PARA EL FORMULARIO */}
            <input type="hidden" name="variants" value={errors.length === 0 ? JSON.stringify(variantsToSubmit) : "[]"} />
            <input type="hidden" name="variants_error" value={errors.length > 0 ? "true" : "false"} />
        </div>
    );
}