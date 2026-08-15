//File: frontend/src/components/admin/layout/admin-table-bulk-actions.tsx

"use client";

import { Trash2, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTableBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onStatusChange?: (newStatus: string) => void;
  onDelete?: () => void;
  statusOptions?: { label: string; value: string }[];
  totalCount?: number;
}

export function AdminTableBulkActions({
  selectedCount,
  onClearSelection,
  onStatusChange,
  onDelete,
  statusOptions = [
    { label: "Marcar como En Proceso", value: "processing" },
    { label: "Marcar como Enviado", value: "shipped" },
    { label: "Marcar como Entregado", value: "delivered" },
    { label: "Marcar como Cancelado", value: "canceled" },
  ],
  totalCount,
}: AdminTableBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "w-full bg-zinc-900 text-white px-4 py-2.5 rounded-t-lg border-b border-zinc-800",
        "flex flex-wrap items-center justify-between gap-3 text-xs transition-all animate-in fade-in duration-150"
      )}
    >
      {/* SECCIÓN IZQUIERDA: CONTADOR & DESELECCIONAR */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
          title="Deseleccionar todos"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded font-semibold text-[11px] border border-zinc-700">
            {selectedCount}
          </span>
          <span className="text-zinc-200">
            {selectedCount === 1 ? "seleccionado" : "seleccionados"}
          </span>
          {totalCount && (
            <span className="text-zinc-400 text-[11px] hidden sm:inline">
              de {totalCount}
            </span>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: ACCIONES MASIVAS */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cambiar Estado Masivo */}
        {onStatusChange && (
          <div className="relative flex items-center">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onStatusChange(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="appearance-none h-8 pl-3 pr-8 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-100 rounded-md outline-none cursor-pointer transition-colors"
            >
              <option value="" disabled>
                Cambiar estado...
              </option>
              {statusOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-zinc-900 text-zinc-100 py-1"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>
        )}

        {/* Botón Eliminar */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="h-8 px-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar</span>
          </button>
        )}
      </div>
    </div>
  );
}