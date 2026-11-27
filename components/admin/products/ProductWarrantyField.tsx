// File: frontend/components/admin/products/ProductWarrantyField.tsx
"use client";

import Switch from "react-switch";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TEXTO_GARANTIA_DEFAULT = "1 año de garantía Apple";

export default function ProductWarrantyField({ product }: { product?: ProductWithCategoryResponse }) {
    const [mostrar, setMostrar] = useState(product?.mostrarGarantia ?? true);
    const [texto, setTexto] = useState(product?.textoGarantia ?? TEXTO_GARANTIA_DEFAULT);

    return (
        <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor="mostrarGarantia" className="text-xs font-medium text-zinc-700 cursor-pointer">
                    Mostrar tarjeta de garantía
                </Label>
                <Switch
                    id="mostrarGarantia"
                    onChange={setMostrar}
                    checked={mostrar}
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
                <input type="hidden" name="mostrarGarantia" value={mostrar ? "true" : "false"} />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="textoGarantia" className="text-xs font-semibold text-zinc-700">
                    Texto de garantía
                </Label>
                <Input
                    id="textoGarantia"
                    name="textoGarantia"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    maxLength={120}
                    placeholder={TEXTO_GARANTIA_DEFAULT}
                    disabled={!mostrar}
                    className="h-8 text-xs"
                />
                {/* Un input deshabilitado no se envía: conservamos el texto igualmente */}
                {!mostrar && <input type="hidden" name="textoGarantia" value={texto} />}
                <p className="text-[11px] text-zinc-500">
                    Si lo dejas vacío se usará &quot;{TEXTO_GARANTIA_DEFAULT}&quot;.
                </p>
            </div>

            {mostrar && (
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-2 text-zinc-700">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{texto.trim() || TEXTO_GARANTIA_DEFAULT}</span>
                </div>
            )}
        </div>
    );
}
