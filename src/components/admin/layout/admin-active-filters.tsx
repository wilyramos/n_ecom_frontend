//File: frontend/src/components/admin/layout/admin-active-filters.tsx

import React from "react";
import { X } from "lucide-react";

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface AdminActiveFiltersProps {
  items: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function AdminActiveFilters({
  items,
  onRemove,
  onClearAll,
}: AdminActiveFiltersProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        Filtros activos:
      </span>
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
        >
          <span className="text-slate-400 font-normal">{item.label}:</span>
          {item.value}
          <button
            onClick={() => onRemove(item.id)}
            className="p-0.5 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-3 h-3 text-slate-500" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline ml-2"
      >
        Limpiar todo
      </button>
    </div>
  );
}