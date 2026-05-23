"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function StoreMaintenance() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Usamos sessionStorage en lugar de localStorage
        const hasSeen = sessionStorage.getItem("promo_viewed_neoshop");
        if (!hasSeen) {
            setOpen(true);
        }
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        // Cuando se cierra, marcamos como visto solo para esta sesión
        if (!isOpen) {
            sessionStorage.setItem("promo_viewed_neoshop", "true");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTitle className="sr-only">Promoción de Envíos</DialogTitle>

            <DialogContent
                className="w-[90vw] max-w-[340px] aspect-square p-0 overflow-hidden border-0 rounded-2xl flex flex-col z-9999 [&>button]:focus:ring-0 [&>button]:focus:ring-offset-0 [&>button]:focus:outline-none"
            >
                {/* ... resto de tu contenido igual ... */}
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-8 pb-4 bg-surface-primary overflow-hidden">
                    <div className="mb-1 leading-none text-fg-muted shrink-0">
                        <p className="text-[1.7rem] font-extrabold tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Envío a domicilio
                        </p>
                        <p className="text-[2.1rem] font-extrabold tracking-tighter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            SIN COSTO <span className="text-lg">🚚</span>
                        </p>
                    </div>

                    <div className="relative w-full flex-grow min-h-0 ">
                        <Image src="/envio-gratis.webp" alt="Envío gratis" fill className="object-contain" priority />
                    </div>

                    <div className="w-full">
                        <Button
                            asChild
                            className="w-fit text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            variant="secondary"
                            onClick={() => handleOpenChange(false)}
                        >
                            <Link href="/catalogo">Ver productos</Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}