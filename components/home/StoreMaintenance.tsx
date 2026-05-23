"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // 1. Importar Link
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function StoreMaintenance() {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="sr-only">Promoción de Envíos</DialogTitle>

            <DialogContent
                className="w-[90vw] max-w-[340px] aspect-square p-0 overflow-hidden border-0 rounded-2xl flex flex-col z-9999 [&>button]:focus:ring-0 [&>button]:focus:ring-offset-0 [&>button]:focus:outline-none" showCloseButton
            >
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-8 pb-4 bg-surface-primary overflow-hidden">

                    <div className="mb-1 leading-none text-fg-muted shrink-0">
                        <p
                            className="text-[1.7rem] font-extrabold tracking-tighter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Envío a domicilio
                        </p>
                        <p
                            className="text-[2.1rem] font-extrabold tracking-tighter mt-1"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            SIN COSTO <span className="text-lg">🚚</span>
                        </p>
                    </div>

                    <div className="relative w-full flex-grow min-h-0 ">
                        <Image
                            src="/envio-gratis.webp"
                            alt="Envío gratis"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="w-full">
                        {/* 2. Envolver el botón en Link */}
                        <Button
                            asChild
                            className=" w-fit text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            variant="secondary"
                        >
                            <Link href="/catalogo">Ver productos</Link>
                        </Button>
                    </div>
                </div>


            </DialogContent>
        </Dialog>
    );
}