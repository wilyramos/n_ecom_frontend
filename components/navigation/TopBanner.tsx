"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

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

const social = [
    { label: "Facebook", href: "https://facebook.com/neoshop", icon: <FaFacebookF size={13} /> },
    { label: "Instagram", href: "https://instagram.com/neoshop", icon: <FaInstagram size={14} /> },
    { label: "WhatsApp", href: "https://wa.me/51902900653", icon: <FaWhatsapp size={14} /> },
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
        <div className="relative w-full h-8 bg-surface-secondary text-fg-inverse flex items-center justify-center border-b border-border-default select-none overflow-hidden">
            {/* Contenido centrado con max-w-xl */}
            <div className="w-full max-w-xl flex items-center justify-center px-4">
                <div
                    key={index}
                    className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-bottom-1 duration-300"
                >
                    <span className="shrink-0 text-fg-inverse">
                        {MESSAGES[index].icon}
                    </span>
                    <span className="text-fg-inverse truncate">
                        {MESSAGES[index].text}
                    </span>
                </div>
            </div>

            {/* Social posicionado absoluto fuera del flujo del max-w-xl */}
            <div className="absolute right-4 md:right-8 hidden sm:flex items-center gap-4">
                {social.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-inverse/70 border h-6 w-6 transition-colors hover:text-fg-inverse flex items-center justify-center rounded-2xl"
                        aria-label={item.label}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>
        </div>
    );
}