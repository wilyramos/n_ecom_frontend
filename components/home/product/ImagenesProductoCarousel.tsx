"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const uniqueImages = useMemo(() => {
        return Array.from(new Set(images.filter(img => typeof img === 'string' && img.length > 0)));
    }, [images]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    useEffect(() => {
        if (selectedIndex >= uniqueImages.length) {
            setSelectedIndex(0);
        }
    }, [uniqueImages, selectedIndex]);

    const updateScrollButtons = () => {
        const el = thumbnailsRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        const el = thumbnailsRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);
        return () => {
            el.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, [uniqueImages, selectedIndex]);

    useEffect(() => {
        if (thumbnailsRef.current) {
            const container = thumbnailsRef.current;
            const selectedThumb = container.children[selectedIndex] as HTMLElement;
            if (selectedThumb) {
                const containerCenter = container.offsetWidth / 2;
                const thumbCenter = selectedThumb.offsetLeft + (selectedThumb.offsetWidth / 2);
                container.scrollTo({
                    left: thumbCenter - containerCenter,
                    behavior: "smooth"
                });
            }
        }
    }, [selectedIndex]);

    const scrollThumbs = (direction: "left" | "right") => {
        const el = thumbnailsRef.current;
        if (!el) return;
        el.scrollBy({ left: direction === "left" ? -120 : 120, behavior: "smooth" });
    };

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % uniqueImages.length);
        setZoom(false);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
        setZoom(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoom) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (zoom) return;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (zoom) return;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const isSignificantSwipe = Math.abs(distance) > 50;
        if (isSignificantSwipe) {
            if (distance > 0) nextImage();
            else prevImage();
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    const currentImgSrc = uniqueImages[selectedIndex] || null;

    if (!currentImgSrc || uniqueImages.length === 0) {
        return (
            <div className="w-full aspect-square flex flex-col items-center justify-center text-fg-secondary ">
                <ImageOff size={32} strokeWidth={1.2} />
                <span className="text-xs mt-2 font-medium">Imagen no disponible</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 bg-surface-primary select-none rounded-lg sticky top-24">
            
            {/* MAIN IMAGE */}
            <div className="flex-1 relative group w-full">
                <div
                    className={cn(
                        "relative aspect-square overflow-hidden bg-surface-primary",
                        zoom ? "cursor-zoom-out" : "cursor-zoom-in"
                    )}
                    onMouseMove={handleMouseMove}
                    onClick={() => setZoom(!zoom)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {currentImgSrc && (
                        <Image
                            key={currentImgSrc}
                            src={currentImgSrc}
                            alt="Producto principal"
                            fill
                            priority
                            className={cn(
                                "object-contain transition-transform duration-500 ease-out p-4 md:p-8",
                                zoom ? "scale-[2.5]" : "scale-100"
                            )}
                            style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
                            unoptimized
                        />
                    )}

                    {/* Zoom Button (Desktop Only) */}
                    <div className="absolute top-4 right-4 p-2.5 bg-surface-primary/60 backdrop-blur-lg rounded-full text-fg-primary opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {zoom ? <ZoomOut size={18} strokeWidth={1.5} /> : <ZoomIn size={18} strokeWidth={1.5} />}
                    </div>

                    {/* Navigation Controls */}
                    {uniqueImages.length > 1 && !zoom && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-primary/70 md:bg-surface-primary/50 backdrop-blur-xs text-fg-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-surface-primary active:scale-90 z-10 border border-border-default"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={20} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-primary/70 md:bg-surface-primary/50 backdrop-blur-xs text-fg-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-surface-primary active:scale-90 z-10 border border-border-default"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={20} strokeWidth={1.5} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* HORIZONTAL THUMBNAILS UNDERNEATH */}
            {uniqueImages.length > 1 && (
                <div className="relative flex items-center w-full px-1">
                    
                    {/* Botón scroll izquierda */}
                    <button
                        onClick={() => scrollThumbs("left")}
                        className={cn(
                            "absolute left-0  z-10 p-1 rounded-full border border-border-default bg-surface-primary text-fg-secondary hover:text-fg-primary transition-all duration-200 shadow-sm shadow-black/5",
                            !canScrollLeft && "opacity-0 pointer-events-none"
                        )}
                        aria-label="Desplazar miniaturas hacia la izquierda"
                    >
                        <ChevronLeft size={16} strokeWidth={2} />
                    </button>

                    {/* Lista de miniaturas horizontales */}
                    <div
                        ref={thumbnailsRef}
                        className="w-full flex flex-row gap-2 overflow-x-auto py-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {uniqueImages.map((img, idx) => (
                            <button
                                key={`${img}-${idx}`}
                                onClick={() => setSelectedIndex(idx)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                                className={cn(
                                    "relative aspect-square w-20 h-20 shrink-0 overflow-hidden border-2 rounded-lg bg-surface-primary transition-all duration-200 ease-in-out",
                                    selectedIndex === idx
                                        ? "border-action-primary opacity-100 scale-95 shadow-sm"
                                        : "border-border-default opacity-60 hover:opacity-100 hover:border-fg-secondary"
                                )}
                            >
                                <Image
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    fill
                                    className="object-contain p-1"
                                    sizes="80px"
                                    quality={40}
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>

                    {/* Botón scroll derecha */}
                    <button
                        onClick={() => scrollThumbs("right")}
                        className={cn(
                            "absolute right-0 z-10 p-1 rounded-full border border-border-default bg-surface-primary text-fg-secondary hover:text-fg-primary transition-all duration-200 shadow-sm shadow-black/5",
                            !canScrollRight && "opacity-0 pointer-events-none"
                        )}
                        aria-label="Desplazar miniaturas hacia la derecha"
                    >
                        <ChevronRight size={16} strokeWidth={2} />
                    </button>
                </div>
            )}
        </div>
    );
}