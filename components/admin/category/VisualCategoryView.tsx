// File: frontend/components/admin/category/VisualCategoryView.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Pencil,
  Folder,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { CategoryListResponse, CategoryResponse } from "@/src/schemas";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import { AdminFilterBar } from "@/src/components/admin/layout/admin-filter-bar";
import { AdminStatsRow, type StatItem } from "@/src/components/admin/layout/admin-stats-row";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { AdminStatusBadge } from "@/src/components/admin/layout/admin-status-badge";
import {
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  AdminTableCell,
  AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";

type Props = {
  categories: CategoryListResponse;
};

export default function VisualCategoryView({ categories }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // 1. Agrupación por nodo padre
  const { rootCategories, groupedChildren, totalSubcategories } = useMemo(() => {
    const grouped: Record<string, CategoryResponse[]> = {};
    let subCount = 0;

    categories.forEach((cat) => {
      const parentId =
        cat.parent && typeof cat.parent !== "string"
          ? cat.parent._id
          : (cat.parent as string) || "root";

      if (parentId !== "root") subCount++;

      if (!grouped[parentId]) grouped[parentId] = [];
      grouped[parentId].push(cat);
    });

    return {
      rootCategories: grouped["root"] || [],
      groupedChildren: grouped,
      totalSubcategories: subCount,
    };
  }, [categories]);

  // 2. Filtro de búsqueda y estado sobre categorías raíz
  const filteredRoots = useMemo(() => {
    return rootCategories.filter((cat) => {
      const matchesSearch =
        cat.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (cat.descripcion && cat.descripcion.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && cat.isActive !== false) ||
        (statusFilter === "inactive" && cat.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [rootCategories, search, statusFilter]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = rootCategories.filter((c) => c.isActive !== false).length;

  const stats: StatItem[] = [
    {
      label: "Categorías Raíz",
      value: rootCategories.length,
      icon: FolderTree,
      iconColor: "neutral",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      label: "Activas",
      value: activeCount,
      icon: CheckCircle2,
      iconColor: "emerald",
      active: statusFilter === "active",
      onClick: () => setStatusFilter("active"),
    },
    {
      label: "Subcategorías",
      value: totalSubcategories,
      icon: Layers,
      iconColor: "blue",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Resumen Superior */}
      <AdminStatsRow stats={stats} />

      {/* Barra de Filtro Rápido */}
      <AdminFilterBar
        searchPlaceholder="Buscar categoría por nombre o descripción..."
        searchValue={search}
        onSearchChange={setSearch}
        onReset={() => {
          setSearch("");
          setStatusFilter("all");
        }}
      />

      {/* Contenedor Principal de Datos */}
      <AdminCardWrapper padding="none">
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell width="40px" />
              <AdminTableHeaderCell width="30%">Categoría</AdminTableHeaderCell>
              <AdminTableHeaderCell width="35%">Descripción</AdminTableHeaderCell>
              <AdminTableHeaderCell width="15%">Atributos</AdminTableHeaderCell>
              <AdminTableHeaderCell width="10%">Estado</AdminTableHeaderCell>
              <AdminTableHeaderCell width="10%" align="right">
                Acción
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>

          <tbody>
            {filteredRoots.length === 0 ? (
              <AdminTableEmpty
                title="No se encontraron categorías"
                description={
                  search
                    ? `No existen coincidencias para "${search}".`
                    : "No hay categorías registradas bajo este criterio."
                }
                colSpan={6}
              />
            ) : (
              filteredRoots.map((parent) => {
                const subcategories = groupedChildren[parent._id] || [];
                const hasSubs = subcategories.length > 0;
                const isExpanded = Boolean(expandedRows[parent._id]);

                return (
                  <React.Fragment key={parent._id}>
                    <AdminTableRow
                      id={parent._id}
                      className={isExpanded ? "bg-slate-50/80" : undefined}
                    >
                      {/* Control Desplegable */}
                      <AdminTableCell align="center" className="w-10 px-2">
                        {hasSubs ? (
                          <button
                            type="button"
                            onClick={() => toggleRow(parent._id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title={isExpanded ? "Ocultar ramas" : "Ver subcategorías"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="inline-block w-3.5 h-3.5 text-slate-200 text-center">
                            •
                          </span>
                        )}
                      </AdminTableCell>

                      {/* Nombre & Conteo */}
                      <AdminTableCell bold>
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{parent.nombre}</span>
                          {hasSubs && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {subcategories.length}
                            </span>
                          )}
                        </div>
                      </AdminTableCell>

                      {/* Descripción */}
                      <AdminTableCell className="max-w-[320px] truncate text-slate-500">
                        {parent.descripcion || "—"}
                      </AdminTableCell>

                      {/* Atributos */}
                      <AdminTableCell>
                        {parent.attributes && parent.attributes.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {parent.attributes.length} atributo(s)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </AdminTableCell>

                      {/* Estado */}
                      <AdminTableCell>
                        <AdminStatusBadge
                          status={parent.isActive === false ? "inactive" : "active"}
                        />
                      </AdminTableCell>

                      {/* Acciones */}
                      <AdminTableCell align="right">
                        <AdminButton
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-slate-900"
                        >
                          <Link
                            href={`/admin/products/category/${parent._id}`}
                            title="Editar categoría"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                        </AdminButton>
                      </AdminTableCell>
                    </AdminTableRow>

                    {/* Fila Anidada (Subcategorías condicionales) */}
                    {hasSubs && isExpanded && (
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <td colSpan={6} className="p-0">
                          <div className="py-2 pl-12 pr-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              Subcategorías de {parent.nombre}
                            </p>
                            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                              {subcategories.map((subcat) => (
                                <div
                                  key={subcat._id}
                                  className="flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50/80 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="font-semibold text-slate-800">
                                      {subcat.nombre}
                                    </span>
                                    {subcat.descripcion && (
                                      <span className="text-slate-400 truncate max-w-sm hidden sm:inline">
                                        — {subcat.descripcion}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {subcat.attributes && subcat.attributes.length > 0 && (
                                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                        {subcat.attributes.length} attrs
                                      </span>
                                    )}
                                    <AdminButton
                                      asChild
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-slate-400 hover:text-slate-700"
                                    >
                                      <Link
                                        href={`/admin/products/category/${subcat._id}`}
                                        title="Editar subcategoría"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </Link>
                                    </AdminButton>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </AdminTable>
      </AdminCardWrapper>
    </div>
  );
}