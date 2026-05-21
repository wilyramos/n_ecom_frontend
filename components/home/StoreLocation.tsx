"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Logo from "../ui/Logo";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const storeImages = [
    "/logo_blanco_completo.png",
    "/logo_gris_app.png",
    "/logoapp.png",
    "/logo_fondo_negro_cuadrado.svg",
];

export default function StoreLocation() {
    return (
        <section className="py-6 text-fg-primary">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">

                    {/* IZQUIERDA */}
                    <div className="flex h-[500px] flex-col overflow-hidden ">

                        {/* Header */}
                        <div className="py-5">
                            <Logo color="black" size={40} />
                        </div>

                        {/* Info */}
                        <div className="space-y-4 py-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-fg-muted text-fg-inverse">
                                    <MapPin size={18} />
                                </div>

                                <div className="leading-tight">
                                    <p className="text-sm font-semibold text-fg-primary/70">
                                        Piso 3
                                    </p>

                                    <p className="text-sm font-bold text-fg-primary">
                                        Av. Caminos del Inca 257 · Surco
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-fg-muted text-fg-inverse">
                                    <Clock size={18} />
                                </div>

                                <div className="leading-tight">
                                    <p className="text-sm font-semibold text-fg-primary/70">
                                        Lunes a Sábado
                                    </p>

                                    <p className="text-sm font-bold text-fg-primary">
                                        11:00 am a 8:00 pm
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* MAPA */}
                        <div className="flex-1 overflow-hidden rounded-2xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.715367687508!2d-76.9995574!3d-12.1316521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b81dfca8a14b%3A0x6739023027b5e436!2sAv.%20Caminos%20del%20Inca%20257%2C%20Santiago%20de%20Surco%2015038!5e0!3m2!1ses-419!2spe!4v1710000000000!5m2!1ses-419!2spe"
                                className="h-full w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="overflow-hidden rounded-2xl">

                        <Carousel
                            responsive={responsive}
                            infinite
                            autoPlay
                            autoPlaySpeed={3000}
                            arrows
                            showDots={false}
                        >
                            {storeImages.map((src, index) => (
                                <div
                                    key={index}
                                    className="relative h-[500px] w-full"
                                >
                                    <Image
                                        src={src}
                                        alt={`Imagen ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}