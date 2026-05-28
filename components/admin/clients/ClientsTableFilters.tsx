// File: frontend/components/admin/clients/ClientsTableFilters.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import { TableHead } from "@/components/ui/table";
import {Input} from "@/components/ui/input";

export default function ClientsTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [filters, setFilters] = useState({
        nombre: searchParams.get("nombre") || "",
        email: searchParams.get("email") || "",
        telefono: searchParams.get("telefono") || "",
        numeroDocumento: searchParams.get("numeroDocumento") || "",
        rol: searchParams.get("rol") || "",
    });

    const handleFilterChange = useDebouncedCallback(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    }, 400);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };

    const inputClasses = "pl-8 py-1.5 w-full text-base bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground";

    return (
        <tr>
            {[
                { name: "nombre", placeholder: "Nombre" },
                { name: "email", placeholder: "Email" },
                { name: "telefono", placeholder: "Teléfono" },
                { name: "numeroDocumento", placeholder: "Documento" },
                { name: "rol", placeholder: "Rol" },
            ].map((field) => (
                <TableHead key={field.name} className="px-2 py-2">
                    <div className="relative">
                        <Input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name as keyof typeof filters]}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                        <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </TableHead>
            ))}
        </tr>
    );
}