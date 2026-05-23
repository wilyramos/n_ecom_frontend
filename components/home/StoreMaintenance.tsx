"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import Logo from "../ui/Logo";
import { Button } from "../ui/button";

export default function StoreMaintenance() {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="sr-only">Promoción de Envíos</DialogTitle>

            <DialogContent
                className="w-[92vw] sm:w-full max-w-sm sm:max-w-md p-0 overflow-hidden  border-0 rounded-2xl"
                showCloseButton
            >
                <div className="relative flex flex-col items-center text-center px-6 pt-8 pb-6 bg-surface-primary">
                    {/* Título */}
                    <div className="mb-1 leading-none text-fg-muted">
                        <p
                            className="text-[2.6rem] font-extrabold tracking-tighter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Envío a domicilio
                        </p>
                        <p
                            className="text-[3.2rem] font-extrabold tracking-tighter -mt-2"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            SIN COSTO <span className="text-2xl">🚚</span>
                        </p>
                    </div>

                    {/* Imagen */}
                    <div className="relative w-full aspect-[4/3] my-2">
                        <Image
                            src="/envio-gratis.webp"
                            alt="iPhone, iPad y AirPods"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>



                    {/* CTA */}
                    <Button
                        onClick={() => setOpen(false)}
                        className="mt-1 w-full max-w-[180px]"
                        variant="secondary"
                    >
                        Ver productos
                    </Button>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-4 px-5 py-3 bg-surface-primary">
                    <Logo />
                </div>
            </DialogContent>
        </Dialog>
    );
}