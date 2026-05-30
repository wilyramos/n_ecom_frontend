// File: src/components/banner/layouts/LayoutMediaLeft.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutMediaLeft({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, terms, price, destUrl, openInNewTab } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#a0a0a0" : "#0f0f0f");
    const accent = design.accentColor ?? "#a0a0a0";
    
    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    const content = (
        <div
            className="banner-slot group relative w-full overflow-hidden flex items-center"
            style={{ backgroundColor: bg }}
        >
            <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-row items-center px-3 sm:px-8">

                {/* ── Media (izquierda) ─────────────────────────────── */}
                {media?.imageUrl && (
                    <div
                        className="w-1/2 h-full pointer-events-none"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateX(0) scale(1)" : "translateX(-20px) scale(0.95)",
                            transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={media.imageUrl}
                                alt={media.altText ?? title ?? ""}
                                fill
                                className={`transition-transform duration-[2000ms] group-hover:scale-105
                           ${media.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                                sizes="(max-width: 640px) 50vw, 40vw"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>
                )}

                {/* ── Texto (derecha) ───────────────────────────────── */}
                <div
                    className="flex flex-col justify-center items-start w-1/2 h-full pl-1.5 sm:pl-4 py-2 sm:py-0 gap-1 sm:gap-4 overflow-hidden"
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div style={fadeUp(0.1)}>
                            <span
                                className="inline-block text-[9px] sm:text-sm md:text-base font-bold uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 leading-none sm:leading-normal"
                                style={{ borderLeft: `2.5px solid ${accent}` }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <div style={fadeUp(0.2)}>
                            <h2
                                className="font-bold leading-[1.1] tracking-[-0.03em] text-[clamp(1.05rem,2.5vw,2.8rem)] line-clamp-2 sm:line-clamp-3"
                            >
                                {title}
                            </h2>
                        </div>
                    )}

                    {description && (
                        <div style={fadeUp(0.3)}>
                            <p
                                className="text-[9px] sm:text-[13px] md:text-sm leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-4 max-w-[32ch]"
                                style={{ opacity: 0.75 }}
                            >
                                {description}
                            </p>
                        </div>
                    )}

                    {price?.current !== undefined && price.current !== null && (
                        <div style={fadeUp(0.45)} className="mt-0.5 sm:mt-1">
                            <SliderPrice
                                price={price}
                                textColor={text}
                                accentColor={accent}
                                isDark={isDark}
                            />
                        </div>
                    )}

                    {terms && (
                        <div style={fadeUp(0.50)} className="mt-0.5 sm:mt-2">
                            <p className="text-[7px] sm:text-[9px] font-medium tracking-wide uppercase line-clamp-1" style={{ opacity: 0.45 }}>
                                {terms}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (!destUrl) return content;

    return (
        <Link
            href={destUrl}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            aria-label={title ?? banner.name}
            className="block w-full"
        >
            {content}
        </Link>
    );
}