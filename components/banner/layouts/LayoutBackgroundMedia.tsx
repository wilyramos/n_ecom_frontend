// File: frontend/components/banner/layouts/LayoutBackgroundMedia.tsx
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

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#cbcbcb" : "#171411");
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
            className="banner-slot group relative w-full overflow-hidden flex items-center justify-center text-center"
            style={{ backgroundColor: bg }}
        >
            {/* ── Media de fondo ────────────────────────────────────── */}
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={media!.videoUrl}
                    poster={media!.imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover ]"
                />
            ) : media?.imageUrl ? (
                <Image
                    src={media.imageUrl}
                    alt={title ?? "Banner Background"}
                    fill
                    className={`absolute inset-0 ${media.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                    sizes="100vw"
                    priority
                    unoptimized
                />
            ) : null}

            {/* ── Gradiente inferior para legibilidad ────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)`,
                }}
            />

            {/* ── Contenido ─────────────────────────────────────────── */}
            <div className="relative z-20 w-full max-w-6xl mx-auto px-3 py-2 sm:py-0 h-full flex flex-col justify-center items-center">
                <div
                    className="flex flex-col items-center justify-center w-full max-w-[95%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl gap-0.5 sm:gap-0"
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div className="mb-0.5 sm:mb-2 md:mb-4" style={fadeUp(0.08)}>
                            <span
                                className="inline-block text-[7.5px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.32em] uppercase px-2 sm:px-3 py-[2px] sm:py-[5px] rounded-full backdrop-blur-sm whitespace-nowrap"
                                style={{
                                    color: accent,
                                    background: `${accent}22`,
                                    border: `1px solid ${accent}40`,
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="font-black leading-[1.1] tracking-[-0.04em] text-[clamp(1.15rem,6vw,4.5rem)] line-clamp-2 sm:line-clamp-none"
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
                            className="mt-0.5 sm:mt-2 md:mt-4 text-[9px] sm:text-[13px] md:text-sm leading-tight sm:leading-[1.7] max-w-[40ch] line-clamp-1 sm:line-clamp-2"
                            style={{ opacity: 0.75, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && price.current !== null && (
                        <div className="mt-0.5 sm:mt-2 md:mt-4" style={fadeUp(0.35)}>
                            <SliderPrice
                                price={price}
                                textColor={text}
                                accentColor={accent}
                                isDark={isDark}
                            />
                        </div>
                    )}

                    {terms && (
                        <div style={fadeUp(0.40)} className="mt-0.5 sm:mt-3 md:mt-5">
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
            aria-label={title ?? "Banner Link"}
            className="block w-full"
        >
            {content}
        </Link>
    );
}