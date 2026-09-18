// File: frontend/components/admin/products/ProductForm.tsx
"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";

import ClientCategoryAttributes from "./ClientCategoryAttributes";
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import BrandCombobox from "./BrandCombobox";
import ProductVariantsForm from "./ProductVariantsForm";
import MediaLibraryDialog from "./MediaLibraryDialog";
import ComplementaryProductsSection from "./ComplementaryProductsSection";
import SEOProduct from "./SEOproduct";
import SortableImageItem from "./SortableImageItem";

export default function ProductForm({
    product,
    categorias,
    brands,
    lines,
}: {
    product?: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
}) {
    const initialBrandId = typeof product?.brand === "object" ? product?.brand?._id : product?.brand;
    const initialLineId = typeof product?.line === "object" ? product?.line?._id : product?.line;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
    const [masterImages, setMasterImages] = useState<string[]>(() => Array.from(new Set(product?.imagenes || [])));

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setMasterImages((items) => {
                const oldIndex = items.indexOf(String(active.id));
                const newIndex = items.indexOf(String(over.id));
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleRemoveImage = (url: string) => {
        setMasterImages((prev) => prev.filter((i) => i !== url));
    };

    const handleAddImagesToPool = (newImages: string[]) => {
        setMasterImages((prev) => Array.from(new Set([...prev, ...newImages])));
    };

    const filteredLines = lines.filter((line) => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === "object" ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            <div className="lg:col-span-8 space-y-3">
                {/* Nombre / Título */}
                <AdminCardWrapper padding="default">
                    <div className="space-y-1.5">
                        <Label htmlFor="nombre" className="text-xs font-semibold text-zinc-700">
                            Nombre del Producto <span className="text-rose-600">*</span>
                        </Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            defaultValue={product?.nombre}
                            placeholder="Ej. iPhone 17 Pro Max..."
                            className="h-8 text-xs font-medium"
                        />
                    </div>
                </AdminCardWrapper>

                {/* Galería Multimedia */}
                <AdminCardWrapper padding="default">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                            Archivos Multimedia
                        </h3>
                        <MediaLibraryDialog
                            selectedImages={masterImages}
                            globalImagesPool={masterImages}
                            onConfirmSelection={setMasterImages}
                            onUploadSuccess={handleAddImagesToPool}
                            triggerLabel="Agregar"
                        />
                    </div>

                    {masterImages.length === 0 ? (
                        <div className="p-6 border border-dashed border-zinc-200 rounded-lg bg-zinc-50/50 text-center space-y-1.5">
                            <ImageIcon className="w-6 h-6 mx-auto text-zinc-400" />
                            <p className="text-xs text-zinc-600 font-medium">
                                Sin imágenes asociadas
                            </p>
                            <p className="text-[11px] text-zinc-400">
                                Formatos permitidos: JPG, PNG, WEBP y AVIF
                            </p>
                        </div>
                    ) : (
                        <DndContext
                            id="product-images-dnd"
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={masterImages} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2.5 border border-zinc-200/80 rounded-lg bg-zinc-50/40">
                                    {masterImages.map((img, idx) => (
                                        <SortableImageItem
                                            key={img}
                                            id={img}
                                            isFirst={idx === 0}
                                            onRemove={handleRemoveImage}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </AdminCardWrapper>

                {/* Precios */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        Precios
                    </h3>
                    <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="precio" className="text-xs font-semibold text-zinc-700">
                                    Precio de Venta <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="precio"
                                    type="number"
                                    name="precio"
                                    defaultValue={product?.precio}
                                    step="0.01"
                                    min={0}
                                    placeholder="S/ 0.00"
                                    className="h-8 text-xs font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="precioComparativo" className="text-xs font-semibold text-zinc-700">
                                    Precio Regular / Comparativo
                                </Label>
                                <Input
                                    id="precioComparativo"
                                    type="number"
                                    name="precioComparativo"
                                    defaultValue={product?.precioComparativo}
                                    step="0.01"
                                    min={0}
                                    placeholder="S/ 0.00"
                                    className="h-8 text-xs font-medium"
                                />
                            </div>
                        </div>

                        <div className="border-t border-zinc-100 pt-3">
                            <div className="max-w-xs space-y-1.5">
                                <Label htmlFor="costo" className="text-xs font-semibold text-zinc-700">
                                    Costo por Artículo
                                </Label>
                                <Input
                                    id="costo"
                                    type="number"
                                    name="costo"
                                    defaultValue={product?.costo}
                                    step="0.01"
                                    min={0}
                                    placeholder="S/ 0.00"
                                    className="h-8 text-xs font-medium"
                                />
                                <p className="text-[11px] text-zinc-400">Uso interno para cálculo de margen.</p>
                            </div>
                        </div>
                    </div>
                </AdminCardWrapper>

                {/* Inventario */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        Inventario y Logística
                    </h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="sku" className="text-xs font-semibold text-zinc-700">
                                    SKU
                                </Label>
                                <Input
                                    id="sku"
                                    name="sku"
                                    defaultValue={product?.sku}
                                    placeholder="PROD-001"
                                    className="h-8 text-xs uppercase"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="barcode" className="text-xs font-semibold text-zinc-700">
                                    Código de Barras
                                </Label>
                                <Input
                                    id="barcode"
                                    name="barcode"
                                    defaultValue={product?.barcode}
                                    placeholder="775..."
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-zinc-100 pt-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="stock" className="text-xs font-semibold text-zinc-700">
                                    Stock Disponible
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    defaultValue={product?.stock ?? 0}
                                    min={0}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="diasEnvio" className="text-xs font-semibold text-zinc-700">
                                    Días de Preparación
                                </Label>
                                <Input
                                    id="diasEnvio"
                                    type="number"
                                    name="diasEnvio"
                                    defaultValue={product?.diasEnvio ?? 1}
                                    min={1}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </AdminCardWrapper>

                {/* Variantes */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        Variantes
                    </h3>
                    <ProductVariantsForm
                        product={product}
                        categoryAttributes={dynamicCategoryAttributes}
                        globalImagesPool={masterImages}
                        onUploadToPool={handleAddImagesToPool}
                    />
                </AdminCardWrapper>

                {/* Especificaciones */}
                <AdminCardWrapper padding="default">
                    <SpecificationsSection initial={product?.especificaciones} />
                </AdminCardWrapper>

                {/* Complementarios */}
                <AdminCardWrapper padding="default">
                    <ComplementaryProductsSection initialItems={product?.complementarios || []} />
                </AdminCardWrapper>

                {/* Descripción */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        Descripción Detallada
                    </h3>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </AdminCardWrapper>

                {/* SEO */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        SEO y Metadatos
                    </h3>
                    <SEOProduct product={product} />
                </AdminCardWrapper>
            </div>

            {/* Columna Lateral */}
            <aside className="lg:col-span-4 space-y-3 lg:sticky lg:top-18">
                {/* Switches de Estado */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        Visibilidad
                    </h3>
                    <ProductSwitches product={product} />
                </AdminCardWrapper>

                {/* Clasificación / Organización */}
                <AdminCardWrapper padding="default">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                        Clasificación
                    </h3>
                    <div className="space-y-3">
                        <ClientCategoryAttributes
                            categorias={categorias}
                            initialCategoryId={product?.categoria?._id}
                            currentAttributes={product?.atributos}
                            onCategoryChange={setSelectedCategoryId}
                        />

                        <div className="space-y-1.5">
                            <Label htmlFor="brand" className="text-xs font-semibold text-zinc-700">
                                Marca <span className="text-rose-600">*</span>
                            </Label>
                            <BrandCombobox
                                brands={brands}
                                value={selectedBrandId}
                                onChange={(val) => setSelectedBrandId(val)}
                            />
                            <input type="hidden" name="brand" value={selectedBrandId || ""} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="line" className="text-xs font-semibold text-zinc-700">
                                Línea / Familia
                            </Label>
                            <NativeSelect
                                id="line"
                                name="line"
                                key={selectedBrandId}
                                defaultValue={initialLineId || ""}
                                disabled={!selectedBrandId || filteredLines.length === 0}
                                className="h-8 text-xs font-medium"
                            >
                                <option value="" disabled>
                                    {!selectedBrandId ? "Selecciona marca primero" : "Seleccionar línea..."}
                                </option>
                                {filteredLines.map((line) => (
                                    <option key={line._id} value={line._id}>
                                        {line.nombre}
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>
{/* 
                        <div className="pt-2 border-t border-zinc-100">
                            <TagsInput initial={product?.tags || []} />
                        </div> */}
                    </div>
                </AdminCardWrapper>
            </aside>
        </div>
    );
}