"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Tag,
  Percent,
  Warehouse,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminSearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors w-44 sm:w-64 border border-slate-200/60"
        type="button"
      >
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">Buscar en admin...</span>
        <kbd className="ml-auto bg-white px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-400 border border-slate-200 shadow-2xs hidden sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
          <Command className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center border-b border-slate-100 px-3">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <Command.Input
                placeholder="Escribe para navegar por el panel..."
                className="w-full py-3 text-xs outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
              <Command.Empty className="p-4 text-center text-xs text-slate-500">
                No se encontraron resultados.
              </Command.Empty>

              <Command.Group
                heading="Catálogo e Inventario"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1"
              >
                <Command.Item
                  onSelect={() => handleSelect("/admin/products/new")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Package className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Crear Nuevo Producto</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelect("/admin/categories")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <FolderTree className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Gestionar Categorías</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelect("/admin/brands")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Tag className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Marcas de Productos</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelect("/admin/inventory")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Warehouse className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Stock y Almacenes</span>
                </Command.Item>
              </Command.Group>

              <Command.Group
                heading="Ventas y Clientes"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1"
              >
                <Command.Item
                  onSelect={() => handleSelect("/admin/orders")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Ver Lista de Órdenes</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelect("/admin/customers")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Users className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Gestión de Clientes</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelect("/admin/promotions")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Percent className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Cupones y Promociones</span>
                </Command.Item>
              </Command.Group>

              <Command.Group
                heading="Sistema"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1"
              >
                <Command.Item
                  onSelect={() => handleSelect("/admin/settings")}
                  className="flex items-center gap-2 p-2 text-xs rounded-lg hover:bg-slate-100 aria-selected:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Settings className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Configuración General</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  );
}