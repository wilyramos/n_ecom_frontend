"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useCatalogNav } from "./hooks/useCatalogNav";

const SORT_OPTIONS = [
  { value: "recientes", label: "Más Recientes" },
  { value: "relevancia", label: "Relevancia" },
  { value: "discount", label: "Mayor Descuento" },
  { value: "price-asc", label: "Menor Precio" },
  { value: "price-desc", label: "Mayor Precio" },
  { value: "name-asc", label: "Nombre: A - Z" },
];

export default function CatalogMobileSort() {
  const { updateFilter, searchParams } = useCatalogNav();
  const currentSort = searchParams.get("sort") || "recientes";

  return (
    <div className="relative inline-flex items-center">
      {/* Icono de ordenamiento a la izquierda */}
      <div className="absolute left-3 pointer-events-none text-brand-gris">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>

      {/* Select nativo */}
      <select
        value={currentSort}
        onChange={(e) => updateFilter("sort", e.target.value)}
        aria-label="Ordenar productos"
        className="
          appearance-none
          cursor-pointer
          h-9
          pl-8.5 pr-8
          rounded-xl
          border border-brand-silver-border
          bg-background
          text-xs font-medium text-brand-gris
          transition-colors duration-150
          hover:border-brand-gris
          focus:outline-none focus:border-brand-action focus:ring-2 focus:ring-brand-action-muted
        "
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="text-brand-charcoal bg-background">
            {option.label}
          </option>
        ))}
      </select>

      {/* Flecha indicadora a la derecha */}
      <div className="absolute right-2.5 pointer-events-none text-brand-gris">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}