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
    <section className="py-2">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map(({ title, description, icon: Icon, url }) => (
            <Link
              key={title}
              href={url}
              className="group block"
            >
              {/* Reducción de p-5 a p-3 y min-h-[140px] a min-h-[90px] */}
              <Card className="h-full min-h-[60px] flex flex-row items-center gap-3 p-2 transition-all duration-300 hover:bg-surface-secondary/80 border border-surface-secondary/20 rounded-lg shadow-none">

                {/* Icono más pequeño: de 36 a 24 */}
                <div className="flex-shrink-0 inline-flex text-fg-primary/80 group-hover:text-action-primary transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <CardTitle className="text-[10px] md:text-[14px] font-bold uppercase leading-none tracking-tight text-fg-primary">
                    {title}
                  </CardTitle>

                  <CardDescription className="text-[10px] md:text-[12px] text-fg-primary/60 font-medium leading-tight line-clamp-2">
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