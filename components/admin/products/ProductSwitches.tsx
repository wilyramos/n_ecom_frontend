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
            label: "¿Producto activo?",
            state: isActive,
            setter: setIsActive,
        },
        {
            id: "esDestacado",
            label: "¿Es destacado?",
            state: esDestacado,
            setter: setEsDestacado,
        },
        {
            id: "esNuevo",
            label: "¿Es nuevo?",
            state: esNuevo,
            setter: setEsNuevo,
        },
        {
            id: "isFrontPage",
            label: "¿Página principal?",
            state: isFrontPage,
            setter: setIsFrontPage,
        },
    ];

    return (
        <div className="space-y-3.5 text-xs">
            {switches.map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center justify-between gap-2">
                    <Label htmlFor={id} className="text-xs font-medium text-slate-700 cursor-pointer">
                        {label}
                    </Label>
                    <Switch
                        id={id}
                        onChange={setter}
                        checked={state}
                        onColor="#0f172a"
                        offColor="#e2e8f0"
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