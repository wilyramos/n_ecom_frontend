// File: frontend/src/components/admin/layout/admin-table.tsx
"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface AdminTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function AdminTable({ children, className, ...props }: AdminTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table
        className={cn(
          "w-full text-left text-xs sm:text-[13px] border-collapse",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface AdminTableHeadProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function AdminTableHead({
  children,
  className,
  ...props
}: AdminTableHeadProps) {
  return (
    <thead
      className={cn(
        "bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wide",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

interface AdminTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string;
  children: React.ReactNode;
  selected?: boolean;
  isDraggable?: boolean;
}

export function AdminTableRow({
  id,
  children,
  selected = false,
  isDraggable = false,
  className,
  style: userStyle,
  ...props
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
    ...userStyle,
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
      {...props}
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

interface AdminTableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

export function AdminTableHeaderCell({
  children,
  align = "left",
  width,
  className,
  style,
  ...props
}: AdminTableHeaderCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <th
      style={{ width, ...style }}
      className={cn(
        "px-3 py-2.5 whitespace-nowrap text-slate-500 font-semibold text-[11px] sm:text-xs uppercase tracking-wider",
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

interface AdminTableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  bold?: boolean;
}

export function AdminTableCell({
  children,
  align = "left",
  bold = false,
  className,
  ...props
}: AdminTableCellProps) {
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
      {...props}
    >
      {children}
    </td>
  );
}

interface AdminTableEmptyProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  title?: string;
  description?: string;
  colSpan?: number;
}

export function AdminTableEmpty({
  title = "No se encontraron resultados",
  description = "Intenta cambiar los términos de búsqueda o los filtros aplicados.",
  colSpan = 10,
  className,
  ...props
}: AdminTableEmptyProps) {
  return (
    <tr className={cn(className)} {...props}>
      <td colSpan={colSpan} className="py-8 text-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {description}
          </p>
        </div>
      </td>
    </tr>
  );
}