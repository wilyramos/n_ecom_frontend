"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { cn } from "@/lib/utils";

type Props = {
    banner: SliderBanner;
};

export default function LayoutMinimal({ banner }: Props) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(12px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    const discountPct =
        price?.compare && price?.current
            ? Math.round(((price.compare - price.current) / price.compare) * 100)
            : null;

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className={cn(
                "banner-slot group relative overflow-hidden flex flex-col lg:flex-row items-center w-full",
                isDark ? "bg-surface-inverse" : "bg-surface-primary"
            )}
        >
            {/* ── Columna Imagen ── */}
            <div
                className="
        relative z-10
        order-1 lg:order-2
        w-full lg:w-[66.666667%]  {/* Ajustado a 2/3 */}
        h-[50%] lg:h-full
        flex items-center justify-center
        overflow-hidden
    "
            >
                <div
                    className="
                        relative
                        w-[70%] sm:w-[60%] lg:w-[85%]
                        h-[85%]
                        transition-all duration-1000 ease-out
                    "
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "scale(1) rotate(0deg)" : "scale(0.9) rotate(-2deg)",
                    }}
                >
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "contain"}
                        borderStyle={media.border ?? "none"}
                        priority
                        sizes="(max-width: 1024px) 75vw, 45vw"
                        className="select-none"
                    />
                </div>
            </div>

            {/* ── Columna Texto ── */}
            <div
                className={cn(
                    "relative z-10 order-2 lg:order-1 flex flex-col items-center lg:items-start justify-center w-full lg:w-[33.333333%] px-4 sm:px-8 pb-10 lg:pb-0 text-center lg:text-left",
                    isDark ? "text-fg-inverse" : "text-fg-muted"
                )}
            >
                {/* Badges Minimalistas */}
                {discountPct && (
                    <div
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5 md:mb-6"
                        style={fadeUp(0.1)}
                    >
                        <span
                            className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded",
                                isDark ? "bg-brand-black text-fg-inverse" : "bg-surface-secondary text-fg-primary"
                            )}
                        >
                            {discountPct}% OFF
                        </span>
                    </div>
                )}

                {title && (
                    <h2
                        className="w-full text-[clamp(1.6rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.04em] mb-2"
                        style={fadeUp(0.2)}
                    >
                        {title}
                    </h2>
                )}

                {subtitle && (
                    <div
                        className="flex justify-center lg:justify-start mb-4 md:mb-6"
                        style={fadeUp(0.25)}
                    >
                        <span
                            className={cn(
                                "text-md",
                                isDark ? "border-fg-secondary text-fg-inverse" : "text-brand-silver"
                            )}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                <div className="flex justify-center lg:justify-start w-full" style={fadeUp(0.3)}>
                    <span
                        className={cn(
                            "mb-6 md:mb-8 px-6 py-2 text-sm font-medium rounded transition-colors duration-600 inline-flex",
                            isDark
                                ? "bg-transparent border border-fg-secondary text-fg-inverse hover:bg-fg-secondary hover:text-fg-inverse"
                                : "bg-brand-silver text-fg-inverse hover:bg-brand-muted hover:text-fg-inverse"
                        )}
                    >
                        Ver catalogo
                    </span>
                </div>

                {description && (
                    <p
                        className="max-w-[40ch] text-[14px] sm:text-[15px] leading-relaxed mb-6 md:mb-8 font-light text-fg-secondary"
                        style={fadeUp(0.35)}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div style={fadeUp(0.4)} className="flex-none lg:self-start">
                        <SliderPrice
                            price={price}
                            color={isDark ? "var(--color-fg-inverse)" : "var(--color-fg-primary)"}
                            accentColor={isDark ? "var(--color-fg-secondary)" : "var(--color-action-primary)"}
                            isDark={isDark}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}