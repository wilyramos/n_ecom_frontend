// File: frontend/components/admin/category/CategoryForm.tsx
"use client";

import { useState, useMemo } from "react";
import type { CategoryResponse } from "@/src/schemas";
import AttributeFields from "./AttributeFields";
import CategorySwitches from "./CategorySwitches";
import { MediaPickerField } from "@/src/modules/media";
import {
    AdminFormGroup,
    AdminInput,
    AdminSelect,
} from "@/src/components/admin/layout/admin-form-group";
import { AdminSectionDivider } from "@/src/components/admin/layout/admin-section-divider";

type Props = {
  category?: CategoryResponse;
  categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(
    category?.image || ""
  );

  const availableParents = useMemo(() => {
    if (!category?._id) return categories;
    return categories.filter((cat) => cat._id !== category._id);
  }, [categories, category?._id]);

  const defaultParentValue =
    category?.parent && typeof category.parent === "object"
      ? category.parent._id
      : typeof category?.parent === "string"
        ? category.parent
        : "";

  return (
    <div className="space-y-6">
      {/* 1. Datos Principales y Jerarquía */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Nombre de la categoría *">
            <AdminInput
              id="name"
              name="name"
              required
              defaultValue={category?.nombre}
              placeholder="Ej. Computadoras & Laptops"
              autoComplete="off"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Categoría Padre (Jerarquía)">
            <AdminSelect
              name="parent"
              defaultValue={defaultParentValue}
              className="text-slate-700"
            >
              <option value="">Ninguna (Categoría Principal / Raíz)</option>
              {availableParents.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </AdminSelect>
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Descripción">
          <textarea
            id="description"
            name="description"
            defaultValue={category?.descripcion}
            placeholder="Describe brevemente los productos o el catálogo asociado..."
            rows={2}
            className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-slate-400 transition-colors resize-y placeholder:text-slate-400"
          />
        </AdminFormGroup>
      </div>

      {/* 2. Multimedia y Visibilidad */}
      <AdminSectionDivider label="Multimedia y Publicación" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Selector de Imagen (módulo de medios, selección simple) */}
        <MediaPickerField
          name="image"
          kind="image"
          folder="categories"
          max={1}
          value={selectedImage ? [selectedImage] : []}
          onChange={(urls) => setSelectedImage(urls[0] ?? "")}
          label="Imagen de portada"
          helpText="JPG, PNG, WebP o AVIF"
          emptyText="Sin imagen de portada"
          emitEmpty
        />

        {/* Interruptores de Estado */}
        <div className="space-y-2 md:border-l md:border-slate-100 md:pl-6">
          <span className="text-xs font-medium text-slate-700 block">
            Estado y Disponibilidad
          </span>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <CategorySwitches isActive={category?.isActive} />
          </div>
        </div>
      </div>

      {/* 3. Atributos en Acordeón */}
      <AdminSectionDivider label="Atributos y Variantes de Producto" />

      <AttributeFields defaultAttributes={category?.attributes} />
    </div>
  );
}