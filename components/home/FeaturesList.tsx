"use client";

import Link from "next/link";
import { TicketPercent, Truck, ShieldCheck, ArrowLeftRight } from "lucide-react";

type Feature = {
    title: string;
    description: string;
    icon: typeof TicketPercent;
    url?: string;
};

const features: Feature[] = [
    {
        title: "Ofertas exclusivas",
        description: "Precios especiales para ti",
        icon: TicketPercent,
        url: "/ofertas"
    },
    {
        title: "Envíos rápidos",
        description: "A todo el país en tiempo récord",
        icon: Truck,
        url: "/hc/proceso-de-compra"
    },
    {
        title: "Pago 100% seguro",
        description: "Tus datos están protegidos",
        icon: ShieldCheck,
        url: "/hc/preguntas-frecuentes"
    },
  
];

export default function MinimalFeatures() {
    return (
        <section className="bg-[var(--color-bg-primary)] py-12 md:py-16 border-b border-[var(--color-border-default)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        const Content = (
                            <div
                                className="group relative flex flex-col gap-3 p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] cursor-pointer transition-all duration-300 hover:border-[var(--color-border-secondary)] hover:shadow-sm hover:-translate-y-0.5 overflow-hidden"
                                aria-label={feature.title}
                            >
                                {/* Fondo gradiente sutil en hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--color-bg-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                {/* Icono */}
                                <div className="relative z-10 inline-flex w-fit p-2.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] group-hover:bg-[var(--color-bg-tertiary)] group-hover:border-[var(--color-border-secondary)] group-hover:scale-105 transition-all duration-300">
                                    <Icon size={18} strokeWidth={1.6} />
                                </div>

                                {/* Contenido */}
                                <div className="relative z-10 flex flex-col gap-1">
                                    <h3 className="text-[13px] md:text-sm font-semibold text-[var(--color-text-primary)] leading-snug tracking-tight group-hover:text-[var(--color-text-primary)] transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed group-hover:text-[var(--color-text-secondary)] transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );

                        return (
                            <div key={feature.title} className="h-full">
                                {feature.url ? (
                                    <Link href={feature.url} className="block group/link">
                                        {Content}
                                    </Link>
                                ) : (
                                    Content
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}