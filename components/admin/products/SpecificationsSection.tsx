"use client";

import { useState } from "react";
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

    const removeRow = (idx: number) => setItems(items.filter((_, i) => i !== idx));

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
        <div className="space-y-3 p-4 border border-border rounded-xl bg-background">
            <Label className="text-sm font-semibold">Especificaciones</Label>

            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    <Input
                        placeholder="Clave"
                        className="w-1/2 font-medium"
                        value={item.key}
                        onChange={(e) => handleChange(e, i, "key")}
                        onPaste={handlePaste}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                    <Input
                        placeholder="Valor"
                        className="w-1/2"
                        value={item.value}
                        onChange={(e) => handleChange(e, i, "value")}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(i)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <input type="hidden" name="especificaciones" value={jsonString} />
        </div>
    );
}