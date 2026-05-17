"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { cn } from "@/lib/utils";

export default function LayoutDefault({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className={cn(
                "banner-slot group relative w-full overflow-hidden h-[var(--banner-h-mobile)] md:h-[var(--banner-h)] flex flex-col",
                isDark ? "bg-surface-inverse" : "bg-surface-primary"
            )}
        >
            {/* Contenedor de contenido limitado a max-w-6xl y centrado */}
            <div className="relative z-10 w-full max-w-6xl mx-auto h-full flex flex-row items-center px-6 sm:px-10">

                {/* --- LADO IZQUIERDO: TEXTO --- */}
                <div
                    className={cn(
                        "flex flex-col justify-center items-start w-1/2 h-full pr-4 gap-3 sm:gap-4 overflow-hidden",
                        isDark ? "text-fg-inverse" : "text-fg-primary"
                    )}
                >
                    {subtitle && (
                        <div style={fadeUp(0.1)} className="flex-none">
                            <span
                                className={cn(
                                    "inline-block text-sm md:text-base font-bold uppercase px-2.5 py-1 border-l-3",
                                    isDark ? "text-fg-inverse border-surface-secondary" : "text-fg-primary border-action-primary"
                                )}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {description && (
                        <div style={fadeUp(0.3)} className="relative">
                            <p className="text-[11px] sm:text-[13px] md:text-[15px] leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-[32ch] text-fg-secondary">
                                {description}
                            </p>
                        </div>
                    )}

                    {price?.current !== undefined && (
                        <div style={fadeUp(0.45)} className="flex-none origin-left scale-[0.85] sm:scale-100 mt-2">
                            <SliderPrice
                                price={price}
                                color={isDark ? "var(--color-fg-inverse)" : "var(--color-fg-primary)"}
                                accentColor={isDark ? "var(--color-surface-secondary)" : "var(--color-action-primary)"}
                                isDark={isDark}
                            />
                        </div>
                    )}
                </div>

                {/* --- LADO DERECHO: MEDIA Y TITULO --- */}
                <div
                    className="flex flex-col justify-center items-center w-1/2 h-full p-1 sm:p-2 pointer-events-none"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateX(0) scale(1)" : "translateX(20px) scale(0.95)",
                        transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)"
                    }}
                >
                    <div className="relative aspect-square h-full max-h-[60%] sm:max-h-[70%] min-h-0 flex items-center justify-center w-full">
                        <ImageBorder
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            objectFit={media.objectFit ?? "cover"}
                            borderStyle={media.border ?? "curved-frame"}
                            sizes="(max-width: 640px) 50vw, 50vw"
                            className="transition-transform duration-[2000ms] group-hover:rotate-2 group-hover:scale-110"
                            priority
                        />
                    </div>

                    {title && (
                        <div className="flex flex-col items-center gap-2 mt-2 sm:mt-5 max-w-full">
                            <h2
                                className={cn(
                                    "flex-none font-semibold leading-[1.1] tracking-[-0.03em] text-[clamp(1.2rem,2.2vw,2.5rem)] text-center line-clamp-2",
                                    isDark ? "text-fg-inverse" : "text-fg-primary"
                                )}
                            >
                                {title}
                            </h2>
                            <div
                                className={cn(
                                    "h-[3px] w-6 sm:w-10 rounded-full flex-none",
                                    isDark ? "bg-surface-secondary" : "bg-action-primary"
                                )}
                                style={{
                                    opacity: loaded ? 1 : 0,
                                    transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
                                    transform: loaded ? "scaleX(1)" : "scaleX(0)",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}