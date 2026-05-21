"use client";

import { useState, useEffect } from "react";
import { Settings2, Tag } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas";

// UI Components (Shadcn/Radix)
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

    // Obtenemos solo los atributos que pertenecen a la categoría actual para mostrar y guardar
    const activeEntries = Object.entries(selectedAttributes).filter(([key]) =>
        categoryDefinitions.some(def => def.name === key)
    );

    const validAtributosJSON = JSON.stringify(Object.fromEntries(activeEntries));

    return (
        <div className="space-y-4 p-5 border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] rounded-xl">

            {/* --- SELECCIÓN DE CATEGORÍA --- */}
            {/* --- SELECCIÓN DE CATEGORÍA --- */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Categoría <span className="text-[var(--color-error)]">*</span>
                </label>

                <input type="hidden" name="categoria" value={selectedCategoryId} />
                <input type="hidden" name="atributos" value={validAtributosJSON} />

                <Select value={selectedCategoryId} onValueChange={handleCategorySelect}>
                    <SelectTrigger className="h-11 w-full bg-[var(--color-bg-primary)] border-[var(--color-border-strong)] text-[var(--color-text-primary)]">
                        <SelectValue placeholder="Seleccionar categoría..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                        {categorias.map((cat) => {
                            // Verificar si tiene un padre poblado para formatear el nombre expuesto
                            const nombreFormateado = cat.parent && typeof cat.parent === 'object' && 'nombre' in cat.parent
                                ? `${(cat.parent as { nombre: string }).nombre} > ${cat.nombre}`
                                : cat.nombre;

                            return (
                                <SelectItem
                                    key={cat._id}
                                    value={cat._id}
                                    className="focus:bg-[var(--color-surface-hover)] focus:text-[var(--color-text-primary)] cursor-pointer"
                                >
                                    {nombreFormateado}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* --- VISTA PREVIA Y ACCIÓN (Solo si hay categoría) --- */}
            {selectedCategoryId && categoryDefinitions.length > 0 && (
                <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-3">

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                            Atributos Seleccionados
                        </span>

                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors cursor-pointer"
                                >
                                    <Settings2 className="w-3.5 h-3.5" />
                                    Configurar
                                </button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-xl bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                                <DialogHeader>
                                    <DialogTitle className="text-lg text-[var(--color-text-primary)]">
                                        Atributos de <span className="text-[var(--color-action-primary)]">{selectedCategory?.nombre}</span>
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6">
                                    {categoryDefinitions.map((attr) => (
                                        <div key={attr.name} className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">
                                                {attr.name}
                                            </label>
                                            <Select
                                                value={selectedAttributes[attr.name] || "_none"}
                                                onValueChange={(val) => handleAttributeChange(attr.name, val)}
                                            >
                                                <SelectTrigger className="h-10 bg-[var(--color-bg-secondary)] border-[var(--color-border-subtle)]">
                                                    <SelectValue placeholder="No definido" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="_none" className="italic text-[var(--color-text-tertiary)]">
                                                        Sin especificar
                                                    </SelectItem>
                                                    {attr.values.map((val) => (
                                                        <SelectItem key={val} value={val}>{val}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>

                                <DialogFooter>
                                    <Button
                                        className="w-full bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-text-inverse)]"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Guardar Atributos
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* --- RESUMEN VISIBLE --- */}
                    <div className="flex flex-wrap gap-2">
                        {activeEntries.length > 0 ? (
                            activeEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-action-primary-light)] border border-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] text-xs font-medium shadow-sm"
                                >
                                    <Tag className="w-3 h-3 opacity-60" />
                                    <span className="opacity-70">{key}:</span>
                                    <span className="font-bold">{value}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs italic text-[var(--color-text-tertiary)] py-2">
                                No se han configurado atributos específicos todavía.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}