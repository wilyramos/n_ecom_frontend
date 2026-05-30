// File: frontend/components/admin/users/UserFilters.tsx

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TipoDocumentoSchema } from "@/src/schemas/user.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  filters: {
    nombre?: string;
    email?: string;
    telefono?: string;
    numeroDocumento?: string;
    tipoDocumento?: string;
  };
}

export default function UserFilters({ filters }: UserFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [nombre, setNombre] = useState(filters.nombre || "");
  const [email, setEmail] = useState(filters.email || "");
  const [telefono, setTelefono] = useState(filters.telefono || "");
  const [numeroDocumento, setNumeroDocumento] = useState(filters.numeroDocumento || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", "1");

      if (nombre) params.set("nombre", nombre); else params.delete("nombre");
      if (email) params.set("email", email); else params.delete("email");
      if (telefono) params.set("telefono", telefono); else params.delete("telefono");
      if (numeroDocumento) params.set("numeroDocumento", numeroDocumento); else params.delete("numeroDocumento");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [nombre, email, telefono, numeroDocumento, pathname, router, searchParams]);

  const handleSelectChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value && value !== "ALL") {
      params.set("tipoDocumento", value);
    } else {
      params.delete("tipoDocumento");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setNombre("");
    setEmail("");
    setTelefono("");
    setNumeroDocumento("");

    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters =
    !!nombre || !!email || !!telefono || !!numeroDocumento || !!searchParams.get("tipoDocumento");

  return (
    <div className="p-4 bg-card ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        <div className="space-y-1.5">
          <Label htmlFor="filter-nombre">Nombre</Label>
          <Input
            id="filter-nombre"
            placeholder="Buscar por nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-email">Correo</Label>
          <Input
            id="filter-email"
            type="email"
            placeholder="Buscar por correo..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-telefono">Teléfono</Label>
          <Input
            id="filter-telefono"
            placeholder="Buscar por teléfono..."
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-tipo-doc">Tipo Doc.</Label>
          <Select
            value={searchParams.get("tipoDocumento") || "ALL"}
            onValueChange={handleSelectChange}
            disabled={isPending}
          >
            <SelectTrigger id="filter-tipo-doc">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los tipos</SelectItem>
              {TipoDocumentoSchema.options.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-num-doc">N° Documento</Label>
          <Input
            id="filter-num-doc"
            placeholder="Número de documento..."
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            disabled={isPending}
          />
        </div>

      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-background-secondary rounded-[var(--radius-sm)]"
          >
            {isPending ? "Actualizando..." : "Limpiar Filtros"}
          </Button>
        </div>
      )}
    </div>
  );
}