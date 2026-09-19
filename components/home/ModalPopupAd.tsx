// File: frontend/components/home/ModalPopupAd.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";

interface ModalPopupAdProps {
    ad: TAdvertisement;
}

export default function ModalPopupAd({ ad }: ModalPopupAdProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const storageKey = `neoshop_ad_viewed_${ad._id}`;
        const hasSeen = sessionStorage.getItem(storageKey);

        if (!hasSeen) {
            setOpen(true);
        }
    }, [ad._id]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            sessionStorage.setItem(`neoshop_ad_viewed_${ad._id}`, "true");
        }
    };

    const shouldRenderTitle = (ad.showTitle ?? true) && !!ad.title;

    const content = (
        <div className="flex flex-col bg-background transition-opacity group-hover:opacity-95">
            {(shouldRenderTitle || ad.subtitle) && (
                <div className="text-center space-y-0.5 shrink-0 mb-2">
                    {shouldRenderTitle && (
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-gris leading-snug mx-4">
                            {ad.title}
                        </h3>
                    )}
                    {ad.subtitle && (
                        <p className="text-[11px] sm:text-xs text-brand-gris font-medium leading-relaxed">
                            {ad.subtitle}
                        </p>
                    )}
                </div>
            )}

            {ad.imageUrl && (
                <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
                    <Image
                        src={ad.imageUrl}
                        alt={ad.title || "Anuncio publicitario"}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                </div>
            )}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTitle className="sr-only">{ad.title || "Anuncio"}</DialogTitle>

            <DialogContent
                showCloseButton={true}
                className="w-[90vw] max-w-[340px] sm:max-w-[380px] p-0 overflow-hidden bg-background border border-brand-silver-border rounded-2xl focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none"
            >
                {ad.linkTo ? (
                    <Link
                        href={ad.linkTo}
                        onClick={() => handleOpenChange(false)}
                        className="group block w-full text-left cursor-pointer focus:outline-none"
                    >
                        {content}
                    </Link>
                ) : (
                    <div
                        onClick={() => handleOpenChange(false)}
                        className="group block w-full text-left cursor-pointer focus:outline-none"
                    >
                        {content}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}