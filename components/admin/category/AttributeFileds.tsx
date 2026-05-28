"use client";

import { useState } from "react";
import type { CategoryAttribute } from "@/src/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";

export default function AttributeFields({
    defaultAttributes,
}: {
    defaultAttributes?: CategoryAttribute[];
}) {
    const [attributes, setAttributes] = useState<CategoryAttribute[]>(
        defaultAttributes || []
    );

    const update = (fn: (draft: CategoryAttribute[]) => void) => {
        const draft = [...attributes];
        fn(draft);
        setAttributes(draft);
    };

    const handleAttrNameChange = (index: number, value: string) =>
        update((d) => { d[index].name = value; });

    const handleAttrValueChange = (attrIndex: number, valIndex: number, value: string) =>
        update((d) => { d[attrIndex].values[valIndex] = value; });

    const addAttribute = () =>
        setAttributes([...attributes, { name: "", values: [""] }]);

    const removeAttribute = (index: number) =>
        update((d) => { d.splice(index, 1); });

    const addValue = (attrIndex: number) =>
        update((d) => { d[attrIndex].values.push(""); });

    const removeValue = (attrIndex: number, valIndex: number) =>
        update((d) => { d[attrIndex].values.splice(valIndex, 1); });

    const handleIsVariantChange = (index: number, value: boolean) =>
        update((d) => { d[index].isVariant = value; });

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Atributos</h3>

            <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

            <div className="grid gap-4 sm:grid-cols-2">
                {attributes.map((attr, i) => (
                    <div
                        key={i}
                        className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                    >
                        <div className="space-y-1">
                            <Label htmlFor={`attr-name-${i}`}>Nombre del atributo</Label>
                            <Input
                                id={`attr-name-${i}`}
                                value={attr.name}
                                onChange={(e) => handleAttrNameChange(i, e.target.value)}
                                placeholder="Ej: Color, Talla..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Valores</Label>
                            {attr.values.map((val, j) => (
                                <div key={j} className="flex items-center gap-2">
                                    <Input
                                        value={val}
                                        onChange={(e) => handleAttrValueChange(i, j, e.target.value)}
                                        placeholder="Ej: Rojo, M..."
                                    />
                                    {attr.values.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeValue(i, j)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={attr.isVariant ?? false}
                                        onCheckedChange={(v) => handleIsVariantChange(i, v)}
                                    />
                                    <Label className="text-xs">Usar como variante</Label>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addValue(i)}
                                    className="h-8 text-xs"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Valor
                                </Button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeAttribute(i)}
                                className="w-full"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar atributo
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addAttribute}
            >
                <Plus className="w-4 h-4 mr-2" /> Añadir atributo
            </Button>
        </div>
    );
}