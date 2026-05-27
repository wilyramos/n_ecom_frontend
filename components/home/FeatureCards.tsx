"use client";

import { ShieldCheck, CheckCircle2, Headphones, Truck, LucideIcon } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "1 AÑO DE GARANTÍA",
    description: "Cobertura por falla de fábrica",
    icon: ShieldCheck,
  },
  {
    title: "REGISTRADOS EN LISTA BLANCA",
    description: "Respaldado por Osiptel y MTC",
    icon: CheckCircle2,
  },
  {
    title: "ASESORÍA PERSONALIZADA",
    description: "Expertos en equipos Apple",
    icon: Headphones,
  },
  {
    title: "ENVÍO A TODO EL PERÚ",
    description: "Recíbelo en provincia en 24h",
    icon: Truck,
  },
];

export default function FeatureCards() {
  return (
    <section className="py-2 w-full">
      <div className="w-full px-2 md:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 w-full">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="group block w-full">
              <Card className="w-full h-full flex flex-row items-center justify-center gap-3 px-2 py-3 transition-all duration-300 hover:bg-surface-secondary/80 border border-surface-secondary/20 rounded-lg shadow-none">
                <div className="flex-shrink-0 text-fg-primary/80 group-hover:text-action-primary transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-0.5 overflow-hidden text-left">
                  <CardTitle className="text-[10px] md:text-[12px] font-bold uppercase text-fg-primary truncate">
                    {title}
                  </CardTitle>

                  <CardDescription className="text-[10px] md:text-[11px] text-fg-primary/60 font-medium leading-tight truncate md:whitespace-normal md:line-clamp-2">
                    {description}
                  </CardDescription>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}