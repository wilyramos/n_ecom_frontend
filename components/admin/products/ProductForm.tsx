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

// Types
import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Custom Form Components
import ClientCategoryAttributes from "./ClientCategoryAttributes";
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import BrandCombobox from "./BrandCombobox";
import ProductVariantsForm from "./ProductVariantsForm";
import MediaLibraryDialog from "./MediaLibraryDialog";
import ComplementaryProductsSection from "./ComplementaryProductsSection";
import SEOProduct from "./SEOproduct";
import TagsInput from "./TagsInput";
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

    // Sensores DnD configurados con tolerancia para no interferir con clicks simples
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-5">
                {/* 1. Título */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardContent className="p-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="nombre" className="text-xs font-semibold text-slate-700">
                                Título <span className="text-rose-600">*</span>
                            </Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                defaultValue={product?.nombre}
                                placeholder="Camiseta de manga corta, Zapatos..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Archivos Multimedia (Con Drag & Drop) */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                Archivos multimedia
                            </CardTitle>
                            <MediaLibraryDialog
                                selectedImages={masterImages}
                                globalImagesPool={masterImages}
                                onConfirmSelection={setMasterImages}
                                onUploadSuccess={handleAddImagesToPool}
                                triggerLabel="Agregar"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                        {masterImages.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/60 text-center space-y-2">
                                <ImageIcon className="w-7 h-7 mx-auto text-slate-400" />
                                <p className="text-xs text-slate-600 font-medium">
                                    Agrega imágenes, videos o modelos 3D
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Acepta archivos JPG, PNG, WEBP y AVIF
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
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50/40">
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
                    </CardContent>
                </Card>

                {/* 3. Precios */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Precios
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="precio" className="text-xs font-semibold text-slate-700">
                                    Precio <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="precio"
                                    type="number"
                                    name="precio"
                                    defaultValue={product?.precio}
                                    step="0.01"
                                    min={0}
                                    placeholder="S/ 0.00"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="precioComparativo" className="text-xs font-semibold text-slate-700">
                                    Precio de comparación
                                </Label>
                                <Input
                                    id="precioComparativo"
                                    type="number"
                                    name="precioComparativo"
                                    defaultValue={product?.precioComparativo}
                                    step="0.01"
                                    min={0}
                                    placeholder="S/ 0.00"
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                            <div className="max-w-xs space-y-1.5">
                                <Label htmlFor="costo" className="text-xs font-semibold text-slate-700">
                                    Costo por artículo
                                </Label>
                                <Input
                                    id="costo"
                                    type="number"
                                    name="costo"
                                    defaultValue={product?.costo}
                                    step="0.01"
                                    min={0}
                                    placeholder="S/ 0.00"
                                />
                                <p className="text-[11px] text-slate-400">Los clientes no verán este valor.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Inventario */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Inventario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="sku" className="text-xs font-semibold text-slate-700">
                                    SKU (código de artículo)
                                </Label>
                                <Input
                                    id="sku"
                                    name="sku"
                                    defaultValue={product?.sku}
                                    placeholder="PROD-001"
                                    className="font-mono uppercase"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="barcode" className="text-xs font-semibold text-slate-700">
                                    Código de barras (ISBN, UPC, GTIN)
                                </Label>
                                <Input
                                    id="barcode"
                                    name="barcode"
                                    defaultValue={product?.barcode}
                                    placeholder="775..."
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="stock" className="text-xs font-semibold text-slate-700">
                                    Cantidad disponible
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    defaultValue={product?.stock ?? 0}
                                    min={0}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="diasEnvio" className="text-xs font-semibold text-slate-700">
                                    Días de preparación / despacho
                                </Label>
                                <Input
                                    id="diasEnvio"
                                    type="number"
                                    name="diasEnvio"
                                    defaultValue={product?.diasEnvio ?? 1}
                                    min={1}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Variantes */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Variantes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <ProductVariantsForm
                            product={product}
                            categoryAttributes={dynamicCategoryAttributes}
                            globalImagesPool={masterImages}
                            onUploadToPool={handleAddImagesToPool}
                        />
                    </CardContent>
                </Card>

                {/* 6. Especificaciones Técnicas */}
                <SpecificationsSection initial={product?.especificaciones} />

                {/* 7. Productos Complementarios */}
                <ComplementaryProductsSection initialItems={product?.complementarios || []} />

                {/* 8. Descripción Detallada */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Descripción
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                    </CardContent>
                </Card>

                {/* 9. Publicación en motores de búsqueda (SEO) */}
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Publicación en motores de búsqueda
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <SEOProduct product={product} />
                    </CardContent>
                </Card>
            </div>

            {/* COLUMNA LATERAL */}
            <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Estado
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <ProductSwitches product={product} />
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-xs">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                            Organización de productos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-4">
                        <ClientCategoryAttributes
                            categorias={categorias}
                            initialCategoryId={product?.categoria?._id}
                            currentAttributes={product?.atributos}
                            onCategoryChange={setSelectedCategoryId}
                        />

                        <div className="space-y-1.5">
                            <Label htmlFor="brand" className="text-xs font-semibold text-slate-700">
                                Proveedor / Marca <span className="text-rose-600">*</span>
                            </Label>
                            <BrandCombobox
                                brands={brands}
                                value={selectedBrandId}
                                onChange={(val) => setSelectedBrandId(val)}
                            />
                            <input type="hidden" name="brand" value={selectedBrandId || ""} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="line" className="text-xs font-semibold text-slate-700">
                                Línea / Familia
                            </Label>
                            <NativeSelect
                                id="line"
                                name="line"
                                key={selectedBrandId}
                                defaultValue={initialLineId || ""}
                                disabled={!selectedBrandId || filteredLines.length === 0}
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

                        <div className="pt-2 border-t border-slate-100">
                            <TagsInput initial={product?.tags || []} />
                        </div>
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
}