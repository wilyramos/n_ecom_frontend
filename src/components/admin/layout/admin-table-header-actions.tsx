// src/components/admin/layout/admin-table-header-actions.tsx
"use client";

import React from "react";
import { Download, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { AdminButton } from "./admin-button";

interface AdminTableHeaderActionsProps {
  selectedCount?: number;
  onExport?: () => void;
  onImport?: () => void;
  onBulkDelete?: () => void;
  onBulkStatusChange?: () => void;
  customActions?: React.ReactNode;
}

export function AdminTableHeaderActions({
  selectedCount = 0,
  onExport,
  onImport,
  onBulkDelete,
  onBulkStatusChange,
  customActions,
}: AdminTableHeaderActionsProps) {
  const hasSelection = selectedCount > 0;

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-1 text-xs">
      {/* Lado Izquierdo: Acciones Masivas (Aparecen al seleccionar checkboxes) */}
      <div className="flex items-center gap-2">
        {hasSelection ? (
          <>
            <span className="text-xs font-semibold text-zinc-900 mr-1">
              {selectedCount} seleccionado(s)
            </span>
            {onBulkStatusChange && (
              <AdminButton
                variant="outline"
                size="sm"
                icon={CheckCircle2}
                onClick={onBulkStatusChange}
              >
                Cambiar Estado
              </AdminButton>
            )}
            {onBulkDelete && (
              <AdminButton
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={onBulkDelete}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Eliminar
              </AdminButton>
            )}
          </>
        ) : (
          customActions
        )}
      </div>

      {/* Lado Derecho: Exportar / Importar */}
      <div className="flex items-center gap-2">
        {onImport && (
          <AdminButton variant="outline" size="sm" icon={Upload} onClick={onImport}>
            Importar
          </AdminButton>
        )}
        {onExport && (
          <AdminButton variant="outline" size="sm" icon={Download} onClick={onExport}>
            Exportar
          </AdminButton>
        )}
      </div>
    </div>
  );
}