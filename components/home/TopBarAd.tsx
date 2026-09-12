"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";
import { ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

interface TopBarAdProps {
    ads: TAdvertisement[];
}

const social = [
    { label: "Facebook", href: "https://www.facebook.com/people/Neoshop-Importaciones/61574230740862/", icon: <FaFacebookF size={11} /> },
    { label: "Instagram", href: "https://www.instagram.com/neoshopimportaciones", icon: <FaInstagram size={11} /> },
    { label: "WhatsApp", href: "https://wa.me/51902900653", icon: <FaWhatsapp size={11} /> },
];

export default function TopBarAd({ ads }: TopBarAdProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (ads.length <= 1) return;

        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [ads.length]);

    if (!ads || ads.length === 0) return null;

    const currentAd = ads[index];
    const ContentWrapper = currentAd.linkTo ? Link : "div";

    return (
        <div className="w-full h-8 bg-brand-silver text-brand-charcoal select-none overflow-hidden relative">
            <div className="w-full h-full max-w-7xl mx-auto px-3 grid grid-cols-12 items-center">
                
                {/* Contenedor Animado */}
                <div className="col-span-9 sm:col-span-12 flex sm:justify-center items-center overflow-hidden">
                    <ContentWrapper
                        key={index}
                        href={currentAd.linkTo || "#"}
                        className={`flex items-center gap-1.5 text-[9px] md:text-xs font-bold uppercase tracking-widest sm:text-center text-left min-w-0 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-1 duration-300 ${
                            currentAd.linkTo ? "hover:underline cursor-pointer group" : ""
                        }`}
                    >
                        <span className="text-[8px] md:text-xs truncate font-extrabold block text-brand-silver-border">
                            {currentAd.title}
                        </span>
                        {currentAd.subtitle && (
                            <span className="hidden sm:inline opacity-80 font-medium border-l border-brand-charcoal/20 pl-2 shrink-0">
                                {currentAd.subtitle}
                            </span>
                        )}
                        {currentAd.linkTo && (
                            <ArrowRight size={11} className="shrink-0 transition-transform group-hover:translate-x-1" />
                        )}
                    </ContentWrapper>
                </div>

                {/* Redes Sociales */}
                <div className="col-span-3 sm:absolute sm:right-4 md:right-8 flex items-center justify-end gap-1.5 z-10">
                    {social.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-4.5 w-4.5 rounded-full
                            text-brand-silver-border hover:text-brand-charcoal hover:bg-brand-silver-border/10 transition-colors duration-200
                            cursor-pointer shrink-0"
                            aria-label={item.label}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}