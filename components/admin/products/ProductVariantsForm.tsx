// File: frontend/components/admin/products/ProductVariantsForm.tsx
"use client";

import { useState, useMemo } from "react";
import type { TApiVariant, ProductWithCategoryResponse } from "@/src/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Trash2, Plus, AlertCircle, ArrowUpDown, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { MediaPicker } from "@/src/modules/media";

interface CategoryAttr {
    name: string;
    values: string[];
    isVariant?: boolean;
}

interface Props {
    product?: ProductWithCategoryResponse;
    categoryAttributes: CategoryAttr[];
}

type Draft = TApiVariant;

/** Fila sin ningún dato (la que deja "Añadir variante"). No bloquea ni se guarda. */
const isDraft = (variant: Draft, axisNames: string[]) =>
    axisNames.every((name) => !(variant.atributos[name] ?? "").trim()) &&
    !(variant.sku ?? "").trim() &&
    !(variant.barcode ?? "").trim() &&
    !(Number(variant.precio ?? 0) > 0);

export default function ProductVariantsForm({ product, categoryAttributes }: Props) {
    const variantAttributes = categoryAttributes.filter((attr) => attr.isVariant);

    // Ejes que usa ESTE producto. Si nunca se eligieron (producto antiguo), se usan todos.
    const savedAxes = (product as { variantAxes?: string[] } | undefined)?.variantAxes ?? [];
    const [activeAxisNames, setActiveAxisNames] = useState<string[]>(() =>
        savedAxes.length > 0 ? savedAxes : variantAttributes.map((a) => a.name)
    );
    const activeAxes = variantAttributes.filter((a) => activeAxisNames.includes(a.name));
    const activeNames = activeAxes.map((a) => a.name);

    const [variants, setVariants] = useState<Draft[]>(product?.variants ?? []);
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [sortMethod, setSortMethod] = useState<string>("default");

    /** Errores REALES: filas incompletas, valores inválidos, duplicados, precios incoherentes. */
    const getValidationErrors = (rows: Draft[]): string[] => {
        const newErrors: string[] = [];
        if (!activeAxes.length) return newErrors;

        const seenCombinations = new Map<string, number>();
        const seenSkus = new Map<string, number>();
        const quoted = (names: string[]) => names.map((n) => `"${n}"`).join(" y ");

        rows.forEach((variant, index) => {
            if (isDraft(variant, activeNames)) return; // borrador: se ignora hasta que se llene

            const label = `La variante #${index + 1}`;
            const missing: string[] = [];
            const described: string[] = [];

            activeAxes.forEach((attr) => {
                const value = (variant.atributos[attr.name] ?? "").trim();
                if (!value) {
                    missing.push(attr.name);
                    return;
                }
                if (attr.values.length > 0 && !attr.values.includes(value)) {
                    newErrors.push(`${label} usa "${value}" en "${attr.name}", que no existe en la categoría.`);
                }
                described.push(`${attr.name}: ${value}`);
            });

            if (missing.length > 0) {
                newErrors.push(`${label} no tiene ${quoted(missing)}. Selecciona un valor o elimina la variante.`);
            } else {
                const key = activeAxes
                    .map((attr) => `${attr.name}=${(variant.atributos[attr.name] ?? "").trim().toLowerCase()}`)
                    .join("|");
                const first = seenCombinations.get(key);
                if (first !== undefined) {
                    newErrors.push(`${label} repite la combinación de la variante #${first + 1} (${described.join(", ")}).`);
                } else {
                    seenCombinations.set(key, index);
                }
            }

            const precio = Number(variant.precio ?? 0);
            const comparativo = Number(variant.precioComparativo ?? 0);
            if (precio < 0 || comparativo < 0) {
                newErrors.push(`${label}: los precios no pueden ser negativos.`);
            }
            if (comparativo > 0 && precio > 0 && comparativo < precio) {
                newErrors.push(
                    `${label}: el precio regular (S/ ${comparativo.toFixed(2)}) no puede ser menor que el precio de venta (S/ ${precio.toFixed(2)}).`
                );
            }

            const stock = Number(variant.stock ?? 0);
            if (!Number.isInteger(stock) || stock < 0) {
                newErrors.push(`${label}: el stock debe ser un entero mayor o igual a 0.`);
            }

            const sku = (variant.sku ?? "").trim().toUpperCase();
            if (sku) {
                const first = seenSkus.get(sku);
                if (first !== undefined) {
                    newErrors.push(`${label} repite el SKU "${sku}" de la variante #${first + 1}.`);
                } else {
                    seenSkus.set(sku, index);
                }
            }
        });

        return newErrors;
    };

    const errors = getValidationErrors(variants);
    const draftCount = variants.filter((v) => isDraft(v, activeNames)).length;

    /** Al cambiar los ejes, las filas conservan solo los atributos que siguen activos. */
    const toggleAxis = (name: string) => {
        const next = activeNames.includes(name)
            ? activeNames.filter((n) => n !== name)
            : [...activeNames, name];
        setActiveAxisNames(next);
        setVariants((prev) =>
            prev.map((v) => ({
                ...v,
                atributos: Object.fromEntries(
                    next.map((n) => [n, v.atributos[n] ?? ""])
                ),
            }))
        );
    };

    const handleSort = (method: string) => {
        setSortMethod(method);
        if (method === "default") return;

        const sorted = [...variants].sort((a, b) => {
            if (method === "incomplete") {
                const aIncomplete = activeAxes.some((attr) => !a.atributos[attr.name]);
                const bIncomplete = activeAxes.some((attr) => !b.atributos[attr.name]);
                return aIncomplete === bIncomplete ? 0 : aIncomplete ? -1 : 1;
            }
            if (method === "alphabetical") {
                const aSummary = activeAxes.map((attr) => a.atributos[attr.name] || "").join("");
                const bSummary = activeAxes.map((attr) => b.atributos[attr.name] || "").join("");
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
        activeNames.forEach((name) => (attributes[name] = ""));

        const newVariant: Draft = {
            _id: crypto.randomUUID(),
            precio: 0,
            precioComparativo: 0,
            stock: 0,
            sku: "",
            barcode: "",
            atributos: attributes,
            imagenes: [],
        };

        setVariants([...variants, newVariant]);
        setOpenItems((prev) => [...prev, newVariant._id!]);
        setSortMethod("default");
    };

    const updateVariant = <K extends keyof TApiVariant>(index: number, key: K, value: TApiVariant[K]) => {
        const next = [...variants];
        next[index] = { ...next[index], [key]: value };
        setVariants(next);
    };

    const updateAttribute = (index: number, attrName: string, value: string) => {
        const next = [...variants];
        next[index] = {
            ...next[index],
            atributos: { ...next[index].atributos, [attrName]: value },
        };
        setVariants(next);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    /** Lo que se envía: sin borradores, solo ejes activos y sin valores vacíos. */
    const variantsToSubmit = useMemo(
        () =>
            variants
                .filter((v) => !isDraft(v, activeNames))
                .map((v) => ({
                    ...v,
                    atributos: Object.fromEntries(
                        activeNames
                            .map((name) => [name, (v.atributos[name] ?? "").trim()] as const)
                            .filter(([, value]) => value !== "")
                    ),
                    imagenes: v.imagenes ?? [],
                })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [variants, activeNames.join("|")]
    );

    if (!variantAttributes?.length) {
        return (
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500 italic text-center">
                La categoría seleccionada no tiene atributos de variante. Márcalos como “de variante” en la categoría para poder usarlos.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Selección de ejes: qué varía en ESTE producto */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <p className="text-xs font-semibold text-slate-700">¿Por qué atributos varía este producto?</p>
                <div className="flex flex-wrap gap-2">
                    {variantAttributes.map((attr) => {
                        const on = activeNames.includes(attr.name);
                        return (
                            <button
                                key={attr.name}
                                type="button"
                                onClick={() => toggleAxis(attr.name)}
                                aria-pressed={on}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer ${
                                    on
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                                }`}
                            >
                                {attr.name}
                            </button>
                        );
                    })}
                </div>
                <p className="text-[11px] text-slate-500">
                    {activeNames.length === 0
                        ? "Ningún atributo seleccionado: el producto se guarda sin variantes."
                        : `Cada variante debe definir: ${activeNames.join(", ")}. Los atributos no seleccionados no se piden.`}
                </p>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <p className="text-xs text-slate-500">
                    Gestiona precios, inventario y fotos específicas por combinación.
                </p>
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

            {activeNames.length > 0 && variants.length === 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>Aún no hay variantes. Añade una por combinación de {activeNames.join(" y ")}.</span>
                </div>
            )}

            {draftCount > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                        {draftCount} variante(s) vacía(s) no se guardarán. Complétalas o elimínalas.
                    </span>
                </div>
            )}

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
                    const draft = isDraft(variant, activeNames);
                    const isIncomplete =
                        !draft && activeAxes.some((attr) => !(variant.atributos[attr.name] ?? "").trim());
                    const summary = activeAxes
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
                                    : draft
                                        ? "bg-amber-50/40 border-amber-200 border-dashed"
                                        : "bg-white border-slate-200"
                            }`}
                        >
                            <AccordionTrigger className="hover:no-underline py-3 cursor-pointer">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative shrink-0">
                                            {variant.imagenes?.[0] ? (
                                                <Image src={variant.imagenes[0]} alt="" fill className="object-contain" unoptimized />
                                            ) : (
                                                <span className="text-[10px] font-semibold text-slate-400">#{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="text-left space-y-0.5">
                                            <p className={`text-xs font-semibold ${!summary ? "text-slate-400 italic" : "text-slate-900"}`}>
                                                {summary || (draft ? "Variante vacía (borrador)" : "Variante sin configurar")}
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-mono">SKU: {variant.sku || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs pr-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-semibold text-slate-400">Precio</span>
                                            <span className="font-semibold text-slate-900">S/ {variant.precio?.toFixed(2) || "0.00"}</span>
                                        </div>
                                        <div className="flex flex-col items-end border-l border-slate-200 pl-4">
                                            <span className="text-[10px] uppercase font-semibold text-slate-400">Stock</span>
                                            <span className={`font-semibold ${variant.stock === 0 ? "text-rose-600" : "text-slate-900"}`}>
                                                {variant.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="pt-2 pb-4 space-y-4">
                                {/* Fotos de la variante (biblioteca de medios) */}
                                <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                            Fotos de esta variante
                                        </span>
                                        <MediaPicker
                                            kind="image"
                                            folder="products"
                                            max={5}
                                            value={variant.imagenes || []}
                                            onChange={(imgs) => updateVariant(index, "imagenes", imgs)}
                                            title="Fotos de la variante"
                                            trigger={<Button type="button" variant="outline" size="sm">Asignar fotos</Button>}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
                                        {variant.imagenes && variant.imagenes.length > 0 ? (
                                            variant.imagenes.map((url, i) => (
                                                <div key={i} className="relative w-11 h-11 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
                                                    <Image src={url} alt="" fill className="object-contain" unoptimized />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-slate-400 italic pl-1">
                                                Sin fotos propias: se usará la galería principal del producto.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Atributos: solo los ejes activos */}
                                {activeAxes.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {activeAxes.map((attr) => (
                                            <div key={attr.name} className="space-y-1">
                                                <Label
                                                    htmlFor={`var-${index}-${attr.name}`}
                                                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                                                        !(variant.atributos[attr.name] ?? "").trim() && !draft
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
                                                        <option key={val} value={val}>{val}</option>
                                                    ))}
                                                </NativeSelect>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Datos comerciales */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-precio-${index}`} className="text-[11px] font-semibold text-slate-600">Precio Venta</Label>
                                        <Input
                                            id={`var-precio-${index}`}
                                            type="number"
                                            value={variant.precio ?? ""}
                                            onChange={(e) => updateVariant(index, "precio", parseFloat(e.target.value) || 0)}
                                            min={0}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-comparativo-${index}`} className="text-[11px] font-semibold text-slate-600">Precio Regular</Label>
                                        <Input
                                            id={`var-comparativo-${index}`}
                                            type="number"
                                            value={variant.precioComparativo ?? ""}
                                            onChange={(e) => updateVariant(index, "precioComparativo", parseFloat(e.target.value) || 0)}
                                            min={0}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-stock-${index}`} className="text-[11px] font-semibold text-slate-600">Stock</Label>
                                        <Input
                                            id={`var-stock-${index}`}
                                            type="number"
                                            value={variant.stock ?? ""}
                                            onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`var-sku-${index}`} className="text-[11px] font-semibold text-slate-600">SKU</Label>
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
                    disabled={activeNames.length === 0}
                    className="w-full h-10 gap-2 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer shadow-xs"
                >
                    <Plus className="w-4 h-4 text-slate-500" />
                    <span>Añadir nueva variante</span>
                </Button>
            </div>

            {/* Datos para el envío del formulario */}
            {activeNames.map((name) => (
                <input key={name} type="hidden" name="variantAxes[]" value={name} />
            ))}
            <input
                type="hidden"
                name="variants"
                value={errors.length === 0 ? JSON.stringify(variantsToSubmit) : "[]"}
            />
            <input type="hidden" name="variants_error" value={errors.length > 0 ? "true" : "false"} />
        </div>
    );
}
