"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ImageIcon, LayoutGrid, Info } from "lucide-react";

// Types
import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const initialBrandId = typeof product?.brand === 'object' ? product?.brand?._id : product?.brand;
    const initialLineId = typeof product?.line === 'object' ? product?.line?._id : product?.line;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
    const [masterImages, setMasterImages] = useState<string[]>(() => Array.from(new Set(product?.imagenes || [])));

    const handleAddImagesToPool = (newImages: string[]) => {
        setMasterImages(prev => Array.from(new Set([...prev, ...newImages])));
    };

    const filteredLines = lines.filter(line => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === 'object' ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-muted/20 min-h-screen">
            {/* =================== COLUMNA PRINCIPAL =================== */}
            <div className="lg:col-span-3 space-y-6">
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                            <Info className="w-4 h-4" /> Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="nombre" label="Nombre del Producto" required tooltip="El nombre del producto que se mostrará en la tienda" />
                            <Input id="nombre" name="nombre" defaultValue={product?.nombre} className="h-10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="brand" label="Marca" required tooltip="La marca a la que pertenece el producto" />
                                <BrandCombobox brands={brands} value={selectedBrandId} onChange={(val) => setSelectedBrandId(val)} />
                                <input type="hidden" name="brand" value={selectedBrandId || ""} />
                            </div>
                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="line" label="Línea / Familia" tooltip="La línea o familia a la que pertenece el producto" />
                                <Select key={selectedBrandId} name="line" defaultValue={initialLineId}>
                                    <SelectTrigger disabled={!selectedBrandId || filteredLines.length === 0}>
                                        <SelectValue placeholder={!selectedBrandId ? "Selecciona marca" : "Selecciona línea"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredLines.map((line) => (
                                            <SelectItem key={line._id} value={line._id}>{line.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <ClientCategoryAttributes
                            categorias={categorias}
                            initialCategoryId={product?.categoria?._id}
                            currentAttributes={product?.atributos}
                            onCategoryChange={setSelectedCategoryId}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-2 text-foreground">
                                <ImageIcon className="w-4 h-4" /> Galería Multimedia
                            </div>
                            <MediaLibraryDialog
                                selectedImages={masterImages}
                                globalImagesPool={masterImages}
                                onConfirmSelection={setMasterImages}
                                onUploadSuccess={handleAddImagesToPool}
                                triggerLabel="Gestionar"
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 p-4 border-2 border-dashed border-border rounded-lg">
                            {masterImages.map((img) => (
                                <div key={img} className="relative aspect-square border rounded bg-muted overflow-hidden group">
                                    <Image src={img} alt="Product" fill className="object-cover" unoptimized />
                                    <button type="button" onClick={() => setMasterImages(prev => prev.filter(i => i !== img))} className="absolute top-1 right-1 bg-destructive/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={12} />
                                    </button>
                                    <input type="hidden" name="imagenes[]" value={img} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-sm font-bold uppercase tracking-wider">Descripción Detallada</CardTitle></CardHeader>
                    <CardContent><ProductDescriptionEditor initialHTML={product?.descripcion || ""} /></CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1"><Label>Precio Venta</Label><Input type="number" name="precio" defaultValue={product?.precio} /></div>
                            <div className="space-y-1"><Label>Precio Regular</Label><Input type="number" name="precioComparativo" defaultValue={product?.precioComparativo} /></div>
                            <div className="space-y-1"><Label>Costo Unitario</Label><Input type="number" name="costo" defaultValue={product?.costo} /></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-6">
                            <div className="space-y-1"><Label>Stock</Label><Input type="number" name="stock" defaultValue={product?.stock} /></div>
                            <div className="space-y-1"><Label>SKU</Label><Input name="sku" defaultValue={product?.sku} /></div>
                            <div className="space-y-1"><Label>Código Barras</Label><Input name="barcode" defaultValue={product?.barcode} /></div>
                            <div className="space-y-1"><Label>Días despacho</Label><Input type="number" name="diasEnvio" defaultValue={product?.diasEnvio ?? 1} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><LayoutGrid className="w-4 h-4" /> Variantes</CardTitle></CardHeader>
                    <CardContent><ProductVariantsForm product={product} categoryAttributes={dynamicCategoryAttributes} globalImagesPool={masterImages} onUploadToPool={handleAddImagesToPool} /></CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <SpecificationsSection initial={product?.especificaciones} />
                    <ComplementaryProductsSection initialItems={product?.complementarios || []} />
                </div>
            </div>

            {/* =================== COLUMNA LATERAL =================== */}
            <aside className="space-y-6">
                <Card className="sticky top-6">
                    <CardContent className="pt-6 space-y-6">
                        <ProductSwitches product={product} />
                        <hr className="border-border" />
                        <TagsInput initial={product?.tags || []} />
                        {/* <ShippingDimensions product={product} /> */}
                        <SEOProduct product={product} />
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
}