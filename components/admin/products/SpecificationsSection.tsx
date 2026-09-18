// File: frontend/components/admin/products/SpecificationsSection.tsx
"use client";

import { useState } from "react";
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, ListTree } from "lucide-react";

type SpecItem = { key: string; value: string };

type Props = {
    initial?: SpecItem[];
};

export default function SpecificationsSection({ initial = [] }: Props) {
    const [items, setItems] = useState<SpecItem[]>(
        initial.length ? initial : [{ key: "", value: "" }]
    );

    const jsonString = JSON.stringify(items.filter((item) => item.key.trim() !== ""));

    const updateItem = (idx: number, field: "key" | "value", value: string) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setItems(newItems);
    };

    const addRow = (atIndex?: number) => {
        const newItems = [...items];
        const newRow = { key: "", value: "" };
        if (atIndex !== undefined) newItems.splice(atIndex + 1, 0, newRow);
        else newItems.push(newRow);
        setItems(newItems);
    };

    const removeRow = (idx: number) => {
        if (items.length === 1) {
            setItems([{ key: "", value: "" }]);
            return;
        }
        setItems(items.filter((_, i) => i !== idx));
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        const lines = pasteData.split("\n").filter((line) => line.trim() !== "");

        const newItems: SpecItem[] = lines
            .map((line) => {
                let key = "";
                let value = "";
                if (line.includes("|")) {
                    const parts = line.split("|").map((p) => p.trim()).filter(Boolean);
                    if (parts.length >= 2) [key, value] = parts;
                } else if (line.includes("\t")) {
                    const parts = line.split("\t");
                    if (parts.length >= 2) [key, value] = [parts[0].trim(), parts[1].trim()];
                } else if (line.includes(":")) {
                    const [k, ...v] = line.split(":");
                    key = k.trim();
                    value = v.join(":").trim();
                }
                if (key.toLowerCase() === "característica") return null;
                return { key, value };
            })
            .filter((item): item is SpecItem => item !== null && item.key.trim() !== "");

        if (newItems.length > 0) setItems([...items, ...newItems]);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addRow(index);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number, field: "key" | "value") => {
        const value = e.target.value;
        if (field === "key" && value.includes(":")) {
            const [k, ...v] = value.split(":");
            const newItems = [...items];
            newItems[idx] = { key: k.trim(), value: v.join(":").trim() };
            setItems(newItems);
        } else {
            updateItem(idx, field, value);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <ListTree className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                        Especificaciones Técnicas
                    </h3>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addRow()}
                    className="h-7 px-2 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                    <span>Agregar fila</span>
                </Button>
            </div>

            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Input
                            placeholder="Propiedad (ej. Procesador)"
                            className="w-1/2 h-8 text-xs font-medium"
                            value={item.key}
                            onChange={(e) => handleChange(e, i, "key")}
                            onPaste={handlePaste}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                        <Input
                            placeholder="Valor (ej. A17 Pro)"
                            className="w-1/2 h-8 text-xs"
                            value={item.value}
                            onChange={(e) => handleChange(e, i, "value")}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(i)}
                            className="h-8 w-8 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 shrink-0 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar fila"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                ))}
            </div>

            <input type="hidden" name="especificaciones" value={jsonString} />
        </div>
    );
}