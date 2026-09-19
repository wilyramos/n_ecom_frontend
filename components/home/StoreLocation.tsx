// File: frontend/components/home/StoreLocation.tsx
"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";

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
  "/locacion1.webp",
  "/locacion2.webp",
  "/location3.webp",
];

const CustomLeftArrow = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label="Imagen anterior"
    className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 text-brand-gris backdrop-blur-xs transition-all hover:bg-background hover:scale-110"
  >
    <ChevronLeft size={20} />
  </button>
);

const CustomRightArrow = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label="Siguiente imagen"
    className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 text-brand-gris backdrop-blur-xs transition-all hover:bg-background hover:scale-110"
  >
    <ChevronRight size={20} />
  </button>
);

export default function StoreLocation() {
  return (
    <section className="py-6 text-brand-gris">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="flex h-[500px] flex-col overflow-hidden">
            {/* Header - Contenedor del Logo Ampliado */}
            <div className="w-full max-w-[280px] mb-4">
              <Logo color="black" />
            </div>

            {/* Info */}
            <div className="space-y-2 pb-4">
              
              {/* Distribuidor garantizado con icono */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-silver text-brand-silver-border">
                  <LuBadgeCheck size={18} />
                </div>
                <div className="leading-tight flex flex-col justify-center">
                  <p className="text-sm font-semibold text-brand-gris">
                    Distribuidor garantizado
                  </p>
                  <p className="text-sm font-bold text-brand-gris">
                    neoshopimportaciones@gmail.com
                  </p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-silver text-brand-silver-border">
                  <MapPin size={18} />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-brand-gris">
                    Av caminos del inca 257-Surco
                  </p>
                  <p className="text-sm font-bold text-brand-gris">
                    Piso 3 - Tda 326
                  </p>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-silver text-brand-silver-border">
                  <Clock size={18} />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-brand-gris">
                    Lunes a Sábado
                  </p>
                  <p className="text-sm font-bold text-brand-gris">
                    12:00 pm a 8:00 pm
                  </p>
                </div>
              </div>
            </div>

            {/* MAPA */}
            <div className="flex-1 overflow-hidden rounded-md border border-brand-silver-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.71171804938!2d-76.9945115!3d-12.1318464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b8178cd39e33%3A0x633512e09153574c!2sAv.%20Caminos%20del%20Inca%20257%2C%20Santiago%20de%20Surco%2015038!5e0!3m2!1ses-419!2spe!4v1717684000000!5m2!1ses-419!2spe"
                className="h-full w-full border-0"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
/>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="h-[500px] overflow-hidden rounded-md border border-brand-silver-border">
            <Carousel
              responsive={responsive}
              infinite={false}
              autoPlay={false}
              customLeftArrow={<CustomLeftArrow onClick={() => {}} />}
              customRightArrow={<CustomRightArrow onClick={() => {}} />}
              showDots={false}
              containerClass="h-full"
              sliderClass="h-full"
              itemClass="h-full"
            >
              {storeImages.map((src, index) => (
                <div
                  key={index}
                  className="relative h-full w-full"
                >
                  <Image
                    src={src}
                    alt={`Instalaciones Neoshop - Vista ${index + 1}`}
                    fill
                    priority={false}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    quality={100}
                    unoptimized={true}
                  />
                </div>
              ))}
            </Carousel>
          </div>

        </div>

        {/* SECCIÓN INFERIOR - MARCAS AUTORIZADAS */}
        <div className="mt-8 flex flex-row items-center justify-between gap-6 border-t border-brand-silver-border pt-6">
          <p className="text-base md:text-2xl font-bold text-brand-gris text-center md:text-left">
            Autorizado por:
          </p>

          <div className="flex items-center gap-10">
            <div className="relative h-10 w-18 md:w-32">
              <Image
                src="/osiptel.png"
                alt="Entidad Reguladora Osiptel"
                fill
                loading="lazy"
                className="object-contain"
                sizes="(max-width: 768px) 72px, 128px"
                quality={100}
                unoptimized={true}
              />
            </div>
            <div className="relative h-10 w-18 md:w-32">
              <Image
                src="/mtc.png"
                alt="Ministerio de Transportes y Comunicaciones - MTC"
                fill
                loading="lazy"
                className="object-contain"
                sizes="(max-width: 768px) 72px, 128px"
                quality={100}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}