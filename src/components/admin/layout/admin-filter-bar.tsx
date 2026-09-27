// File: frontend/components/admin/layout/admin-filter-bar.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  Upload,
  RefreshCw,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminButton } from './admin-button';

interface AdminFilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: React.ReactNode;
  onToggleAdvanced?: () => void;
  activeCount?: number;
  onImport?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  customActions?: React.ReactNode;
  onReset?: () => void;
}

export function AdminFilterBar({
  searchPlaceholder = 'Buscar...',
  searchValue = '',
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
  const [internalValue, setInternalValue] = useState(searchValue);
  const hasSecondaryActions = Boolean(onImport || onExport || onRefresh || customActions);

  useEffect(() => {
    setInternalValue(searchValue);
  }, [searchValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange?.(internalValue.trim());
    }
  };

  const handleClearSearch = () => {
    setInternalValue('');
    onSearchChange?.('');
  };

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 p-2 sm:p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs transition-colors',
        className
      )}
      {...props}
    >
      {/* 1. Buscador Principal */}
      {onSearchChange !== undefined && (
        <div className="relative w-full lg:max-w-xs xl:max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full h-8 bg-slate-50/70 border border-slate-200 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all font-medium"
          />
          {internalValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
              title="Limpiar término"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 2. Filtros y Botones de Acción */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-1.5 w-full lg:w-auto">
        {/* Contenedor scrolleable horizontalmente para selectores en pantallas reducidas */}
        {filters && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto flex-1 sm:flex-initial no-scrollbar">
            {filters}
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
          {onToggleAdvanced && (
            <button
              type="button"
              onClick={onToggleAdvanced}
              className="inline-flex items-center justify-center gap-1 h-7 px-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              title="Filtros avanzados"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Filtros</span>
              {activeCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] h-3.5 min-w-[14px] px-0.5 rounded-full flex items-center justify-center font-semibold">
                  {activeCount}
                </span>
              )}
            </button>
          )}

          {hasSecondaryActions && (
            <div className="hidden sm:block h-4 w-px bg-slate-200 mx-0.5" />
          )}

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

          {customActions}

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
    </div>
  );
}