// frontend/components/navigation/TopBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";

const MESSAGES = [
    {
        text: "ENVÍOS A TODO EL PERÚ - LLEGA HOY EN LIMA",
        icon: <Truck size={14} strokeWidth={1.5} />
    },
    {
        text: "HASTA 12 CUOTAS SIN INTERESES CON TARJETAS BBVA Y BCP",
        icon: <CreditCard size={14} strokeWidth={1.5} />
    },
    {
        text: "GARANTÍA OFICIAL EN TODOS NUESTROS EQUIPOS APPLE",
        icon: <ShieldCheck size={14} strokeWidth={1.5} />
    },
];

export default function TopBanner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-8 bg-surface-secondary text-fg-primary flex items-center justify-center overflow-hidden border-b border-border-default select-none">
            <div 
                key={index} 
                className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center px-4 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
                <span className="shrink-0 text-fg-primary">
                    {MESSAGES[index].icon}
                </span>
                <span>
                    {MESSAGES[index].text}
                </span>
            </div>
        </div>
    );
}