// File: src/components/banner/ui/SliderPrice.tsx
import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";

interface Props {
    price: TSliderPrice;
    textColor: string;    // Cambiado de 'color' a 'textColor'
    accentColor: string;
    isDark: boolean;
}

export default function SliderPrice({ price, textColor, accentColor, isDark }: Props) {
    return (
        <div
            className="inline-flex flex-col gap-1 w-fit"
            style={{ color: textColor }}
        >
            {/* ── Etiqueta superior (opcional) ──────────────────────── */}
            {price.label && (
                <span
                    className="w-fit text-[9px] sm:text-[11px] font-bold uppercase tracking-widest leading-none rounded-sm px-2 py-1 shadow-sm"
                    style={{
                        backgroundColor: accentColor,
                        color: "#ffffff", // Texto blanco para contrastar con el acento
                    }}
                >
                    {price.label}
                </span>
            )}

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">

                {/* ── Precio actual ─────────────────────────────────── */}
                {price.current !== undefined && price.current !== null && (
                    <span className="font-black tracking-tighter leading-none text-[clamp(1.4rem,4.5vw,3rem)]">
                        <span
                            className="mr-1 align-top font-bold text-[0.4em]"
                            style={{ opacity: isDark ? 0.6 : 0.5 }}
                        >
                            {price.currency ?? "S/"}
                        </span>

                        {price.current.toFixed(2)}

                        {price.suffix && (
                            <span
                                className="ml-1.5 align-baseline text-[0.3em] font-medium uppercase tracking-[0.1em]"
                                style={{ opacity: isDark ? 0.6 : 0.5 }}
                            >
                                {price.suffix}
                            </span>
                        )}
                    </span>
                )}

                {/* ── Precio anterior tachado ───────────────────────── */}
                {price.compare !== undefined && price.compare !== null && (
                    <span
                        className="text-xs sm:text-sm md:text-base font-medium leading-none tracking-tight line-through decoration-[1.5px]"
                        style={{ opacity: isDark ? 0.4 : 0.3 }}
                    >
                        {price.currency ?? "S/"}{price.compare.toFixed(2)}
                    </span>
                )}
            </div>
        </div>
    );
}