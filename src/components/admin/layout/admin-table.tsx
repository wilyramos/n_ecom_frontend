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
      <table className={cn("w-full text-left text-[11px] border-collapse", className)}>
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-zinc-50/90 border-b border-zinc-200/80 text-zinc-500 font-medium tracking-tight">
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
        "border-b border-zinc-100 last:border-none transition-colors font-medium text-zinc-700 relative",
        selected ? "bg-zinc-50/90" : "hover:bg-zinc-50/60",
        isDragging && "opacity-50 bg-zinc-100 z-10 shadow-sm",
        className
      )}
    >
      {isDraggable && (
        <td className="p-1 w-6 text-center align-middle">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-0.5 text-zinc-400 hover:text-zinc-700 cursor-grab active:cursor-grabbing rounded hover:bg-zinc-100 transition-colors"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-3 h-3" />
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
      className={cn("px-2 py-1.5 whitespace-nowrap text-zinc-500 font-semibold text-[11px] uppercase tracking-wider", alignClass)}
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
        "px-2 py-1 align-middle whitespace-nowrap text-[11px] leading-tight",
        alignClass,
        bold && "font-semibold text-zinc-900",
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
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-zinc-900">{title}</p>
          <p className="text-[10px] text-zinc-500 max-w-sm mx-auto">{description}</p>
        </div>
      </td>
    </tr>
  );
}