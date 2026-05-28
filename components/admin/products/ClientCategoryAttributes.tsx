"use client";

import { useState, useEffect } from "react";
import { Settings2, Tag } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas";

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
        categoryDefinitions.some(def => def.name === key)
    );

    return (
        <div className="space-y-4 p-5 border border-border bg-background rounded-xl">
            <div className="space-y-2">
                <Label className="text-foreground">
                    Categoría <span className="text-destructive">*</span>
                </Label>

                <input type="hidden" name="categoria" value={selectedCategoryId} />
                <input type="hidden" name="atributos" value={JSON.stringify(Object.fromEntries(activeEntries))} />

                <Select value={selectedCategoryId} onValueChange={handleCategorySelect}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar categoría..." />
                    </SelectTrigger>
                    <SelectContent>
                        {categorias.map((cat) => {
                            const nombreFormateado = cat.parent && typeof cat.parent === 'object' && 'nombre' in cat.parent
                                ? `${(cat.parent as { nombre: string }).nombre} > ${cat.nombre}`
                                : cat.nombre;

                            return (
                                <SelectItem key={cat._id} value={cat._id}>
                                    {nombreFormateado}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {selectedCategoryId && categoryDefinitions.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Atributos Seleccionados</span>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/90">
                                    <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Configurar
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Atributos de {selectedCategory?.nombre}</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
                                    {categoryDefinitions.map((attr) => (
                                        <div key={attr.name} className="space-y-1.5">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">{attr.name}</Label>
                                            <Select value={selectedAttributes[attr.name] || "_none"} onValueChange={(val) => handleAttributeChange(attr.name, val)}>
                                                <SelectTrigger><SelectValue placeholder="No definido" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="_none" className="italic text-muted-foreground">Sin especificar</SelectItem>
                                                    {attr.values.map((val) => <SelectItem key={val} value={val}>{val}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setIsOpen(false)}>Guardar Atributos</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {activeEntries.length > 0 ? (
                            activeEntries.map(([key, value]) => (
                                <div key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                                    <Tag className="w-3 h-3 opacity-60" />
                                    <span className="opacity-70">{key}:</span>
                                    <span className="font-bold">{value}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs italic text-muted-foreground py-2">No se han configurado atributos.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}