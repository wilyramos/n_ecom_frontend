"use client";

import { useState } from 'react';
import { Product, ProductVariant } from "@/src/schemas/product.schema";
import { usePosStore } from '@/src/store/usePosStore';
import { Smartphone, Layers, X } from "lucide-react";
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const ProductCard = ({ product }: { product: Product }) => {
    const addToCart = usePosStore((state) => state.addToCart);
    const [showVariants, setShowVariants] = useState(false);

    const hasVariants = product.variants && product.variants.length > 0;
    const stock = product.stock ?? 0;
    const hasStock = stock > 0 || (hasVariants && product.variants!.some(v => v.stock > 0));

    const handleMainClick = () => {
        if (!hasStock) return;
        if (hasVariants) {
            setShowVariants(true);
        } else {
            addToCart(product);
        }
    };

    const selectVariant = (v: ProductVariant) => {
        if (v.stock <= 0) return;
        addToCart(product, v);
        setShowVariants(false);
    };

    return (
        <div className="relative h-full">
            <div
                onClick={handleMainClick}
                className={cn(
                    "group bg-card border border-border p-3 rounded-sm transition-all duration-200 flex flex-col h-full select-none",
                    hasStock
                        ? "hover:border-foreground cursor-pointer active:scale-[0.98]"
                        : "opacity-50 grayscale cursor-not-allowed"
                )}
            >
                {/* Contenedor Imagen y Tags */}
                <div className="relative aspect-square flex items-center justify-center mb-3 bg-muted/40 border border-border rounded-sm overflow-hidden">
                    {product.imagenes?.[0] ? (
                        <Image
                            src={product.imagenes[0]}
                            alt={product.nombre}
                            width={200}
                            height={200}
                            unoptimized
                            className="object-contain w-full h-full p-2"
                        />
                    ) : (
                        <Smartphone size={32} className="text-muted-foreground/40" />
                    )}

                    {hasVariants && (
                        <div className="absolute bottom-1.5 left-1.5 bg-brand-charcoal text-brand-silver px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                            <Layers size={10} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">
                                {product.variants?.length} Var
                            </span>
                        </div>
                    )}
                </div>

                {/* Datos del Producto */}
                <div className="flex-1">
                    <h3 className="text-xs font-bold uppercase text-foreground leading-snug line-clamp-2">
                        {product.nombre}
                    </h3>
                    <p className="text-[9px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wide">
                        {typeof product.categoria === 'object' ? product.categoria.nombre : 'General'}
                    </p>
                </div>

                {/* Footer Tarjeta: Precio y Estado */}
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                    <span className="text-sm font-black text-foreground font-mono">
                        S/ {product.precio?.toFixed(2)}
                    </span>
                    <span className={cn(
                        "text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider border",
                        hasStock
                            ? "bg-brand-action/15 text-foreground border-brand-action/40"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                        {hasStock ? 'En Stock' : 'Sin Stock'}
                    </span>
                </div>
            </div>

            {/* Selector de Variantes (Overlay Plano) */}
            {showVariants && (
                <div className="absolute inset-0 z-10 bg-card/95 backdrop-blur-xs p-3 flex flex-col animate-in fade-in duration-150 border-2 border-foreground rounded-sm">
                    <div className="flex items-center justify-between mb-2 border-b border-border pb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Variantes</span>
                        <button
                            onClick={() => setShowVariants(false)}
                            className="p-1 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                        {product.variants?.map((v) => (
                            <button
                                key={v._id?.toString()}
                                disabled={v.stock <= 0}
                                onClick={() => selectVariant(v)}
                                className={cn(
                                    "w-full p-2 border rounded-sm flex items-center justify-between transition-colors text-left",
                                    v.stock > 0
                                        ? "border-border hover:border-foreground bg-card text-foreground cursor-pointer"
                                        : "opacity-40 border-border bg-muted cursor-not-allowed"
                                )}
                            >
                                <div>
                                    <p className="text-[9px] font-bold uppercase leading-none">{v.nombre || 'Variante'}</p>
                                    <p className="text-[8px] text-muted-foreground mt-0.5 font-mono">Stock: {v.stock}</p>
                                </div>
                                <span className="text-[10px] font-black font-mono">S/ {v.precio?.toFixed(2)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};