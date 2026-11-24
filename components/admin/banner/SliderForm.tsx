// File: frontend/components/admin/banner/SliderForm.tsx
"use client";

import { useState } from "react";
import { Info, Link as LinkIcon, Calendar, Palette, Image as ImageIcon, Film, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import { MediaPicker, MediaThumb } from "@/src/modules/media";
import {
    SliderLayoutEnum,
    SliderThemeEnum,
    type SliderBanner,
} from "@/src/schemas/slider.schema";
import { z } from "zod";

type SliderLayout = z.infer<typeof SliderLayoutEnum>;
type SliderTheme = z.infer<typeof SliderThemeEnum>;
type MediaType = "image" | "video";

interface SliderFormProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
    generalError?: string;
}

const LAYOUTS: { value: SliderLayout; label: string; description: string }[] = [
    {
        value: "image-only",
        label: "Solo medio",
        description: "La imagen o video ocupa todo el banner. Ideal para campañas visuales.",
    },
    {
        value: "background-media",
        label: "Medio de fondo con texto",
        description: "El medio va de fondo y el título y subtítulo se muestran encima.",
    },
];

const THEMES: { value: SliderTheme; label: string }[] = [
    { value: "dark", label: "Oscuro (texto claro)" },
    { value: "light", label: "Claro (texto oscuro)" },
];

/** Convierte una fecha a formato de <input type="datetime-local"> (hora local). */
const toLocalInput = (date?: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

export default function SliderForm({ initialData, fields, fieldErrors, generalError }: SliderFormProps) {
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];
    const mediaError = err("media");

    // Medio: un solo archivo, imagen o video.
    const initialVideo = fields?.["media.videoUrl"] || initialData?.media?.videoUrl || "";
    const initialImage = fields?.["media.imageUrl"] || initialData?.media?.imageUrl || "";
    const [mediaType, setMediaType] = useState<MediaType>(initialVideo ? "video" : "image");
    const [mediaUrl, setMediaUrl] = useState<string>(initialVideo || initialImage);

    const [layout, setLayout] = useState<SliderLayout>(
        (fields?.["design.layout"] as SliderLayout) ||
            (initialData?.design?.layout as SliderLayout) ||
            "image-only"
    );
    const [theme, setTheme] = useState<SliderTheme>(
        (fields?.["design.theme"] as SliderTheme) || (initialData?.design?.theme as SliderTheme) || "dark"
    );

    /** Cambiar de tipo descarta el archivo anterior: un banner tiene un solo medio. */
    const changeMediaType = (type: MediaType) => {
        if (type === mediaType) return;
        setMediaType(type);
        setMediaUrl("");
    };

    const clearMedia = () => setMediaUrl("");

    return (
        <div className="space-y-3">
            {generalError && (
                <Alert variant="destructive" className="py-2.5">
                    <AlertDescription className="text-xs">{generalError}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                <div className="space-y-3 lg:col-span-8">
                    {/* CONTENIDO */}
                    <AdminCardWrapper padding="default">
                        <div className="mb-3 flex items-center gap-2 border-b border-zinc-100 pb-2.5 text-zinc-700">
                            <Info className="h-3.5 w-3.5" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">Contenido</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="title"
                                    label="Título"
                                    required
                                    tooltip="Texto principal del banner (máx. 120 caracteres)."
                                />
                                <Input
                                    id="title"
                                    name="title"
                                    maxLength={120}
                                    defaultValue={val("title", initialData?.title)}
                                    placeholder="Ej: Nueva colección de invierno"
                                    className={`h-8 text-xs font-medium ${err("title") ? "border-rose-500" : ""}`}
                                />
                                {err("title") && <p className="text-[10px] text-rose-600">{err("title")}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="subtitle"
                                        label="Subtítulo"
                                        tooltip="Texto secundario opcional (máx. 200 caracteres)."
                                    />
                                    <Input
                                        id="subtitle"
                                        name="subtitle"
                                        maxLength={200}
                                        defaultValue={val("subtitle", initialData?.subtitle)}
                                        placeholder="Ej: Hasta 50% de descuento"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="destUrl"
                                        label="Enlace de destino"
                                        tooltip="Ruta interna (/catalogo) o URL externa a la que lleva el banner al hacer clic."
                                    />
                                    <div className="relative">
                                        <LinkIcon className="absolute left-2.5 top-2.5 h-3 w-3 text-zinc-400" />
                                        <Input
                                            id="destUrl"
                                            name="destUrl"
                                            defaultValue={val("destUrl", initialData?.destUrl)}
                                            placeholder="/catalogo"
                                            className="h-8 pl-7 text-xs font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-700">
                                <input
                                    type="checkbox"
                                    name="openInNewTab"
                                    value="true"
                                    defaultChecked={fields?.openInNewTab === "true" || initialData?.openInNewTab === true}
                                    className="h-3.5 w-3.5 rounded border-zinc-300"
                                />
                                Abrir el enlace en una pestaña nueva
                            </label>
                        </div>
                    </AdminCardWrapper>

                    {/* MEDIO */}
                    <AdminCardWrapper padding="default">
                        <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2.5">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                                Medio del banner
                            </h3>
                            <div className="inline-flex rounded-lg border border-zinc-200 p-0.5">
                                <button
                                    type="button"
                                    onClick={() => changeMediaType("image")}
                                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer ${
                                        mediaType === "image" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
                                    }`}
                                >
                                    <ImageIcon className="h-3.5 w-3.5" /> Imagen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeMediaType("video")}
                                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer ${
                                        mediaType === "video" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
                                    }`}
                                >
                                    <Film className="h-3.5 w-3.5" /> Video
                                </button>
                            </div>
                        </div>

                        {mediaUrl ? (
                            <div className="flex items-center gap-3">
                                <div className="relative aspect-video w-48 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                                    <MediaThumb item={{ kind: mediaType, url: mediaUrl, originalName: "banner" }} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="max-w-xs truncate text-[11px] text-zinc-500">{mediaUrl}</p>
                                    <div className="flex items-center gap-2">
                                        <MediaPicker
                                            kind={mediaType}
                                            folder="sliders"
                                            max={1}
                                            value={[mediaUrl]}
                                            onChange={(urls) => setMediaUrl(urls[0] ?? "")}
                                            title={mediaType === "video" ? "Video del banner" : "Imagen del banner"}
                                            trigger={<Button type="button" variant="outline" size="sm">Cambiar</Button>}
                                        />
                                        <Button type="button" variant="ghost" size="sm" onClick={clearMedia} className="text-rose-600">
                                            <X className="mr-1 h-3.5 w-3.5" /> Quitar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 p-4">
                                <p className="text-xs text-zinc-600">
                                    {mediaType === "video"
                                        ? "Sube o elige un video (MP4, MOV o WEBM, máx. 100 MB)."
                                        : "Sube o elige una imagen (JPG, PNG, WEBP o AVIF, máx. 10 MB)."}
                                </p>
                                <MediaPicker
                                    kind={mediaType}
                                    folder="sliders"
                                    max={1}
                                    value={[]}
                                    onChange={(urls) => setMediaUrl(urls[0] ?? "")}
                                    title={mediaType === "video" ? "Video del banner" : "Imagen del banner"}
                                    trigger={<Button type="button" variant="outline" size="sm">Seleccionar</Button>}
                                />
                            </div>
                        )}

                        {mediaError && <p className="mt-2 text-[10px] text-rose-600">{mediaError}</p>}

                        {/* Solo se envía el medio activo; el otro va vacío para que el servidor lo limpie. */}
                        <input type="hidden" name="media.imageUrl" value={mediaType === "image" ? mediaUrl : ""} />
                        <input type="hidden" name="media.videoUrl" value={mediaType === "video" ? mediaUrl : ""} />
                    </AdminCardWrapper>
                </div>

                <div className="space-y-3 lg:col-span-4">
                    {/* DISEÑO */}
                    <AdminCardWrapper padding="default">
                        <div className="mb-3 flex items-center gap-2 border-b border-zinc-100 pb-2.5 text-zinc-700">
                            <Palette className="h-3.5 w-3.5" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">Diseño</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Estilo</Label>
                                <div className="space-y-2">
                                    {LAYOUTS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setLayout(option.value)}
                                            aria-pressed={layout === option.value}
                                            className={`w-full rounded-lg border p-2.5 text-left cursor-pointer transition ${
                                                layout === option.value
                                                    ? "border-indigo-500 bg-indigo-50"
                                                    : "border-zinc-200 hover:border-zinc-400"
                                            }`}
                                        >
                                            <p className="text-xs font-semibold text-zinc-800">{option.label}</p>
                                            <p className="text-[11px] text-zinc-500">{option.description}</p>
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" name="design.layout" value={layout} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="design.theme" className="text-xs font-medium">Tema del texto</Label>
                                <NativeSelect
                                    id="design.theme"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value as SliderTheme)}
                                    className="w-full"
                                >
                                    {THEMES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </NativeSelect>
                                <input type="hidden" name="design.theme" value={theme} />
                                <p className="text-[11px] text-zinc-500">Solo aplica al estilo “Medio de fondo con texto”.</p>
                            </div>
                        </div>
                    </AdminCardWrapper>

                    {/* PUBLICACIÓN */}
                    <AdminCardWrapper padding="default">
                        <div className="mb-3 flex items-center gap-2 border-b border-zinc-100 pb-2.5 text-zinc-700">
                            <Calendar className="h-3.5 w-3.5" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">Publicación</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-700">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    value="true"
                                    defaultChecked={fields ? fields.isActive === "true" : (initialData?.isActive ?? true)}
                                    className="h-3.5 w-3.5 rounded border-zinc-300"
                                />
                                Activo (visible en la tienda)
                            </label>

                            <div className="space-y-1.5">
                                <Label htmlFor="order" className="text-xs font-medium">Orden</Label>
                                <Input
                                    id="order"
                                    name="order"
                                    type="number"
                                    min={0}
                                    defaultValue={val("order", initialData?.order?.toString())}
                                    className="h-8 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="schedule.startsAt" className="text-xs font-medium">Mostrar desde</Label>
                                    <Input
                                        id="schedule.startsAt"
                                        name="schedule.startsAt"
                                        type="datetime-local"
                                        defaultValue={val("schedule.startsAt", toLocalInput(initialData?.schedule?.startsAt))}
                                        className="h-8 text-xs"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="schedule.endsAt" className="text-xs font-medium">Mostrar hasta</Label>
                                    <Input
                                        id="schedule.endsAt"
                                        name="schedule.endsAt"
                                        type="datetime-local"
                                        defaultValue={val("schedule.endsAt", toLocalInput(initialData?.schedule?.endsAt))}
                                        className={`h-8 text-xs ${err("schedule.endsAt") ? "border-rose-500" : ""}`}
                                    />
                                    {err("schedule.endsAt") && (
                                        <p className="text-[10px] text-rose-600">{err("schedule.endsAt")}</p>
                                    )}
                                </div>
                            </div>
                            <p className="text-[11px] text-zinc-500">Déjalo vacío para mostrarlo siempre.</p>
                        </div>
                    </AdminCardWrapper>
                </div>
            </div>
        </div>
    );
}
