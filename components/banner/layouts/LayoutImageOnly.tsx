// File: src/components/banner/layouts/LayoutImageOnly.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageOnly({ banner }: { banner: SliderBanner }) {
    const { media, title, destUrl, openInNewTab, design } = banner;
    const videoRef = useRef<HTMLVideoElement>(null);

    const isVideo = Boolean(media?.videoUrl);
    const bg = design.bgColor ?? "#000000";

    const content = (
        <div
            className="banner-slot group relative w-full overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: bg }}
        >
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={media!.videoUrl}
                    poster={media?.imageUrl ?? "bannervideoplaceholder.jpg"}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : media?.imageUrl ? (
                <Image
                    src={media.imageUrl}
                    alt={title ?? "Banner"}
                    fill
                    className={media.objectFit === "contain" ? "object-contain" : "object-cover"}
                    sizes="100vw"
                    priority
                    unoptimized
                />
            ) : null}
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