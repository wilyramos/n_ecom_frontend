// File: frontend/components/admin/products/ClientCategoryAttributes.tsx
"use client";

import { useState, useEffect } from "react";
import { Settings2, Tag } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas";

import { NativeSelect } from "@/components/ui/native-select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
    categorias: CategoryListResponse;
    initialCategoryId?: string;
    currentAttributes?: Record<string, string>;
    onCategoryChange?: (categoryId: string) => void;
};

export default function ClientCategoryAttributes({
    categorias,
    initialCategoryId,
    currentAttributes,
    onCategoryChange,
}: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || "");
    const [categoryDefinitions, setCategoryDefinitions] = useState<{ name: string; values: string[] }[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(currentAttributes || {});
    const [isOpen, setIsOpen] = useState(false);

    const handleCategorySelect = (id: string) => {
        setSelectedCategoryId(id);
        if (onCategoryChange) onCategoryChange(id);
    };

    useEffect(() => {
        const selected = categorias.find((cat) => cat._id === selectedCategoryId);
        if (!selected) {
            setCategoryDefinitions([]);
            return;
        }
        const validDefinitions = selected.attributes || [];
        setCategoryDefinitions(validDefinitions);

        setSelectedAttributes((prev) => {
            const merged = { ...prev };
            if (currentAttributes) {
                validDefinitions.forEach((def) => {
                    if (prev[def.name] === undefined && currentAttributes[def.name]) {
                        merged[def.name] = currentAttributes[def.name];
                    }
                });
            }
            return merged;
        });
    }, [selectedCategoryId, categorias, currentAttributes]);

    const handleAttributeChange = (name: string, value: string) => {
        setSelectedAttributes((prev) => {
            const updated = { ...prev };
            if (value === "_none") delete updated[name];
            else updated[name] = value;
            return updated;
        });
    };

    const selectedCategory = categorias.find((c) => c._id === selectedCategoryId);
    const activeEntries = Object.entries(selectedAttributes).filter(([key]) =>
        categoryDefinitions.some((def) => def.name === key)
    );

    return (
        <div className="space-y-4 p-4 border border-slate-200 bg-white rounded-xl shadow-xs">
            <div className="space-y-1.5">
                <Label htmlFor="categoria-select" className="text-xs font-semibold text-slate-700">
                    Categoría <span className="text-rose-600">*</span>
                </Label>

                <input type="hidden" name="categoria" value={selectedCategoryId} />
                <input type="hidden" name="atributos" value={JSON.stringify(Object.fromEntries(activeEntries))} />

                <NativeSelect
                    id="categoria-select"
                    value={selectedCategoryId}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                >
                    <option value="" disabled>
                        Seleccionar categoría...
                    </option>
                    {categorias.map((cat) => {
                        const nombreFormateado =
                            cat.parent && typeof cat.parent === "object" && "nombre" in cat.parent
                                ? `${(cat.parent as { nombre: string }).nombre} > ${cat.nombre}`
                                : cat.nombre;

                        return (
                            <option key={cat._id} value={cat._id}>
                                {nombreFormateado}
                            </option>
                        );
                    })}
                </NativeSelect>
            </div>

            {selectedCategoryId && categoryDefinitions.length > 0 && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Atributos Dinámicos</span>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                >
                                    <Settings2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                    <span>Configurar</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-semibold text-slate-900">
                                        Atributos de {selectedCategory?.nombre}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 gap-3 py-2">
                                    {categoryDefinitions.map((attr) => (
                                        <div key={attr.name} className="space-y-1">
                                            <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                                                {attr.name}
                                            </Label>
                                            <NativeSelect
                                                value={selectedAttributes[attr.name] || "_none"}
                                                onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                            >
                                                <option value="_none">Sin especificar</option>
                                                {attr.values.map((val) => (
                                                    <option key={val} value={val}>
                                                        {val}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs"
                                    >
                                        Guardar Atributos
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {activeEntries.length > 0 ? (
                            activeEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200"
                                >
                                    <Tag className="w-3 h-3 text-slate-400" />
                                    <span className="text-slate-500">{key}:</span>
                                    <span className="font-semibold text-slate-900">{value}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 py-1">No se han configurado atributos.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}