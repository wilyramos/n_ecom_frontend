// File: frontend/components/cart/ResumenFinalCarrito.tsx
"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { MdOutlineImageNotSupported } from "react-icons/md";

const CULQI_TRANSACTION_FEE = 0.037;

// Constantes matemáticas exactas de Mercado Pago con IGV (18%) incluido
const MP_FIXED_FEE_WITH_IGV = 1.18; // S/ 1.00 + 18% IGV
const MP_TOTAL_PERCENTAGE_FEE_WITH_IGV = 0.164964; // (3.49% + 10.49%) * 1.18

export default function ResumenFinalCarrito() {
    const { cart } = useCartStore();
    const searchParams = useSearchParams();
    const selectedMethod = searchParams.get("method") || "transferencia";

    const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const envio = 0;

    const esCulqi = selectedMethod === "culqi";
    const esMP = selectedMethod === "mercadopago";

    // Cálculo del total según la pasarela activa
    let total = subtotal + envio;
    let comisionCulqi = 0;
    let mpCobroPasarela = 0;
    let mpFinanciacionCuotas = 0;

    if (esCulqi) {
        comisionCulqi = subtotal * CULQI_TRANSACTION_FEE;
        total += comisionCulqi;
    } else if (esMP) {
        // Aplicamos la fórmula matemática exacta del reverso
        total = (subtotal + MP_FIXED_FEE_WITH_IGV) / (1 - MP_TOTAL_PERCENTAGE_FEE_WITH_IGV);

        // Desglosamos las comisiones proporcionales basándonos en el total final
        mpCobroPasarela = (total * 0.0349 + 1) * 1.18;
        mpFinanciacionCuotas = total * 0.1049 * 1.18;
    }

    return (
        <section className="p-5 bg-background h-full border-l border-border-default">
            <h2 className="text-fg-action font-semibold text-sm md:text-base pb-2 tracking-tight">
                Resumen del carrito
            </h2>

            <div className="mt-4">
                <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent">
                    {cart.map((item) => {
                        const img = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
                        const price = item.variant?.precio ?? item.precio;
                        const attrs = item.variant?.atributos ?? null;

                        return (
                            <li
                                key={item._id + (item.variant?._id ?? "")}
                                className="flex justify-between items-center border-b border-border-default pb-3 last:border-0"
                            >
                                <div className="flex gap-3 items-center min-w-0">
                                    {img ? (
                                        <Image
                                            src={img}
                                            alt={item.variant?.nombre ?? item.nombre}
                                            width={48}
                                            height={48}
                                            quality={70}
                                            className="w-12 h-12 object-cover rounded-lg border border-border-default bg-surface-secondary"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-12 h-12 bg-surface-secondary rounded-lg border border-border-default">
                                            <MdOutlineImageNotSupported size={18} className="text-fg-muted" />
                                        </div>
                                    )}

                                    <div className="flex flex-col min-w-0">
                                        <p className="font-semibold text-fg-primary text-sm break-words max-w-[150px] leading-tight">
                                            {item.nombre}
                                        </p>
                                        {attrs && (
                                            <p className="text-[11px] text-fg-muted break-words max-w-[150px] mt-0.5">
                                                {Object.entries(attrs).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                                            </p>
                                        )}
                                        <p className="text-xs text-fg-muted mt-1 font-medium">
                                            x{item.cantidad} • S/ {price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-sm font-semibold text-fg-primary whitespace-nowrap">
                                    S/ {item.subtotal.toFixed(2)}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <div className="border-t border-border mt-5 pt-4 text-sm text-fg-muted space-y-2.5">
                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span className="text-fg-primary">S/ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Envío</span>
                        <span className="text-[10px] font-bold uppercase bg-fg-action text-accent-foreground px-2.5 py-0.5 rounded-full">
                            Gratis
                        </span>
                    </div>

                    {/* Fila dinámica para Culqi */}
                    {esCulqi && (
                        <div className="flex justify-between font-medium text-xs transition-all animate-in fade-in slide-in-from-top-1">
                            <span>Recargo pasarela tarjeta (3.7%)</span>
                            <span>S/ {comisionCulqi.toFixed(2)}</span>
                        </div>
                    )}

                    {/* Filas dinámicas desglosadas para Mercado Pago */}
                    {esMP && (
                        <>
                            <div className="flex justify-between font-medium text-xs  transition-all animate-in fade-in slide-in-from-top-1">
                                <span>Comisión de pasarela </span>
                                <span>S/ {mpCobroPasarela.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-xs  transition-all animate-in fade-in slide-in-from-top-1">
                                <span>Costo de financiación</span>
                                <span>S/ {mpFinanciacionCuotas.toFixed(2)}</span>
                            </div>
                        </>
                    )}

                    <hr className="border-border-default my-3" />

                    <div className="flex justify-between items-baseline font-bold text-fg-action text-lg">
                        <span className="text-base tracking-tight">Total a pagar</span>
                        <span className="text-xl text-fg-action tracking-tight">
                            S/ {total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}