"use client";

import { useState, useEffect, useMemo } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import ColorCircle from '@/components/ui/ColorCircle';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import ProductExpandableSections from './ProductExpandableSections ';
import InstallmentInfo from './InstallmentInfo';

type Props = {
    producto: ProductWithCategoryResponse;
};

const MAX_VISIBLE_OPTIONS = 10;

export default function ProductDetails({ producto }: Props) {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<TApiVariant | null>(null);
    const searchParams = useSearchParams();

    const allAttributes = useMemo(() => {
        const attrs: Record<string, string[]> = {};
        producto.variants?.forEach(v => {
            Object.entries(v.atributos).forEach(([key, value]) => {
                if (!attrs[key]) attrs[key] = [];
                if (!attrs[key].includes(value)) attrs[key].push(value);
            });
        });
        return attrs;
    }, [producto.variants]);

    useEffect(() => {
        const initialAttrs: Record<string, string> = {};
        Object.keys(allAttributes).forEach(attr => {
            const val = searchParams.get(attr);
            if (val) initialAttrs[attr] = val;
        });

        setSelectedAttributes(initialAttrs);

        const matched = Object.keys(initialAttrs).length > 0
            ? producto.variants?.find(v =>
                Object.keys(initialAttrs).every(k => initialAttrs[k] === v.atributos[k])
            ) ?? null
            : null;

        setSelectedVariant(matched);
    }, [allAttributes, searchParams, producto.variants]);

    const updateSelectedVariant = (attrKey: string, attrValue: string | null) => {
        const newAttributes = { ...selectedAttributes };
        if (attrValue === null || newAttributes[attrKey] === attrValue) {
            delete newAttributes[attrKey];
        } else {
            newAttributes[attrKey] = attrValue;
        }
        setSelectedAttributes(newAttributes);

        const matchedVariant = producto.variants?.find(v =>
            Object.keys(v.atributos).every(k => newAttributes[k] === v.atributos[k])
        ) ?? null;

        setSelectedVariant(matchedVariant);

        const params = new URLSearchParams();
        Object.entries(newAttributes).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    };

    const hasVariants = (producto.variants?.length ?? 0) > 0;
    const isSelectionIncomplete = hasVariants && !selectedVariant;

    const getAvailableValues = (attrKey: string): string[] => {
        const values = new Set<string>();
        producto.variants?.forEach(variant => {
            const matchesOtherAttrs = Object.entries(selectedAttributes)
                .every(([key, value]) => key === attrKey || variant.atributos[key] === value);
            if (matchesOtherAttrs) values.add(variant.atributos[attrKey]);
        });
        return Array.from(values).sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
        );
    };

    const variantImages = useMemo(() => {
        let images: string[] = [];

        if (selectedVariant?.imagenes && selectedVariant.imagenes.length > 0) {
            images = selectedVariant.imagenes;
        } else {
            const generalImages = producto.imagenes ?? [];
            const allVariantsImages = producto.variants?.flatMap(v => v.imagenes ?? []) ?? [];
            images = [...generalImages, ...allVariantsImages];
        }

        const cleaned = Array.from(new Set(images.filter(img => img && img.trim() !== "")));

        return cleaned.length > 0 ? cleaned : ["/logoapp.png"];
    }, [selectedVariant, producto.imagenes, producto.variants]);

    const precio = selectedVariant?.precio ?? producto.precio ?? 0;
    const precioComparativo = selectedVariant?.precioComparativo ?? producto.precioComparativo ?? null;
    const stock = !selectedVariant ? (producto.stock ?? 0) : (selectedVariant.stock ?? 0);
    const hasDiscount = precioComparativo !== null && precioComparativo > precio;
    const allAttributesSelected = Object.keys(allAttributes).every(key => selectedAttributes[key]);

    const isOptionOutOfStock = (attrKey: string, attrValue: string) => {
        const variant = producto.variants?.find(v =>
            v.atributos[attrKey] === attrValue &&
            Object.entries(selectedAttributes).every(([key, value]) => key === attrKey || v.atributos[key] === value)
        );
        return variant?.stock === 0;
    };

    const colorAtributo = !producto.variants?.length && (producto.atributos?.color || producto.atributos?.Color || producto.atributos?.COLOR || null);

    return (
        <>
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto bg-surface-primary px-4 py-4 rounded-lg">
                <div className="lg:col-span-6 w-full">
                    <ImagenesProductoCarousel images={variantImages} />
                </div>

                <section className="lg:col-span-6 flex flex-col  space-y-1">
                    <div className="space-y-1">
                        <header className="space-y-1 pb-2 ">
                            <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] tracking-wide uppercase font-medium">
                                <div className="flex items-center gap-1 text-fg-secondary">
                                    {producto.brand && (
                                        <Link href={`/catalogo/${producto.brand.slug}`} className="hover:text-fg-primary transition-colors">
                                            {producto.brand.nombre}
                                        </Link>
                                    )}
                                    {producto.brand && producto.line && <span>/</span>}
                                    {producto.line && typeof producto.line === 'object' && (
                                        <Link href={`/catalogo/${producto.line.slug}`} className="hover:text-fg-primary transition-colors">
                                            {producto.line.nombre}
                                        </Link>
                                    )}
                                </div>

                                {(selectedVariant?.sku || producto.sku) && (
                                    <span className="text-fg-secondary font-normal normal-case">
                                        SKU: {selectedVariant?.sku || producto.sku}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-xl md:text-2xl font-normal text-fg-primary tracking-tight leading-tight">
                                {producto.nombre}
                            </h1>

                            {!producto.variants?.length && colorAtributo && (
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-xs text-fg-secondary">Color:</span>
                                    <div className="flex items-center gap-1.5">
                                        {(Array.isArray(colorAtributo) ? colorAtributo : [colorAtributo]).map((c) => (
                                            <ColorCircle key={c} color={c} size={16} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2 flex-wrap">

                                {hasDiscount && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl text-fg-muted line-through">
                                            S/ {precioComparativo!.toFixed(2)}

                                        </span>
                                        <span className=" font-semibold px-2 py-0.5 bg-surface-inverse text-fg-inverse rounded-sm">
                                            −{Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)}%
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-baseline text-fg-primary">
                                    <span className="text-base font-medium mr-0.5">S/</span>
                                    <span className="text-2xl md:text-3xl font-semibold tracking-tight">
                                        {precio.toFixed(2)}
                                    </span>
                                </div>





                                {stock === 0 && (
                                    <span className="text-xs font-medium text-fg-primary bg-surface-secondary px-2.5 py-1 rounded-sm">
                                        Sin stock
                                    </span>
                                )}
                            </div>
                        </header>

                        <div className="py-4">
                            <InstallmentInfo price={precio} installments={6} />
                        </div>
                        <div className="space-y-5">
                            {Object.entries(allAttributes).map(([key]) => {
                                const availableValues = getAvailableValues(key);
                                const isColor = key.toLowerCase() === "color";
                                const useDropdown = !isColor && availableValues.length > MAX_VISIBLE_OPTIONS;

                                return (
                                    <fieldset key={key} className="space-y-2">
                                        <legend className="text-md tracking-wide text-fg-muted font-bold capitalize">
                                            {key}: {selectedAttributes[key] && <span className="text-fg-muted capitalize font-semibold  ml-1">{selectedAttributes[key]}</span>}
                                        </legend>

                                        {isColor ? (
                                            <div className="flex flex-wrap gap-3">
                                                {availableValues.map((val) => {
                                                    const outOfStock = isOptionOutOfStock(key, val);
                                                    const selected = selectedAttributes[key] === val;
                                                    const variantForValue = producto.variants?.find(v => v.atributos[key] === val);

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={val}
                                                            onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                            disabled={outOfStock}
                                                            title={val}
                                                            className={cn(
                                                                "relative flex  items-center justify-center w-9 h-9 rounded-full border transition-all duration-150 bg-surface-primary cursor-pointer",
                                                                selected
                                                                    ? "border-fg-primary ring-1 ring-fg-primary"
                                                                    : "border-border-default hover:border-fg-primary",
                                                                outOfStock && "opacity-40 cursor-not-allowed"
                                                            )}
                                                        >
                                                            <div className={cn("relative w-7 h-7 rounded-full border border-border-default overflow-hidden shrink-0", outOfStock && "grayscale")}>
                                                                <ColorCircle color={variantForValue?.atributos[key] || val} size={28} />
                                                                {outOfStock && (
                                                                    <span className="absolute inset-0 flex items-center justify-center z-10">
                                                                        <div className="w-[120%] border-t border-fg-secondary -rotate-45" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : useDropdown ? (
                                            <Select
                                                value={selectedAttributes[key] || ""}
                                                onValueChange={(val) => updateSelectedVariant(key, val)}
                                            >
                                                <SelectTrigger className="w-full max-w-xs border-border-default bg-surface-primary text-fg-primary text-sm h-10 rounded-md">
                                                    <SelectValue placeholder="Seleccionar opción" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-surface-primary border-border-default text-fg-primary rounded-2xl">
                                                    {availableValues.map((val) => {
                                                        const outOfStock = isOptionOutOfStock(key, val);
                                                        return (
                                                            <SelectItem
                                                                key={val}
                                                                value={val}
                                                                disabled={outOfStock}
                                                                className={cn(
                                                                    "cursor-pointer text-sm",
                                                                    outOfStock && "opacity-40 line-through text-fg-secondary"
                                                                )}
                                                            >
                                                                {val}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {availableValues.map((val) => {
                                                    const outOfStock = isOptionOutOfStock(key, val);
                                                    const selected = selectedAttributes[key] === val;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={val}
                                                            onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                            disabled={outOfStock}
                                                            className={cn(
                                                                "h-9 px-4 text-xs font-medium border rounded-2xl transition-all relative overflow-hidden bg-surface-primary text-fg-primary cursor-pointer",
                                                                selected
                                                                    ? "border-fg-primary ring-1 ring-fg-primary"
                                                                    : "border-border-default hover:border-fg-primary",
                                                                outOfStock && "opacity-40 text-fg-secondary bg-surface-secondary cursor-not-allowed"
                                                            )}
                                                        >
                                                            <span className={cn(outOfStock && "line-through")}>{val}</span>
                                                            {outOfStock && (
                                                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                    <div className="w-[110%] -rotate-[15deg]" />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </fieldset>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <div className="hidden md:block flex-1 w-full">
                                <AddProductToCart
                                    product={producto}
                                    variant={selectedVariant ?? undefined}

                                />
                            </div>
                            <div className="flex-1 w-full">
                                <ShopNowButton
                                    disabled={stock <= 0}
                                    product={producto}
                                    variant={selectedVariant ?? undefined}
                                    isSelectionIncomplete={isSelectionIncomplete}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 ">

                        {/* consulta por politicas de cambios y devoluciones */}
                        <div className="flex items-center  bg-surface-primary gap-4">
                            <span className="text-sm font-medium text-fg-muted">
                                {/* Consulta por Políticas de Cambios y Devoluciones */}
                            </span>
                            <Link
                                href="/cambios-devoluciones"
                                className="text-sm font-semibold text-fg-primary inline-flex items-center gap-1 hover:underline w-fit group"
                            >
                                Ver Políticas de Cambios y Devoluciones
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        {/* Consulta por terminos y condiciones */}

                        <div className="flex items-center  bg-surface-primary gap-4">
                            <span className="text-sm font-medium text-fg-muted">
                                {/* Consulta por Términos y Condiciones */}
                            </span>
                            <Link
                                href="/terminos-y-condiciones"
                                className="text-sm font-semibold text-fg-primary inline-flex items-center gap-1 hover:underline w-fit group"
                            >
                                Ver Términos y Condiciones
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                            </Link>
                        </div>


                        {/* Consulta por WhatsApp */}
                        <div className="flex items-center  bg-surface-primary gap-4">
                            <span className="text-sm font-medium text-fg-muted">
                                {/* Comprar por WhatsApp */}
                            </span>

                            <a
                                href={`https://wa.me/51902900653?text=Consulta%20${encodeURIComponent(producto.nombre)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-semibold text-fg-primary inline-flex items-center gap-1 hover:underline w-fit group"
                            >
                                Consultar por WhatsApp
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                            </a>
                        </div>

                        <div>
                            <ProductExpandableSections producto={producto} />

                        </div>
                    </div>
                </section>
            </article>

            <div className="mt-8">
            </div>



            <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface-primary p-4  shadow-lg z-50">
                <AddProductToCart
                    product={producto}
                    variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
                />
            </div>
        </>
    );
}