// File: frontend/components/admin/products/ProductVariantsForm.tsx
"use client";

import { useState, useMemo } from "react";
import type { TApiVariant, ProductWithCategoryResponse } from "@/src/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
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
    globalImagesPool: string[];
    onUploadToPool: (urls: string[]) => void;
}

export default function ProductVariantsForm({
    product,
    categoryAttributes,
    globalImagesPool,
    onUploadToPool,
}: Props) {
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

        const referenceAttrs = usedAttrsPerVariant.find((attrs) => attrs.length > 0) ?? [];

        usedAttrsPerVariant.forEach((attrs, index) => {
            referenceAttrs.forEach((refAttr) => {
                if (!attrs.includes(refAttr)) {
                    newErrors.push(`La variante #${index + 1} requiere un valor para "${refAttr}".`);
                }
            });

            const extraAttrs = attrs.filter((a) => !referenceAttrs.includes(a));
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
                const aIncomplete = variantAttributes.some((attr) => !a.atributos[attr.name]);
                const bIncomplete = variantAttributes.some((attr) => !b.atributos[attr.name]);
                return aIncomplete === bIncomplete ? 0 : aIncomplete ? -1 : 1;
            }
            if (method === "alphabetical") {
                const aSummary = variantAttributes.map((attr) => a.atributos[attr.name] || "").join("");
                const bSummary = variantAttributes.map((attr) => b.atributos[attr.name] || "").join("");
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

    const variantsToSubmit = useMemo(
        () =>
            variants.map((v) => ({
                ...v,
                atributos: Object.fromEntries(
                    Object.entries(v.atributos).filter(([key]) =>
                        variantAttributes.some((c) => c.name === key)
                    )
                ),
                imagenes: v.imagenes ?? [],
            })),
        [variants, variantAttributes]
    );

    if (!variantAttributes?.length) {
        return (
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500 italic text-center">
                La categoría seleccionada no tiene atributos configurados para generar variantes.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                    <p className="text-xs text-slate-500">
                        Gestiona precios, inventario y fotos específicas por combinación.
                    </p>
                </div>

                {variants.length > 1 && (
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        <NativeSelect
                            value={sortMethod}
                            onChange={(e) => handleSort(e.target.value)}
                            className="h-8 text-xs w-44"
                        >
                            <option value="default">Orden original</option>
                            <option value="incomplete">Incompletas primero</option>
                            <option value="alphabetical">Alfabético</option>
                            <option value="price">Menor Precio</option>
                            <option value="stock">Menor Stock</option>
                        </NativeSelect>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Revisar configuración de variantes:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                        {errors.slice(0, 3).map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                        {errors.length > 3 && <li>... y {errors.length - 3} avisos más.</li>}
                    </ul>
                </div>
            )}

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-2.5">
                {variants.map((variant, index) => {
                    const isIncomplete = variantAttributes.some((attr) => !variant.atributos[attr.name]);
                    const summary = variantAttributes
                        .map((attr) => variant.atributos[attr.name])
                        .filter(Boolean)
                        .join(" / ");

                    return (
                        <AccordionItem
                            key={variant._id}
                            value={variant._id!}
                            className={`border rounded-xl px-4 overflow-hidden transition-colors ${
                                isIncomplete
                                    ? "bg-rose-50/40 border-rose-200"
                                    : "bg-white border-slate-200"
                            }`}
                        >
                            <AccordionTrigger className="hover:no-underline py-3 cursor-pointer">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative shrink-0">
                                            {variant.imagenes?.[0] ? (
                                                <Image
                                                    src={variant.imagenes[0]}
                                                    alt=""
                                                    fill
                                                    className="object-contain"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-[10px] font-semibold text-slate-400">
                                                    #{index + 1}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-left space-y-0.5">
                                            <p
                                                className={`text-xs font-semibold ${
                                                    !summary ? "text-slate-400 italic" : "text-slate-900"
                                                }`}
                                            >
                                                {summary || "Variante sin configurar"}
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-mono">
                                                SKU: {variant.sku || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs pr-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                                                Precio
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                S/ {variant.precio?.toFixed(2) || "0.00"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end border-l border-slate-200 pl-4">
                                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                                                Stock
                                            </span>
                                            <span
                                                className={`font-semibold ${
                                                    variant.stock === 0 ? "text-rose-600" : "text-slate-900"
                                                }`}
                                            >
                                                {variant.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="pt-2 pb-4 space-y-4">
                                {/* MULTIMEDIA DE LA VARIANTE */}
                                <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                            Fotos de esta variante
                                        </span>
                                        <MediaLibraryDialog
                                            selectedImages={variant.imagenes || []}
                                            globalImagesPool={globalImagesPool}
                                            onConfirmSelection={(imgs) => updateVariant(index, "imagenes", imgs)}
                                            onUploadSuccess={onUploadToPool}
                                            triggerLabel="Asignar Fotos"
                                            triggerVariant="outline"
                                            size="sm"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
                                        {variant.imagenes && variant.imagenes.length > 0 ? (
                                            variant.imagenes.map((url, i) => (
                                                <div
                                                    key={i}
                                                    className="relative w-11 h-11 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs"
                                                >
                                                    <Image
                                                        src={url}
                                                        alt=""
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-slate-400 italic pl-1">
                                                Usa la foto principal o no tiene imágenes asignadas.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* ATRIBUTOS CON NATIVE SELECT */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {variantAttributes.map((attr) => (
                                        <div key={attr.name} className="space-y-1">
                                            <Label
                                                htmlFor={`var-${index}-${attr.name}`}
                                                className={`text-[11px] font-semibold uppercase tracking-wider ${
                                                    !variant.atributos[attr.name]
                                                        ? "text-rose-600"
                                                        : "text-slate-700"
                                                }`}
                                            >
                                                {attr.name}
                                            </Label>
                                            <NativeSelect
                                                id={`var-${index}-${attr.name}`}
                                                value={variant.atributos[attr.name] || ""}
                                                onChange={(e) => updateAttribute(index, attr.name, e.target.value)}
                                            >
                                                <option value="">Seleccionar {attr.name}...</option>
                                                {attr.values.map((val) => (
                                                    <option key={val} value={val}>
                                                        {val}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>
                                    ))}
                                </div>

                                {/* DATOS COMERCIALES */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-precio-${index}`} className="text-[11px] font-semibold text-slate-600">
                                            Precio Venta
                                        </Label>
                                        <Input
                                            id={`var-precio-${index}`}
                                            type="number"
                                            value={variant.precio ?? ""}
                                            onChange={(e) =>
                                                updateVariant(index, "precio", parseFloat(e.target.value) || 0)
                                            }
                                            min={0}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-comparativo-${index}`} className="text-[11px] font-semibold text-slate-600">
                                            Precio Regular
                                        </Label>
                                        <Input
                                            id={`var-comparativo-${index}`}
                                            type="number"
                                            value={variant.precioComparativo ?? ""}
                                            onChange={(e) =>
                                                updateVariant(
                                                    index,
                                                    "precioComparativo",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            min={0}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-stock-${index}`} className="text-[11px] font-semibold text-slate-600">
                                            Stock
                                        </Label>
                                        <Input
                                            id={`var-stock-${index}`}
                                            type="number"
                                            value={variant.stock ?? ""}
                                            onChange={(e) =>
                                                updateVariant(index, "stock", parseInt(e.target.value) || 0)
                                            }
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-sku-${index}`} className="text-[11px] font-semibold text-slate-600">
                                            SKU
                                        </Label>
                                        <Input
                                            id={`var-sku-${index}`}
                                            type="text"
                                            value={variant.sku ?? ""}
                                            onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                            className="font-mono uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeVariant(index)}
                                        className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                                        <span>Eliminar variante</span>
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            <div className="pt-2">
                <Button
                    type="button"
                    onClick={addVariant}
                    variant="outline"
                    className="w-full h-10 gap-2 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer shadow-xs"
                >
                    <Plus className="w-4 h-4 text-slate-500" />
                    <span>Añadir Nueva Variante</span>
                </Button>
            </div>

            {/* PERSISTENCIA DE DATOS PARA EL FORMULARIO */}
            <input
                type="hidden"
                name="variants"
                value={errors.length === 0 ? JSON.stringify(variantsToSubmit) : "[]"}
            />
            <input
                type="hidden"
                name="variants_error"
                value={errors.length > 0 ? "true" : "false"}
            />
        </div>
    );
}