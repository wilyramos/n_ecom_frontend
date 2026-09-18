// File: frontend/components/admin/products/ProductSwitches.tsx
"use client";

import Switch from "react-switch";
import { useState } from "react";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import { Label } from "@/components/ui/label";

export default function ProductSwitches({ product }: { product?: ProductWithCategoryResponse }) {
    const [isActive, setIsActive] = useState(product?.isActive ?? true);
    const [esDestacado, setEsDestacado] = useState(product?.esDestacado ?? false);
    const [esNuevo, setEsNuevo] = useState(product?.esNuevo ?? false);
    const [isFrontPage, setIsFrontPage] = useState(product?.isFrontPage ?? false);

    const switches = [
        {
            id: "isActive",
            label: "Producto Activo",
            state: isActive,
            setter: setIsActive,
        },
        {
            id: "esDestacado",
            label: "Destacado",
            state: esDestacado,
            setter: setEsDestacado,
        },
        {
            id: "esNuevo",
            label: "Etiqueta Nuevo",
            state: esNuevo,
            setter: setEsNuevo,
        },
        {
            id: "isFrontPage",
            label: "Mostrar en Portada",
            state: isFrontPage,
            setter: setIsFrontPage,
        },
    ];

    return (
        <div className="space-y-3 text-xs">
            {switches.map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center justify-between gap-2">
                    <Label htmlFor={id} className="text-xs font-medium text-zinc-700 cursor-pointer">
                        {label}
                    </Label>
                    <Switch
                        id={id}
                        onChange={setter}
                        checked={state}
                        onColor="#18181b"
                        offColor="#e4e4e7"
                        onHandleColor="#ffffff"
                        offHandleColor="#ffffff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={18}
                        width={34}
                        handleDiameter={14}
                    />
                    <input type="hidden" name={id} value={state ? "true" : "false"} />
                </div>
            ))}
        </div>
    );
}