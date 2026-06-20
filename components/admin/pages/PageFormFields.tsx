// File: frontend/src/components/admin/page/PageFormFields.tsx

"use client";

import type { Page } from "@/src/schemas/page.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageContentEditor from "./PageContentEditor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    initialData?: Page;
    fields?: Record<string, string | boolean | Record<string, string> | undefined>;
    fieldErrors?: Record<string, string[]>;
}

export default function PageFormFields({ initialData, fields, fieldErrors }: Props) {
    const getSeoValue = (key: "metaTitle" | "metaDescription"): string => {
        if (fields?.seo && typeof fields.seo === "object") {
            const seoFields = fields.seo as Record<string, string>;
            if (seoFields[key] !== undefined) return seoFields[key];
        }
        return initialData?.seo?.[key] ?? "";
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-semibold text-zinc-700">
                        Título de la Página
                    </Label>
                    <Input
                        id="title"
                        type="text"
                        name="title"
                        required
                        defaultValue={(fields?.title as string) ?? initialData?.title ?? ""}
                        placeholder="Ej: Cambios y Devoluciones"
                    />
                    {fieldErrors?.title && (
                        <p className="text-[11px] font-medium text-red-500">{fieldErrors.title[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug" className="text-xs font-semibold text-zinc-700">
                        Ruta URL (Slug opcional)
                    </Label>
                    <Input
                        id="slug"
                        type="text"
                        name="slug"
                        defaultValue={(fields?.slug as string) ?? initialData?.slug ?? ""}
                        placeholder="ej: cambios-y-devoluciones"
                        className="font-mono text-xs focus-visible:ring-zinc-950"
                    />
                    {fieldErrors?.slug && (
                        <p className="text-[11px] font-medium text-red-500">{fieldErrors.slug[0]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700">
                    Contenido de la Página
                </Label>
                {/* Integración del Editor Lexical pasándole el campo de destino exacto */}
                <PageContentEditor 
                    fieldName="content"
                    initialHTML={(fields?.content as string) ?? initialData?.content ?? ""}
                />
                {fieldErrors?.content && (
                    <p className="text-[11px] font-medium text-red-500">{fieldErrors.content[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="isActive" className="text-xs font-semibold text-zinc-700">
                    Visibilidad inicial
                </Label>
                <Select
                    name="isActive"
                    defaultValue={String(fields?.isActive ?? initialData?.isActive ?? "true")}
                >
                    <SelectTrigger id="isActive" className="w-full sm:w-64 text-xs focus:ring-zinc-950">
                        <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true" className="text-xs">
                            Publicada y visible en el Storefront
                        </SelectItem>
                        <SelectItem value="false" className="text-xs">
                            Oculta / Guardar como Borrador
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border-t border-zinc-100 pt-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Indexación y SEO
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="metaTitle" className="text-xs font-semibold text-zinc-700">
                            Meta Título personalizado
                        </Label>
                        <Input
                            id="metaTitle"
                            type="text"
                            name="metaTitle"
                            defaultValue={getSeoValue("metaTitle")}
                            placeholder="Dejar vacío para usar el título principal"
                            />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="metaDescription" className="text-xs font-semibold text-zinc-700">
                            Meta Descripción corta
                        </Label>
                        <Input
                            id="metaDescription"
                            type="text"
                            name="metaDescription"
                            defaultValue={getSeoValue("metaDescription")}
                            placeholder="Descripción resumida para Google"
                            />
                    </div>
                </div>
            </div>
        </div>
    );
}