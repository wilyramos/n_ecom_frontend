// File: frontend/components/admin/advertisements/AdvertisementFiltersComponent.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { AD_LAYOUT_LABELS, AdLayout } from "@/src/schemas/advertisement.schema";
import { AdminSelect } from "@/src/components/admin/layout/admin-form-group";

interface AdvertisementFiltersComponentProps {
  filters: {
    layout?: AdLayout;
    isActive?: string;
  };
}

export default function AdvertisementFiltersComponent({
  filters,
}: AdvertisementFiltersComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`/admin/advertisements?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2.5 border-b border-zinc-200/80 bg-zinc-50/50">
      <AdminSelect
        value={filters.layout || ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          handleFilterChange("layout", e.target.value)
        }
        className="h-8 text-xs w-48 bg-white border-zinc-200 text-zinc-700 font-medium"
      >
        <option value="">Formato: Todos</option>
        {Object.entries(AD_LAYOUT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </AdminSelect>

      <AdminSelect
        value={filters.isActive || ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          handleFilterChange("isActive", e.target.value)
        }
        className="h-8 text-xs w-40 bg-white border-zinc-200 text-zinc-700 font-medium"
      >
        <option value="">Estado: Todos</option>
        <option value="true">Activos</option>
        <option value="false">Pausados</option>
      </AdminSelect>
    </div>
  );
}