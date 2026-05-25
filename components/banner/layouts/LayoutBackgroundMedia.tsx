"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutBackgroundMedia({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, terms, price, destUrl, openInNewTab } = banner;
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Definición de variables de diseño
    // Lógica de colores actualizada
    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#a0a0a0" : "#0f0f0f");
    const accent = design.accentColor ?? "#a0a0a0";

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const fadeUp = (delay: number, extra?: React.CSSProperties): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extra,
    });

    const isVideo = Boolean(media?.videoUrl);

    const content = (
        <div
            className="banner-slot group relative w-full overflow-hidden flex items-end justify-center text-center "
            style={{ backgroundColor: bg }}
        >
            {/* ── Media de fondo ────────────────────────────────────── */}
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={media!.videoUrl!}
                    poster={media!.videoPoster ?? media!.imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
            ) : media?.imageUrl ? (
                <Image
                    src={media.imageUrl}
                    alt={media.altText ?? title ?? ""}
                    fill
                    className={`absolute inset-0 object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] ${media.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                    sizes="100vw"
                    priority
                    unoptimized
                />
            ) : null}

            {/* ── Gradiente inferior ────────────────────────────────── */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
                style={{
                    height: "85%",
                    background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.60) 40%, rgba(0,0,0,0.20) 70%, transparent 100%)`,
                }}
            />

            {/* ── Contenido ─────────────────────────────────────────── */}
            <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pb-6 sm:pb-12 md:pb-16 flex flex-col items-center">
                <div
                    className="flex flex-col items-center w-full max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div className="mb-2 md:mb-4" style={fadeUp(0.08)}>
                            <span
                                className="inline-block text-[8px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.32em] uppercase px-3 py-[3px] sm:py-[5px] rounded-full"
                                style={{
                                    color: accent,
                                    background: `${accent}22`,
                                    border: `1px solid ${accent}40`,
                                    backdropFilter: "blur(6px)",
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="font-black leading-[1.05] tracking-[-0.04em] text-[clamp(1.3rem,6vw,4.5rem)]"
                            style={fadeUp(0.15, {
                                transform: loaded ? "translateY(0px) scale(1)" : "translateY(18px) scale(0.96)",
                                transition: `opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s`,
                            })}
                        >
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p
                            className="mt-2 md:mt-4 text-[10px] sm:text-[13px] md:text-sm leading-[1.5] sm:leading-[1.7] max-w-[40ch] line-clamp-2"
                            style={{ opacity: 0.75, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && price.current !== null && (
                        <div className="mt-2 md:mt-4" style={fadeUp(0.35)}>
                            <SliderPrice
                                price={price}
                                textColor={text}
                                accentColor={accent}
                                isDark={isDark}
                            />
                        </div>
                    )}

                    {terms && (
                        <div style={fadeUp(0.40)} className="mt-3 md:mt-5">
                            <p className="text-[8px] sm:text-[9px] font-medium tracking-wide uppercase" style={{ opacity: 0.45 }}>
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
        >
            {content}
        </Link>
    );
}