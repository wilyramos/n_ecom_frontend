// src/components/admin/layout/admin-table-pagination.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { AdminButton } from "./admin-button";
import { AdminSelect } from "./admin-form-group";

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selectedCount?: number;
}

export function AdminTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  selectedCount = 0,
}: AdminTablePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-zinc-100 bg-white rounded-b-xl text-xs text-zinc-600">
      {/* Conteo de Selección e Ítems */}
      <div className="flex items-center gap-3">
        {selectedCount > 0 ? (
          <span className="font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md">
            {selectedCount} seleccionado(s)
          </span>
        ) : (
          <span>
            Mostrando <strong className="text-zinc-900">{startItem}-{endItem}</strong> de{" "}
            <strong className="text-zinc-900">{totalItems}</strong> resultados
          </span>
        )}
      </div>

      {/* Controles de Navegación y Páginas */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 hidden md:inline">Filas por página:</span>
          <AdminSelect
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7 py-0 px-2 text-[11px] w-16"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </AdminSelect>
        </div>

        <span className="font-medium text-zinc-700">
          Página {currentPage} de {Math.max(1, totalPages)}
        </span>

        <div className="flex items-center gap-1">
          <AdminButton
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            title="Primera página"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-zinc-600" />
          </AdminButton>
          <AdminButton
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Página anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-600" />
          </AdminButton>
          <AdminButton
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Página siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          </AdminButton>
          <AdminButton
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Última página"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-zinc-600" />
          </AdminButton>
        </div>
      </div>
    </div>
  );
}