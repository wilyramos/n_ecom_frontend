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
            className="banner-slot group relative w-full overflow-hidden "
            style={{ backgroundColor: bg }}
        >
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={media!.videoUrl}
                    poster={media!.videoPoster ?? media!.imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover
                               transition-transform duration-[1800ms]
                               group-hover:scale-[1.03]"
                />
            ) : media?.imageUrl ? (
                <Image
                    src={media.imageUrl}
                    alt={media.altText ?? title ?? ""}
                    fill
                    className={`transition-transform duration-[1800ms] group-hover:scale-[1.03]
                               ${media.objectFit === "contain" ? "object-contain" : "object-cover"}`}
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
            aria-label={title ?? banner.name}
        >
            {content}
        </Link>
    );
}