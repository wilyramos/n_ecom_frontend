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
                className="w-[90vw] max-w-[340px] sm:max-w-[380px] p-0 overflow-hidden bg-background rounded-2xl"
            >
                <div className="flex flex-col p-4 sm:p-5  bg-background">

                    <div className="text-center space-y-0.5 shrink-0">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-fg-muted leading-snug">
                            {ad.title}
                        </h3>
                        {ad.subtitle && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-relaxed">
                                {ad.subtitle}
                            </p>
                        )}
                    </div>

                    {ad.imageUrl && (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
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

                    <div className="w-full shrink-0">
                        {ad.linkTo ? (
                            <Button
                                asChild
                                size="sm"
                                className="w-full text-xs font-semibold  cursor-pointer focus:ring-0 focus-visible:ring-0 focus:shadow-none"
                                onClick={() => handleOpenChange(false)}
                            >
                                <Link href={ad.linkTo}>Ver Detalles</Link>
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="accent"
                                className="w-full text-xs font-semibold cursor-pointer focus:ring-0 focus-visible:ring-0 focus:shadow-none"
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