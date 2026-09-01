"use client";

import { ShieldCheck, CheckCircle2, Headphones, Truck, LucideIcon } from "lucide-react";

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
      <div className="w-full p-2 md:px-6">
        
        {/* CONTENEDOR PRINCIPAL LIQUID GLASS - OSCURECIDO Y SATURADO */}
        <div className="w-full rounded-2xl bg-black/20 backdrop-blur-sm  py-3 px-2 sm:px-6">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {features.map(({ title, description, icon: Icon }) => (
              <div key={title} className="group block w-full">
                
                <div className="w-full h-full flex flex-row items-center justify-center gap-2.5 sm:gap-3.5 px-1 sm:px-2 transition-all duration-300">
                  
                  {/* Ícono en blanco */}
                  <div className="flex-shrink-0 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={1.5} />
                  </div>

                  {/* Textos en blanco */}
                  <div className="flex flex-col min-w-0 text-center justify-center h-full text-white drop-shadow-md">
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wide line-clamp-2 min-h-[1.8em] flex items-center">
                      <span className="line-clamp-2 md:line-clamp-2">{title}</span>
                    </span>

                    <span className="text-[6px] sm:text-[11px] md:text-xs font-medium leading-tight mt-0.5 min-h-[1.8em] flex items-start text-white/80">
                      <span className="line-clamp-2 md:line-clamp-2">{description}</span>
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}