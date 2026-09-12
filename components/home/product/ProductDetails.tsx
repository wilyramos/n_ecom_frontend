// File: frontend/components/home/product/ProductDetails.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductWithCategoryResponse, TApiVariant } from "@/src/schemas";

import AddProductToCart from "./AddProductToCart";
import ShopNowButton from "./ShopNowButton";
import ImagenesProductoCarousel from "./ImagenesProductoCarousel";
import ProductExpandableSections from "./ProductExpandableSections";
import ColorCircle from "@/components/ui/ColorCircle";
import PowerpayPdp from "@/src/components/powerpay/PowerpayPdp";
import PaymentMethods from "../PaymentMethods";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  producto: ProductWithCategoryResponse;
};

const MAX_VISIBLE_OPTIONS = 10;

export default function ProductDetails({ producto }: Props) {
  const searchParams = useSearchParams();
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<TApiVariant | null>(null);

  const allAttributes = useMemo(() => {
    const attrs: Record<string, string[]> = {};
    producto.variants?.forEach((v) => {
      Object.entries(v.atributos).forEach(([key, value]) => {
        if (!attrs[key]) attrs[key] = [];
        if (!attrs[key].includes(value)) attrs[key].push(value);
      });
    });
    return attrs;
  }, [producto.variants]);

  useEffect(() => {
    const initialAttrs: Record<string, string> = {};
    Object.keys(allAttributes).forEach((attr) => {
      const val = searchParams.get(attr);
      if (val) initialAttrs[attr] = val;
    });

    setSelectedAttributes(initialAttrs);

    const matched = Object.keys(initialAttrs).length > 0
      ? producto.variants?.find((v) =>
          Object.keys(initialAttrs).every((k) => initialAttrs[k] === v.atributos[k])
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

    const matchedVariant = producto.variants?.find((v) =>
      Object.keys(v.atributos).every((k) => newAttributes[k] === v.atributos[k])
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
    producto.variants?.forEach((variant) => {
      const matchesOtherAttrs = Object.entries(selectedAttributes).every(
        ([key, value]) => key === attrKey || variant.atributos[key] === value
      );
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
      const allVariantsImages = producto.variants?.flatMap((v) => v.imagenes ?? []) ?? [];
      images = [...generalImages, ...allVariantsImages];
    }

    const cleaned = Array.from(new Set(images.filter((img) => img && img.trim() !== "")));
    return cleaned.length > 0 ? cleaned : ["/logoapp.png"];
  }, [selectedVariant, producto.imagenes, producto.variants]);

  const precio = selectedVariant?.precio ?? producto.precio ?? 0;
  const precioComparativo = selectedVariant?.precioComparativo ?? producto.precioComparativo ?? null;
  const stock = !selectedVariant ? producto.stock ?? 0 : selectedVariant.stock ?? 0;
  const hasDiscount = precioComparativo !== null && precioComparativo > precio;
  const allAttributesSelected = Object.keys(allAttributes).every((key) => selectedAttributes[key]);

  const isOptionOutOfStock = (attrKey: string, attrValue: string) => {
    const variant = producto.variants?.find(
      (v) =>
        v.atributos[attrKey] === attrValue &&
        Object.entries(selectedAttributes).every(
          ([key, value]) => key === attrKey || v.atributos[key] === value
        )
    );
    return variant?.stock === 0;
  };

  const colorAtributo = !producto.variants?.length && (producto.atributos?.color || producto.atributos?.Color || producto.atributos?.COLOR || null);

  const tieneComplementarios =
    producto.complementarios &&
    producto.complementarios.length > 0 &&
    producto.complementarios.some((comp) => typeof comp !== "string");

  return (
    <>
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto bg-background px-4 py-4 rounded-lg">
        {/* Imagen y Carrusel */}
        <div className="lg:col-span-7 w-full">
          <ImagenesProductoCarousel images={variantImages} />
        </div>

        {/* Detalles del Producto */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          <header className="space-y-1.5 pb-2">
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs tracking-wide uppercase font-medium">
              <div className="flex items-center gap-1 text-brand-gris">
                {producto.brand && (
                  <Link href={`/catalogo/${producto.brand.slug}`} className="hover:text-brand-charcoal transition-colors">
                    {producto.brand.nombre}
                  </Link>
                )}
                {producto.brand && producto.line && <span>/</span>}
                {producto.line && typeof producto.line === "object" && (
                  <Link href={`/catalogo/${producto.line.slug}`} className="hover:text-brand-charcoal transition-colors">
                    {producto.line.nombre}
                  </Link>
                )}
              </div>

              {(selectedVariant?.sku || producto.sku) && (
                <span className="text-brand-gris font-normal normal-case">
                  SKU: {selectedVariant?.sku || producto.sku}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-medium text-brand-charcoal tracking-tight leading-tight">
              {producto.nombre}
            </h1>

            {!producto.variants?.length && colorAtributo && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-brand-gris">Color:</span>
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
                  <span className="text-xl md:text-2xl text-brand-gris line-through">
                    S/ {precioComparativo!.toFixed(2)}
                  </span>
                  <span className="text-xl md:text-2xl px-2 bg-destructive text-destructive-foreground font-normal text-brand-silver-border">
                    −{Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)}%
                  </span>
                </div>
              )}

              <div className="flex items-baseline text-brand-charcoal">
                <span className="text-base font-medium mr-0.5">S/</span>
                <span className="text-xl md:text-2xl font-semibold tracking-tight">
                  {precio.toFixed(2)}
                </span>
              </div>

              {stock === 0 && (
                <span className="text-xs font-medium text-brand-charcoal bg-brand-silver-border px-2.5 py-1 rounded-sm">
                  Sin stock
                </span>
              )}
            </div>
          </header>

          {/* Widget Oficial Powerpay PDP */}
          <div>
            <PowerpayPdp price={precio} />
          </div>

          {/* Variantes y Atributos */}
          <div className="space-y-4">
            {Object.entries(allAttributes).map(([key]) => {
              const availableValues = getAvailableValues(key);
              const isColor = key.toLowerCase() === "color";
              const useDropdown = !isColor && availableValues.length > MAX_VISIBLE_OPTIONS;

              return (
                <fieldset key={key} className="space-y-2">
                  <legend className="text-xs font-semibold tracking-wide uppercase text-brand-gris">
                    {key}:{" "}
                    {selectedAttributes[key] && (
                      <span className="text-brand-charcoal capitalize font-semibold ml-1">
                        {selectedAttributes[key]}
                      </span>
                    )}
                  </legend>

                  {isColor ? (
                    <div className="flex flex-wrap gap-3">
                      {availableValues.map((val) => {
                        const outOfStock = isOptionOutOfStock(key, val);
                        const selected = selectedAttributes[key] === val;
                        const variantForValue = producto.variants?.find((v) => v.atributos[key] === val);

                        return (
                          <button
                            type="button"
                            key={val}
                            onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                            disabled={outOfStock}
                            title={val}
                            className={cn(
                              "relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-150 bg-background cursor-pointer",
                              selected ? "border-brand-charcoal ring-1 ring-brand-charcoal" : "border-brand-silver-border hover:border-brand-charcoal",
                              outOfStock && "opacity-55 cursor-not-allowed"
                            )}
                          >
                            <div className={cn("relative w-7 h-7 rounded-full border border-brand-silver-border overflow-hidden shrink-0", outOfStock && "grayscale brightness-90")}>
                              <ColorCircle color={variantForValue?.atributos[key] || val} size={28} />
                              {outOfStock && (
                                <span className="absolute inset-0 flex items-center justify-center z-10">
                                  <div className="w-[120%] border-t border-brand-gris -rotate-45" />
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
                      <SelectTrigger className="w-full max-w-xs border-brand-silver-border bg-background text-brand-charcoal text-sm h-10 rounded-md">
                        <SelectValue placeholder="Seleccionar opción" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-brand-silver-border text-brand-charcoal">
                        {availableValues.map((val) => {
                          const outOfStock = isOptionOutOfStock(key, val);
                          return (
                            <SelectItem
                              key={val}
                              value={val}
                              disabled={outOfStock}
                              className={cn(
                                "cursor-pointer text-sm",
                                outOfStock && "opacity-40 line-through text-brand-gris"
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
                              "h-9 px-4 text-xs font-medium border rounded-md transition-all relative overflow-hidden cursor-pointer",
                              selected
                                ? "border-brand-charcoal ring-1 ring-brand-charcoal bg-background text-brand-charcoal font-semibold"
                                : outOfStock
                                ? "border-brand-silver-border bg-brand-silver-border/30 text-brand-gris cursor-not-allowed line-through"
                                : "border-brand-silver-border bg-background text-brand-charcoal hover:border-brand-charcoal"
                            )}
                          >
                            <span className={cn("block", outOfStock && "line-through decoration-brand-gris")}>
                              {val}
                            </span>
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

          {/* Acciones de Compra */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
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

          {/* Métodos de Pago */}
          <div className="pt-2 flex flex-col gap-2">
            <span className="text-xs text-brand-gris font-medium uppercase tracking-wider">
              Medios de pago aceptados
            </span>
            <PaymentMethods />
          </div>

          {/* Información y Confianza */}
          <div className="pt-1 flex flex-col gap-3">
            {/* Tarjeta de Garantía */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-brand-silver-border bg-background">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-brand-charcoal">
                <ShieldCheck className="w-5 h-5 text-brand-action shrink-0" />
                <span>1 año de garantía</span>
              </div>
              <Link
                href="/cambios-devoluciones"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-gris hover:text-brand-charcoal transition-colors underline-offset-2 hover:underline whitespace-nowrap"
              >
                Ver más detalles
              </Link>
            </div>

            {/* Enlace de Consulta */}
            <a
              href={`https://wa.me/51902900653?text=Consulta%20${encodeURIComponent(producto.nombre)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center text-xs font-medium text-brand-gris hover:text-brand-charcoal transition-colors py-1"
            >
              ¿Tienes dudas? Consultar por WhatsApp
            </a>

            {/* Fichas Plegables */}
            <ProductExpandableSections producto={producto} />
          </div>

          {/* Productos Complementarios */}
          {tieneComplementarios && (
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm md:text-base font-semibold text-brand-charcoal">
                  Complementa tu compra
                </h2>
                <span className="text-[10px] font-bold uppercase bg-destructive text-destructive-foreground px-2 py-0.5 rounded-sm">
                  Hasta 20% Dcto
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {producto.complementarios.map((comp) => {
                  const isPopulated = typeof comp !== "string";
                  if (!isPopulated) return null;

                  return (
                    <Link
                      key={comp._id}
                      href={`/productos/${comp.slug}`}
                      className="group flex flex-col justify-between p-3 rounded-xl transition-all hover:border-brand-charcoal bg-background border border-brand-silver-border"
                    >
                      <div className="space-y-2.5">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-background w-full">
                          <Image
                            src={comp.imagenes?.[0] || "/logo.png"}
                            alt={comp.nombre}
                            fill
                            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                        <h4 className="text-xs font-medium text-brand-charcoal leading-snug line-clamp-2 uppercase tracking-tight">
                          {comp.nombre}
                        </h4>
                      </div>
                      <p className="text-sm font-bold text-brand-charcoal pt-2">
                        S/ {comp.precio.toFixed(2)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </article>

      {/* Floating Action Bar para Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-brand-silver-border p-4 shadow-lg z-50">
        <AddProductToCart
          product={producto}
          variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
        />
      </div>
    </>
  );
}