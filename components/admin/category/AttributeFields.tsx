// File: frontend/components/admin/category/AttributeFields.tsx
"use client";

import { useState } from "react";
import type { CategoryAttribute } from "@/src/schemas";
import {
    Trash2,
    Plus,
    Tag,
    Palette,
    Sparkles,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { AdminInput } from "@/src/components/admin/layout/admin-form-group";
import { Switch } from "@/components/ui/switch";
import ColorCircle from "@/components/ui/ColorCircle";
import { diccionarioColores } from "@/src/utils/constants/colores";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AttributeFieldsProps {
    defaultAttributes?: CategoryAttribute[];
}

export default function AttributeFields({ defaultAttributes }: AttributeFieldsProps) {
    const [attributes, setAttributes] = useState<CategoryAttribute[]>(
        defaultAttributes || []
    );
    // Controla los acordeones abiertos en shadcn
    const [openItems, setOpenItems] = useState<string[]>(["item-0"]);
    const [openPopoverIndex, setOpenPopoverIndex] = useState<string | null>(null);

    const update = (fn: (draft: CategoryAttribute[]) => void) => {
        const draft = [...attributes];
        fn(draft);
        setAttributes(draft);
    };

    const handleAttrNameChange = (index: number, value: string) =>
        update((d) => {
            d[index].name = value;
        });

    const handleAttrValueChange = (attrIndex: number, valIndex: number, value: string) =>
        update((d) => {
            d[attrIndex].values[valIndex] = value;
        });

    const addAttribute = () => {
        const nextKey = `item-${attributes.length}`;
        setAttributes([...attributes, { name: "", values: [""], isVariant: true }]);
        setOpenItems((prev) => [...prev, nextKey]);
    };

    const removeAttribute = (index: number) => {
        update((d) => {
            d.splice(index, 1);
        });
    };

    const addValue = (attrIndex: number) =>
        update((d) => {
            d[attrIndex].values.push("");
        });

    const removeValue = (attrIndex: number, valIndex: number) =>
        update((d) => {
            d[attrIndex].values.splice(valIndex, 1);
        });

    const handleIsVariantChange = (index: number, value: boolean) =>
        update((d) => {
            d[index].isVariant = value;
        });

    const availableColors = Object.keys(diccionarioColores);

    return (
        <div className="space-y-3">
            {/* Campo serializado para el envío en Server Actions */}
            <input
                type="hidden"
                name="attributes"
                value={JSON.stringify(attributes)}
            />

            {attributes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 shadow-2xs">
                        <Tag className="h-4 w-4" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-800">
                        Sin atributos definidos
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
                        Configura atributos como Color, Talla o Capacidad para habilitar filtros dinámicos en el catálogo.
                    </p>
                    <div className="mt-3">
                        <AdminButton
                            type="button"
                            variant="outline"
                            size="sm"
                            icon={Plus}
                            onClick={addAttribute}
                        >
                            Añadir Primer Atributo
                        </AdminButton>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <Accordion
                        type="multiple"
                        value={openItems}
                        onValueChange={setOpenItems}
                        className="space-y-2.5"
                    >
                        {attributes.map((attr, i) => {
                            const isColorAttribute = attr.name.toLowerCase().trim() === "color";
                            const validValuesCount = attr.values.filter((v) => v.trim() !== "").length;
                            const itemValue = `item-${i}`;

                            return (
                                <AccordionItem
                                    key={itemValue}
                                    value={itemValue}
                                    className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden px-0"
                                >
                                    {/* Cabecera Shadcn Accordion */}
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50/70 data-[state=open]:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-2.5 min-w-0 text-left">
                                            <div
                                                className={cn(
                                                    "p-1.5 rounded-lg transition-colors shrink-0",
                                                    isColorAttribute
                                                        ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                                                        : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                                )}
                                            >
                                                {isColorAttribute ? (
                                                    <Palette className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Tag className="w-3.5 h-3.5" />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                                                <span className="text-xs font-semibold text-slate-900 truncate">
                                                    {attr.name.trim() || `Atributo #${i + 1}`}
                                                </span>

                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 shrink-0">
                                                    {validValuesCount} {validValuesCount === 1 ? "valor" : "valores"}
                                                </span>

                                                {attr.isVariant && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60 shrink-0">
                                                        <Sparkles className="w-2.5 h-2.5" />
                                                        Variante
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    {/* Contenido Shadcn Accordion */}
                                    <AccordionContent className="px-4 pt-3 pb-4 space-y-4 border-t border-slate-100 bg-white">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
                                            {/* Nombre */}
                                            <div className="sm:col-span-2 space-y-1">
                                                <label className="text-[11px] font-medium text-slate-600 block">
                                                    Nombre del atributo
                                                </label>
                                                <AdminInput
                                                    value={attr.name}
                                                    onChange={(e) => handleAttrNameChange(i, e.target.value)}
                                                    placeholder="Ej: Color, Talla, Capacidad..."
                                                    autoComplete="off"
                                                />
                                            </div>

                                            {/* Switch Variante */}
                                            <div className="flex items-center justify-between sm:justify-end gap-3 p-2 rounded-lg border border-slate-200/70 bg-slate-50/50">
                                                <span className="text-[11px] font-medium text-slate-700">
                                                    Usar como variante
                                                </span>
                                                <Switch
                                                    checked={attr.isVariant ?? false}
                                                    onCheckedChange={(checked) =>
                                                        handleIsVariantChange(i, checked)
                                                    }
                                                    className="scale-90"
                                                />
                                            </div>
                                        </div>

                                        {/* Valores */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                                    Valores disponibles
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => addValue(i)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    <span>Agregar valor</span>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {attr.values.map((val, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 bg-slate-50/40"
                                                    >
                                                        {isColorAttribute && (
                                                            <Popover
                                                                open={openPopoverIndex === `${i}-${j}`}
                                                                onOpenChange={(open) =>
                                                                    setOpenPopoverIndex(open ? `${i}-${j}` : null)
                                                                }
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <button
                                                                        type="button"
                                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                                                                        title="Elegir muestra de color"
                                                                    >
                                                                        <ColorCircle color={val} size={14} />
                                                                    </button>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-52 p-0 border-slate-200 shadow-lg rounded-xl z-50"
                                                                    align="start"
                                                                >
                                                                    <Command>
                                                                        <CommandInput
                                                                            placeholder="Buscar color..."
                                                                            className="h-8 text-xs"
                                                                        />
                                                                        <CommandList className="max-h-48 p-1">
                                                                            <CommandEmpty className="p-2 text-center text-xs text-slate-400">
                                                                                Sin coincidencias.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {availableColors.map((colorKey) => (
                                                                                    <CommandItem
                                                                                        key={colorKey}
                                                                                        value={colorKey}
                                                                                        onSelect={(currentValue) => {
                                                                                            handleAttrValueChange(i, j, currentValue);
                                                                                            setOpenPopoverIndex(null);
                                                                                        }}
                                                                                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs capitalize cursor-pointer hover:bg-slate-100"
                                                                                    >
                                                                                        <ColorCircle color={colorKey} size={14} />
                                                                                        <span>{colorKey}</span>
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}

                                                        <AdminInput
                                                            value={val}
                                                            onChange={(e) =>
                                                                handleAttrValueChange(i, j, e.target.value)
                                                            }
                                                            placeholder={
                                                                isColorAttribute
                                                                    ? "Ej: Rojo, Azul, #1E3A8A"
                                                                    : "Ej: S, M, L, XL"
                                                            }
                                                            className="h-7 text-xs border-0 bg-transparent focus:bg-white flex-1"
                                                        />

                                                        {attr.values.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeValue(i, j)}
                                                                className="h-6 w-6 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-md transition-colors shrink-0"
                                                                title="Eliminar valor"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Botón Eliminar Atributo */}
                                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeAttribute(i)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Eliminar este atributo</span>
                                            </button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>

                    <AdminButton
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={Plus}
                        onClick={addAttribute}
                        className="w-full border-dashed"
                    >
                        Añadir Nuevo Atributo
                    </AdminButton>
                </div>
            )}
        </div>
    );
}