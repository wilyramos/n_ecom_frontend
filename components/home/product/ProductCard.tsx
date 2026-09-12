//File: frontend/components/home/product/ProductCard.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TApiProduct } from "@/src/schemas";
import { MdOutlineImageNotSupported } from "react-icons/md";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: TApiProduct }) {
    const searchParams = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImages, setPreviewImages] = useState<string[]>(product.imagenes ?? []);
    const [startX, setStartX] = useState<number | null>(null);

    const precio = product.precio ?? 0;

    // --- LÓGICA DE COLORES ---
    const uniqueColors = useMemo(() => {
        const colors = new Set<string>();
        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor) colors.add(mainColor);

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach((v) => {
                const vAttrs = v.atributos as Record<string, string> | undefined;
                const vColor = vAttrs?.Color || vAttrs?.color;
                if (vColor) colors.add(vColor);
            });
        }
        return Array.from(colors);
    }, [product]);

    useEffect(() => {
        const filterColor = searchParams.get("Color") || searchParams.get("color");
        const mainColor = product.atributos?.Color || product.atributos?.color;
        let targetColor = mainColor;

        if (filterColor && uniqueColors.includes(filterColor)) {
            targetColor = filterColor;
        }

        if (!targetColor) return;

        setCurrentIndex(0);

        if (targetColor === mainColor && product.imagenes && product.imagenes.length > 0) {
            setPreviewImages(product.imagenes);
        } else {
            const foundVariant = product.variants?.find(v => {
                const vAttrs = v.atributos as Record<string, string>;
                return (vAttrs?.Color === targetColor || vAttrs?.color === targetColor);
            });

            if (foundVariant && foundVariant.imagenes && foundVariant.imagenes.length > 0) {
                setPreviewImages(foundVariant.imagenes);
            } else {
                setPreviewImages(product.imagenes ?? []);
            }
        }
    }, [searchParams, product, uniqueColors]);

    // --- EVENTOS IMAGEN ---
    const handleMouseEnter = () => { if (previewImages.length > 1) setCurrentIndex(1); };
    const handleMouseLeave = () => setCurrentIndex(0);
    const nextImage = () => setCurrentIndex((prev) => prev === previewImages.length - 1 ? 0 : prev + 1);
    const prevImage = () => setCurrentIndex((prev) => prev === 0 ? previewImages.length - 1 : prev - 1);

    const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50) nextImage();
        else if (diff < -50) prevImage();
        setStartX(null);
    };
    const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);
    const handleMouseUp = (e: React.MouseEvent) => {
        if (startX === null) return;
        const diff = startX - e.clientX;
        if (diff > 50) nextImage();
        else if (diff < -50) prevImage();
        setStartX(null);
    };

    const discountedPrice = product.precioComparativo
        ? ((product.precioComparativo - precio) / product.precioComparativo) * 100
        : 0;

    return (
        <div
            className="group relative flex flex-col h-full bg-background overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">

                {/* --- IMAGEN --- */}
                <div className="relative w-full aspect-square bg-background overflow-hidden shrink-0">
                    {previewImages.length > 0 ? (
                        <div className="relative w-full h-full overflow-hidden">
                            <div className="relative w-full h-full">
                                {previewImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 ${idx === currentIndex ? "block" : "hidden"}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.nombre} - vista ${idx + 1}`}
                                            fill
                                            sizes="(max-width: 900px) 80vw, 50vw"
                                            className="object-contain mix-blend-multiply p-4"
                                            quality={80}
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Controles Desktop */}
                            {previewImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-xs text-brand-charcoal p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-xs hover:scale-110 z-10"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-xs text-brand-charcoal p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-xs hover:scale-110 z-10"
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                    {previewImages.length > 1 && previewImages.length <= 5 && (
                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                                            {previewImages.map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`h-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition-all ${
                                                        idx === currentIndex ? "w-4 bg-brand-charcoal" : "w-1.5 bg-brand-charcoal/30"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-brand-gris opacity-50">
                            <MdOutlineImageNotSupported size={20} />
                        </div>
                    )}

                    {/* Badge Entrega Inmediata */}
                    <div className="absolute bottom-1 left-1 z-10 px-3">
                        <span className="px-1.5 py-0.5 bg-brand-charcoal text-white text-[8px] md:text-[9px] font-bold uppercase tracking-wider rounded-xs">
                            Entrega inmediata
                        </span>
                    </div>

                    {/* Badges: Descuento */}
                    <div className="absolute top-2 right-2 pointer-events-none flex flex-col gap-1">
                        {(product.precioComparativo ?? 0) > 0 && (
                            <span className="px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider rounded-xs text-brand-silver-border">
                                -{Math.round(discountedPrice)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* --- INFO --- */}
                <div className="flex flex-col flex-1 p-3 md:p-4 bg-background">
                    <div className="flex flex-col min-h-[2.6rem] md:min-h-[2.8rem]">
                        <h3 className="text-xs text-brand-charcoal leading-[1.3] line-clamp-2 md:text-[15px] md:leading-[1.4] font-medium">
                            {product.nombre}
                        </h3>
                    </div>

                    <div className="flex items-end justify-between mt-auto pt-2 transition-colors">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row items-baseline gap-2">
                                {/* Precio anterior (tachado) */}
                                {(product.precioComparativo ?? 0) > 0 && (
                                    <span className="text-[10px] md:text-[15px] text-brand-gris line-through">
                                        S/ {product.precioComparativo!.toFixed(2)}
                                    </span>
                                )}

                                {/* Precio Actual */}
                                <span className="text-sm md:text-[16px] font-bold text-brand-charcoal">
                                    S/ {precio.toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-3">
                                <AddToCartButton product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}