// File: frontend/components/admin/category/CategoryForm.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import type { CategoryResponse } from "@/src/schemas";
import AttributeFields from "./AttributeFields";
import CategorySwitches from "./CategorySwitches";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";
import {
    AdminFormGroup,
    AdminInput,
    AdminSelect,
} from "@/src/components/admin/layout/admin-form-group";
import { AdminSectionDivider } from "@/src/components/admin/layout/admin-section-divider";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

type Props = {
  category?: CategoryResponse;
  categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(
    category?.image || ""
  );
  const [imagesPool, setImagesPool] = useState<string[]>(
    category?.image ? [category.image] : []
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

  const handleConfirmSelection = (images: string[]) => {
    setSelectedImage(images[0] || "");
  };

  const handleUploadSuccess = (newImages: string[]) => {
    setImagesPool((prev) => Array.from(new Set([...newImages, ...prev])));
    if (newImages.length > 0) {
      setSelectedImage(newImages[0]);
    }
  };

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
        {/* Selector de Imagen */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-700 block">
            Imagen de portada
          </span>

          <input type="hidden" name="image" value={selectedImage} />

          {selectedImage ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
                <Image
                  src={selectedImage}
                  alt="Categoría"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-medium text-slate-800 truncate">
                  {selectedImage.split("/").pop()}
                </p>
                <div className="flex items-center gap-2">
                  <MediaLibraryDialog
                    selectedImages={selectedImage ? [selectedImage] : []}
                    globalImagesPool={imagesPool}
                    onConfirmSelection={handleConfirmSelection}
                    onUploadSuccess={handleUploadSuccess}
                    allowMultiple={false}
                    triggerLabel="Cambiar"
                    triggerVariant="outline"
                    size="sm"
                  />
                  <AdminButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage("")}
                    className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 text-xs"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Quitar
                  </AdminButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">Sin imagen</p>
                  <p className="text-[11px] text-slate-400">JPG, PNG o WebP (mín. 400x400)</p>
                </div>
              </div>

              <MediaLibraryDialog
                selectedImages={[]}
                globalImagesPool={imagesPool}
                onConfirmSelection={handleConfirmSelection}
                onUploadSuccess={handleUploadSuccess}
                allowMultiple={false}
                triggerLabel="Examinar"
                triggerVariant="outline"
                size="sm"
              />
            </div>
          )}
        </div>

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