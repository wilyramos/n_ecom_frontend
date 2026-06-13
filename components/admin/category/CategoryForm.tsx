//File: frontend/components/admin/category/CategoryForm.tsx

"use client";

import * as React from "react";
import type { CategoryResponse } from "@/src/schemas";
import AttributeFields from "./AttributeFileds";
import { ImageUploadDialog } from "./ImageUploadDialog";
import CategorySwitches from "./CategorySwitches";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    category?: CategoryResponse;
    categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6 text-sm text-gray-700">
            {/* Nombre */}
            <div className="space-y-1">
                <Label htmlFor="name">Nombre de la categoría</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={category?.nombre}
                    placeholder="Ej. Electrónica"
                />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
                <Label htmlFor="description">Descripción</Label>
                <Input
                    id="description"
                    name="description"
                    defaultValue={category?.descripcion}
                    placeholder="Describe la categoría"
                    className="min-h-[100px]"
                />
            </div>

            {/* Categoría padre */}
            <div className="space-y-1 ">
                <Label htmlFor="parent">Categoría padre</Label>
                <Select
                    defaultValue={category?.parent && typeof category.parent === "object"
                        ? category.parent._id
                        : typeof category?.parent === "string"
                            ? category.parent
                            : "null"
                    }
                    name="parent"
                >
                    <SelectTrigger id="parent" className="min-w-xs">
                        <SelectValue placeholder="Sin categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="null">Sin categoría padre</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                                {cat.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {category?._id && (
                    <p className="text-xs text-muted-foreground mt-1">
                        No puedes seleccionar la misma categoría como padre.
                    </p>
                )}
            </div>

            {/* Atributos */}
            <AttributeFields defaultAttributes={category?.attributes} />

            {/* Imagen */}
            <div className="space-y-1">
                <Label>Imagen de la categoría</Label>
                <ImageUploadDialog image={category?.image} inputRef={imageInputRef} />
                <input
                    ref={imageInputRef}
                    type="hidden"
                    name="image"
                    defaultValue={category?.image || ""}
                />
            </div>
            <CategorySwitches isActive={category?.isActive} />
        </div>
    );
}
