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
    title: "1 Año de Garantía",
    description: "Cobertura por falla de fábrica",
    icon: ShieldCheck,
  },
  {
    title: "Lista Blanca Osiptel",
    description: "Equipos registrados y respaldados",
    icon: CheckCircle2,
  },
  {
    title: "Asesoría Experta",
    description: "Especialistas en equipos Apple",
    icon: Headphones,
  },
  {
    title: "Envío a todo el Perú",
    description: "Entrega en provincia en 24h",
    icon: Truck,
  },
];

export default function FeatureCards() {
  return (
    <section className="py-1 w-full max-w-screen-2xl mx-auto">
      <div className="w-full px-2 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4 w-full ">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="group block w-full">
              <Card className="w-full h-full flex flex-row items-center justify-center gap-2.5 sm:gap-3.5 px-2.5 sm:px-4 py-3 sm:py-4 transition-all duration-300 hover:bg-surface-secondary/80 border border-surface-secondary/20 rounded-xl shadow-none">
                <div className="flex-shrink-0 text-fg-action transition-colors">
                  <Icon className="w-5 h-5 sm:w-10 sm:h-10" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col min-w-0 text-center justify-center h-full">
                  <CardTitle className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wide text-fg-primary line-clamp-2 min-h-[1.8em] flex items-center">
                    <span className="line-clamp-2 md:line-clamp-2">{title}</span>
                  </CardTitle>

                  <CardDescription className="text-[8px] sm:text-[11px] md:text-xs text-fg-primary/60 font-medium leading-tight mt-0.5 min-h-[1.8em] flex items-start">
                    <span className="line-clamp-2 md:line-clamp-2">{description}</span>
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