// src/components/admin/layout/admin-filter-drawer.tsx
"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import { AdminButton } from "./admin-button";

interface AdminFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onApply?: () => void;
  onReset?: () => void;
  children: React.ReactNode;
}

export function AdminFilterDrawer({
  isOpen,
  onClose,
  title = "Filtros Avanzados",
  description = "Aplica criterios de búsqueda específicos para filtrar la información.",
  onApply,
  onReset,
  children,
}: AdminFilterDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-zinc-200/80 shadow-xl"
      >
        {/* Cabecera del Drawer */}
        <SheetHeader className="p-5 border-b border-zinc-100 text-left space-y-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
            <SheetTitle className="text-sm font-semibold text-zinc-900">
              {title}
            </SheetTitle>
          </div>
          {description && (
            <SheetDescription className="text-xs text-zinc-500">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Cuerpo / Formulario de Filtros */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>

        {/* Pie de Página con Acciones Unificadas */}
        <SheetFooter className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex-row justify-end gap-2 sm:space-x-0">
          {onReset && (
            <AdminButton
              type="button"
              variant="outline"
              size="default"
              icon={RotateCcw}
              onClick={onReset}
              className="flex-1 sm:flex-initial"
            >
              Limpiar
            </AdminButton>
          )}
          {onApply && (
            <AdminButton
              type="button"
              variant="primary"
              size="default"
              icon={Check}
              onClick={() => {
                onApply();
                onClose();
              }}
              className="flex-1 sm:flex-initial"
            >
              Aplicar Filtros
            </AdminButton>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}