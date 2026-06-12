// File: src/components/banner/ui/SliderPrice.tsx
import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";

interface Props {
    price: TSliderPrice;
    textColor: string;
    accentColor: string;
    isDark: boolean;
}

export default function SliderPrice({ price, textColor, accentColor, isDark }: Props) {
    // Definimos el símbolo fijo de la moneda de acuerdo al Backend Model que no almacena currency
    const CURRENCY_SYMBOL = "S/";

    return (
        <div
            className="inline-flex flex-col gap-0.5 sm:gap-1 w-fit"
            style={{ color: textColor }}
        >
            {/* ── Etiqueta superior (opcional) ──────────────────────── */}
            {price.label && (
                <span
                    className="w-fit text-[7.5px] sm:text-[11px] font-bold uppercase tracking-widest leading-none rounded-sm px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-sm whitespace-nowrap animate-fade-in"
                    style={{
                        backgroundColor: accentColor,
                        color: isDark ? "#171411" : "#ffffff",
                    }}
                >
                    {price.label}
                </span>
            )}

            <div className="flex items-baseline gap-x-1.5 sm:gap-x-3 gap-y-0.5">

                {/* ── Precio actual ─────────────────────────────────── */}
                {price.current !== undefined && price.current !== null && (
                    <span className="font-black tracking-tighter leading-none text-[clamp(1.15rem,4.5vw,3rem)] whitespace-nowrap">
                        <span
                            className="mr-0.5 sm:mr-1 align-top font-bold text-[0.45em]"
                            style={{ opacity: isDark ? 0.6 : 0.5 }}
                        >
                            {CURRENCY_SYMBOL}
                        </span>

                        {price.current.toFixed(2)}

                        {price.suffix && (
                            <span
                                className="ml-1 align-baseline text-[0.35em] font-medium uppercase tracking-[0.05em] sm:tracking-[0.1em]"
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
                        className="text-[9px] sm:text-sm md:text-base font-medium leading-none tracking-tight line-through decoration-[1px] sm:decoration-[1.5px] whitespace-nowrap"
                        style={{ opacity: isDark ? 0.4 : 0.3 }}
                    >
                        {CURRENCY_SYMBOL}{price.compare.toFixed(2)}
                    </span>
                )}
            </div>
        </div>
    );
}