"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TBrand } from "@/src/schemas/brands";

interface BrandComboboxProps {
    brands: TBrand[];
    value?: string;
    onChange?: (value: string) => void;
}

export default function BrandCombobox({ brands, value, onChange }: BrandComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedBrandLabel = brands.find((b) => b._id === value)?.nombre;

    return (
        <div>
            <input type="hidden" name="brand" value={value || ""} />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal border-border bg-background hover:bg-muted"
                    >
                        {selectedBrandLabel || "Selecciona una marca..."}
                        <ChevronsUpDown className="opacity-50 w-4 h-4 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border-border shadow-md">
                    <Command>
                        <CommandInput placeholder="Buscar marca..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No se encontró la marca.</CommandEmpty>
                            <CommandGroup>
                                {brands.map((brand) => (
                                    <CommandItem
                                        key={brand._id}
                                        value={brand.nombre}
                                        onSelect={() => {
                                            const brandId = brand._id || "";
                                            const newValue = brandId === value ? "" : brandId;
                                            onChange?.(newValue);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {brand.nombre}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === brand._id ? "opacity-100 text-primary" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}