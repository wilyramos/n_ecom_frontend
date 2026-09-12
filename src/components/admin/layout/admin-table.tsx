"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export function AdminTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className={cn("w-full text-left text-xs sm:text-[13px] border-collapse", className)}>
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wide">
      {children}
    </thead>
  );
}

interface AdminTableRowProps {
  id: string;
  children: React.ReactNode;
  selected?: boolean;
  isDraggable?: boolean;
  className?: string;
}

export function AdminTableRow({
  id,
  children,
  selected = false,
  isDraggable = false,
  className,
}: AdminTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-slate-100 last:border-none transition-colors font-normal text-slate-700 relative",
        selected ? "bg-slate-100/80" : "hover:bg-slate-50/60",
        isDragging && "opacity-60 bg-slate-100 z-10 shadow-md",
        className
      )}
    >
      {isDraggable && (
        <td className="px-2 py-1.5 w-8 text-center align-middle">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing rounded-md hover:bg-slate-200/50 transition-colors"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        </td>
      )}
      {children}
    </tr>
  );
}

export function AdminTableHeaderCell({
  children,
  align = "left",
  width,
}: {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <th
      style={{ width }}
      className={cn(
        "px-3 py-2.5 whitespace-nowrap text-slate-500 font-semibold text-[11px] sm:text-xs uppercase tracking-wider",
        alignClass
      )}
    >
      {children}
    </th>
  );
}

export function AdminTableCell({
  children,
  align = "left",
  bold = false,
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  bold?: boolean;
  className?: string;
}) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <td
      className={cn(
        "px-3 py-2.5 align-middle whitespace-nowrap leading-normal text-slate-800",
        alignClass,
        bold && "font-semibold text-slate-900",
        className
      )}
    >
      {children}
    </td>
  );
}

export function AdminTableEmpty({
  title = "No se encontraron resultados",
  description = "Intenta cambiar los términos de búsqueda o los filtros aplicados.",
  colSpan = 10,
}: {
  title?: string;
  description?: string;
  colSpan?: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-8 text-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
        </div>
      </td>
    </tr>
  );
}