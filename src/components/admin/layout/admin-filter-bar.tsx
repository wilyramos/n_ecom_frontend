//File: frontend/src/components/admin/layout/admin-filter-bar.tsx

"use client";

import React from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminButton } from "./admin-button";

interface AdminFilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Buscador
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Filtros rápidos
  filters?: React.ReactNode;

  // Drawer de filtros avanzados
  onToggleAdvanced?: () => void;
  activeCount?: number;

  // Acciones secundarias opcionales
  onImport?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  customActions?: React.ReactNode;

  // Reset
  onReset?: () => void;
}

export function AdminFilterBar({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  filters,
  onToggleAdvanced,
  activeCount = 0,
  onImport,
  onExport,
  onRefresh,
  customActions,
  onReset,
  className,
  ...props
}: AdminFilterBarProps) {
  const hasSecondaryActions = Boolean(onImport || onExport || onRefresh || customActions);

  return (
    <div
      className={cn(
        "flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 p-1.5 bg-white rounded-xl border border-slate-200 transition-colors shadow-xs",
        className
      )}
      {...props}
    >
      {/* 1. Buscador Principal */}
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-[180px] sm:max-w-xs md:max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all font-medium"
          />
        </div>
      )}

      {/* 2. Filtros Rápidos, Disparadores y Acciones */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        {/* Selects rápidos personalizados */}
        {filters}

        {/* Botón Disparador del Drawer de Filtros */}
        {onToggleAdvanced && (
          <button
            type="button"
            onClick={onToggleAdvanced}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            title="Filtros avanzados"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Filtros</span>
            {activeCount > 0 && (
              <span className="bg-slate-900 text-white text-[10px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-semibold">
                {activeCount}
              </span>
            )}
          </button>
        )}

        {/* Separador vertical si existen acciones secundarias */}
        {hasSecondaryActions && (
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
        )}

        {/* Refrescar Datos */}
        {onRefresh && (
          <AdminButton
            type="button"
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Recargar datos"
            className="h-7 w-7 text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </AdminButton>
        )}

        {/* Importar */}
        {onImport && (
          <AdminButton
            type="button"
            variant="outline"
            size="icon"
            onClick={onImport}
            title="Importar registros"
            className="h-7 w-7 text-slate-600 hover:text-slate-900"
          >
            <Upload className="w-3.5 h-3.5" />
          </AdminButton>
        )}

        {/* Exportar */}
        {onExport && (
          <AdminButton
            type="button"
            variant="outline"
            size="icon"
            onClick={onExport}
            title="Exportar archivo CSV / Excel"
            className="h-7 w-7 text-slate-600 hover:text-slate-900"
          >
            <Download className="w-3.5 h-3.5" />
          </AdminButton>
        )}

        {/* Componentes o acciones adicionales pasados por prop */}
        {customActions}

        {/* Limpiar Filtros */}
        {activeCount > 0 && onReset && (
          <AdminButton
            type="button"
            variant="ghost"
            size="icon"
            onClick={onReset}
            title="Limpiar todos los filtros"
            className="h-7 w-7 text-slate-400 hover:text-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </AdminButton>
        )}
      </div>
    </div>
  );
}