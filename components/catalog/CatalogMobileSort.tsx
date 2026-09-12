"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogNav } from "./hooks/useCatalogNav";

export default function CatalogMobileSort() {
  const { updateFilter, searchParams } = useCatalogNav();
  const currentSort = searchParams.get("sort") || "recientes";

  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 z-10 pointer-events-none">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
      </div>

      <Select
        value={currentSort}
        onValueChange={(val) => updateFilter("sort", val)}
      >
        <SelectTrigger className="pl-8">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>

        <SelectContent align="end">
          <SelectItem value="relevancia">Relevancia</SelectItem>
          <SelectItem value="recientes">Más Recientes</SelectItem>
          <SelectItem value="discount">Mayor Descuento</SelectItem>
          <SelectItem value="price-asc">Menor Precio</SelectItem>
          <SelectItem value="price-desc">Mayor Precio</SelectItem>
          <SelectItem value="name-asc">Nombre: A - Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}