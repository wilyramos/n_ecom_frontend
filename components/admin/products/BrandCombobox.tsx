"use client";

import * as React from "react";
import { NativeSelect } from "@/components/ui/native-select";
import type { TBrand } from "@/src/schemas/brands";

interface BrandComboboxProps {
    brands: TBrand[];
    value?: string;
    onChange?: (value: string) => void;
}

export default function BrandCombobox({ brands, value, onChange }: BrandComboboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        onChange?.(newValue);
    };

    return (
        <div>
            <NativeSelect
                id="brand"
                name="brand"
                value={value || ""}
                onChange={handleChange}
            >
                <option value="" disabled>
                    Selecciona una marca...
                </option>
                {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                        {brand.nombre}
                    </option>
                ))}
            </NativeSelect>
        </div>
    );
}