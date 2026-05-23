"use client"

import Image from "next/image"
import Link from "next/link"
import type { ProductResponse } from "@/src/schemas"
import { MdOutlineImageNotSupported } from "react-icons/md"
import AddToCartButton from "./AddToCartButton"

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const img1 = product.imagenes?.[0]
    const img2 = product.imagenes?.[1] || img1

    const price = Number(product.precio) || 0
    const compare = Number(product.precioComparativo) || 0
    const discount = compare > price

    return (
        <div className="group p-2 md:p-4 bg-surface-primary text-fg-primary transition-all rounded-2xl relative flex flex-col h-full">
            <Link href={`/productos/${product.slug}`} className="flex flex-col flex-grow">
                {/* Imagen */}
                <div className="relative aspect-square overflow-hidden">
                    {img1 ? (
                        <>
                            <Image
                                src={img1}
                                alt={product.nombre || "Producto"}
                                fill
                                className={`object-contain transition ${img2 !== img1 ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
                            />
                            {img2 !== img1 && (
                                <Image
                                    src={img2 || img1}
                                    alt=""
                                    fill
                                    className="absolute inset-0 object-contain p-4 opacity-0 group-hover:opacity-100 transition"
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center text-fg-secondary">
                            <MdOutlineImageNotSupported size={40} />
                        </div>
                    )}

                    {/* Badge Entrega Inmediata */}
                    <div className="absolute bottom-1 left-1 z-10">
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-wider rounded">
                            Entrega inmediata
                        </span>
                    </div>
                </div>

                {/* Info con altura fija para el título */}
                <div className="mt-3 flex flex-col flex-grow">
                    <h3 className="text-xs md:text-sm font-medium line-clamp-2 min-h-[3rem] group-hover:text-fg-muted transition-colors">
                        {product.nombre}
                    </h3>

                    <div className="flex items-baseline gap-2 text-sm text-fg-primary font-semibold mt-2">
                        {discount && (
                            <span className="line-through text-fg-muted text-xs font-normal">
                                S/ {compare.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                            </span>
                        )}
                        <span>
                            S/ {price.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Botón Comprar: ahora sin 'as any' */}
            <div className="mt-3 pt-1">
                <AddToCartButton product={product} />
            </div>
        </div>
    )
}