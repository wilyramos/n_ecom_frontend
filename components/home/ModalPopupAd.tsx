"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTitle className="sr-only">{ad.title}</DialogTitle>

            <DialogContent
                className="w-[90vw] max-w-[340px] p-0 overflow-hidden rounded-2xl bg-background shadow-xl z-9999 border-border border [&>button]:focus:ring-0 [&>button]:focus:ring-offset-0 [&>button]:focus:outline-none [&>button]:outline-none [&>button]:border-0 [&>button]:focus-visible:outline-none"
            >
                <div className="flex flex-col p-5 gap-4 bg-background">
                    {/* ── 1. TÍTULO EN LA PARTE SUPERIOR ── */}
                    <div className="text-center space-y-1 shrink-0">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-fg-muted leading-snug">
                            {ad.title}
                        </h3>
                        {ad.subtitle && (
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                {ad.subtitle}
                            </p>
                        )}
                    </div>

                    {/* ── 2. IMAGEN AL MEDIO RESPONSIVE ── */}
                    {ad.imageUrl && (
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xs border border-border/10">
                            <Image
                                src={ad.imageUrl}
                                alt={ad.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        </div>
                    )}

                    {/* ── 3. BOTÓN AL FINAL ── */}
                    <div className="w-full shrink-0">
                        {ad.linkTo ? (
                            <Button
                                asChild
                                size="sm"
                                className="w-full text-xs font-semibold h-9 rounded-lg cursor-pointer"
                                onClick={() => handleOpenChange(false)}
                            >
                                <Link href={ad.linkTo}>Ver Detalles</Link>
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="accent"
                                className="w-full text-xs font-semibold h-9 cursor-pointer"
                                onClick={() => handleOpenChange(false)}
                            >
                                Cerrar
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}