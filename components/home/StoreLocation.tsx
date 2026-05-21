"use client";

import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Logo from "../ui/Logo";

export default function StoreLocation() {
    return (
        <section className="bg-surface-primary text-fg-primary py-12 border-t border-border-default">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                    
                    {/* Columna Izquierda: Información, Mapa y Botones */}
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Logo color="black" size={40} />
                        </div>

                        <div className="space-y-4 text-sm md:text-base">
                            {/* Dirección */}
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-action-primary">
                                    <MapPin size={16} />
                                </div>
                                <div className="text-fg-primary">
                                    <p className="font-semibold">Piso 3</p>
                                    <p className="text-fg-muted text-sm">Av. Caminos del Inca 257 · Surco</p>
                                </div>
                            </div>

                            {/* Horario */}
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-action-primary">
                                    <Clock size={16} />
                                </div>
                                <div className="text-fg-primary">
                                    <p className="font-semibold">Lunes a Sábado</p>
                                    <p className="text-fg-muted text-sm">11:00 am a 8:00 pm</p>
                                </div>
                            </div>
                        </div>

                        {/* Contenedor del Mapa debajo de la información */}
                        <div className="w-full aspect-video overflow-hidden border border-border-default bg-surface-secondary rounded-md">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.715367687508!2d-76.9995574!3d-12.1316521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b81dfca8a14b%3A0x6739023027b5e436!2sAv.%20Caminos%20del%20Inca%20257%2C%20Santiago%20de%20Surco%2015038!5e0!3m2!1ses-419!2spe!4v1710000000000!5m2!1ses-419!2spe"
                                className="w-full h-full border-0"
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Botones de Navegación */}
                        {/* <div className="flex flex-wrap gap-4 pt-2">
                            <a 
                                href="https://maps.google.com/?q=Av.+Caminos+del+Inca+257,+Surco,+Lima" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md bg-action-primary px-5 py-2.5 text-sm font-semibold text-fg-inverse shadow-sm hover:bg-action-primary-hover transition-colors"
                            >
                                Abrir en Google Maps
                            </a>
                            <a 
                                href="https://waze.com/ul?q=Av.+Caminos+del+Inca+257,+Surco,+Lima" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md border border-border-default bg-surface-primary px-5 py-2.5 text-sm font-semibold text-fg-primary shadow-sm hover:bg-surface-secondary transition-colors"
                            >
                                Abrir en Waze
                            </a>
                        </div> */}
                    </div>

                    {/* Columna Derecha: Imagen de Tienda Sola */}
                    <div className="w-full aspect-square overflow-hidden border border-border-default rounded-md bg-surface-secondary">
                        <Image
                            src="/logo_gris_completo.png"
                            alt="Fachada Neoshop Importaciones Surco"
                            className="w-full h-full object-cover"
                            width={800}
                            height={800}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}