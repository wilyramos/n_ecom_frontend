"use client"

import Image from "next/image"
import Link from "next/link"
import type { ProductResponse } from "@/src/schemas"
import { MdOutlineImageNotSupported } from "react-icons/md"

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const img1 = product.imagenes?.[0]
    const img2 = product.imagenes?.[1] || img1

    const price = Number(product.precio) || 0
    const compare = Number(product.precioComparativo) || 0
    const discount = compare > price

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group block p-2 bg-surface-primary text-fg-primary transition-all  border border-border-default rounded-3xl shadow-sm"
        >
            {/* Imagen */}
            <div className="relative aspect-square overflow-hidden rounded-md">
                {img1 ? (
                    <>
                        <Image
                            src={img1}
                            alt={product.nombre || "Producto"}
                            fill
                            className={`object-contain p-4 transition ${img2 !== img1 ? "group-hover:opacity-0" : "group-hover:scale-105"
                                }`}
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
                    <div className="flex h-full items-center justify-center text-fg-secondary bg-surface-secondary/30">
                        <MdOutlineImageNotSupported size={40} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1">
                <h3 className="text-xs md:text-sm font-medium line-clamp-2 group-hover:text-fg-muted transition-colors">
                    {product.nombre}
                </h3>

                <div className="flex items-center gap-2 text-sm text-fg-primary font-semibold">
                    <span>
                        S/{" "}
                        {price.toLocaleString("es-PE", {
                            minimumFractionDigits: 2,
                        })}
                    </span>

                    {discount && (
                        <span className="line-through text-fg-muted text-xs font-normal">
                            S/ {compare.toLocaleString("es-PE")}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}