"use client";

import Link from "next/link";
import { ShieldCheck, CheckCircle2, Headphones, Truck, LucideIcon } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

type Feature = {
    title: string;
    description: string;
    icon: LucideIcon;
    url: string;
};

const features: Feature[] = [
    {
        title: "1 AÑO DE GARANTÍA",
        description: "Cobertura por falla de fábrica",
        icon: ShieldCheck,
        url: "/hc/garantias-y-devoluciones"
    },
    {
        title: "REGISTRADOS EN LISTA BLANCA",
        description: "Respaldado por Osiptel y MTC",
        icon: CheckCircle2,
        url: "/hc/legal"
    },
    {
        title: "ASESORÍA PERSONALIZADA",
        description: "Expertos en equipos Apple",
        icon: Headphones,
        url: "/hc/contacto"
    },
    {
        title: "ENVÍO A TODO EL PERÚ",
        description: "Recíbelo en provincia en 24h",
        icon: Truck,
        url: "/hc/proceso-de-compra"
    },
];

export default function FeatureCards() {
    return (
   <section className="bg-surface-secondary py-5">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map(({ title, description, icon: Icon, url }) => (
        <Link
          key={title}
          href={url}
          className="group block h-full"
        >
          <Card className="h-full min-h-[140px] flex flex-col items-start justify-center gap-4 p-5 transition-all duration-300 hover:bg-surface-secondary/80 border-0">
            <div className="flex-shrink-0 inline-flex p-1 group-hover:text-fg-inverse">
              <Icon size={36} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-xs md:text-sm font-bold uppercase leading-tight tracking-normal">
                {title}
              </CardTitle>

              <CardDescription className="text-xs text-fg-primary/70 font-medium leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  </div>
</section>
    );
}