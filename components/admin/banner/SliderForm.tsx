// File: frontend/src/components/admin/banner/SliderForm.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Info, ImageIcon, Link as LinkIcon, DollarSign, Palette, RotateCcw, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import {
    SliderLayoutEnum,
    SliderThemeEnum,
    SliderObjectFitEnum,
    type SliderBanner,
} from "@/src/schemas/slider.schema";
import { z } from "zod";

type SliderTheme = z.infer<typeof SliderThemeEnum>;
type SliderLayout = z.infer<typeof SliderLayoutEnum>;

interface ColorPalette {
    bgColor: string;
    accentColor: string;
    textColor: string;
}

interface SliderFormProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
    generalError?: string;
}

const LAYOUT_LABELS: Record<SliderLayout, string> = {
    "image-only": "Solo imagen",
    default: "Default (Media Derecha)",
    "media-left": "Media Izquierda",
    "background-media": "Fondo con Media",
};

const THEME_PRESETS: Record<Exclude<SliderTheme, "custom">, ColorPalette> = {
    dark: { bgColor: "#000000", accentColor: "#a0a0a0", textColor: "#cbcbcb" },
    light: { bgColor: "#ffffff", accentColor: "#a0a0a0", textColor: "#a0a0a0" },
};

const COLOR_LABELS: Record<keyof ColorPalette, string> = {
    bgColor: "Fondo",
    accentColor: "Acento",
    textColor: "Texto",
};

export default function SliderForm({
    initialData,
    fields,
    fieldErrors,
    generalError,
}: SliderFormProps) {
    const [availableImages, setAvailableImages] = useState<string[]>(
        initialData?.media?.imageUrl ? [initialData.media.imageUrl] : []
    );
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
        fields?.["media.imageUrl"] || initialData?.media?.imageUrl || ""
    );

    const [theme, setTheme] = useState<SliderTheme>(
        (fields?.["design.theme"] as SliderTheme) || initialData?.design?.theme || "dark"
    );
    const [layout, setLayout] = useState<SliderLayout>(
        (fields?.["design.layout"] as SliderLayout) || initialData?.design?.layout || "default"
    );
    const [colors, setColors] = useState<ColorPalette>({
        bgColor: fields?.["design.bgColor"] || initialData?.design?.bgColor || THEME_PRESETS.dark.bgColor,
        accentColor: fields?.["design.accentColor"] || initialData?.design?.accentColor || THEME_PRESETS.dark.accentColor,
        textColor: fields?.["design.textColor"] || initialData?.design?.textColor || THEME_PRESETS.dark.textColor,
    });

    const isCustom = theme === "custom";

    useEffect(() => {
        if (!isCustom) {
            setColors(THEME_PRESETS[theme]);
        }
    }, [theme, isCustom]);

    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const toDatetimeLocal = (date?: Date | string | null) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    };

    const handleUploadSuccess = (newImages: string[]) => {
        setAvailableImages((prev) => [...prev, ...newImages]);
    };

    const handleConfirmSelection = (selectedImages: string[]) => {
        if (selectedImages.length > 0) {
            const url = selectedImages[0];
            setSelectedImageUrl(url);
            const input = document.querySelector('input[name="media.imageUrl"]') as HTMLInputElement;
            if (input) {
                input.value = url;
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    };

    const handleColorChange = (key: keyof ColorPalette, value: string) => {
        if (!isCustom) return;
        setColors((prev) => ({ ...prev, [key]: value }));
    };

    const resetAppearance = () => {
        setTheme("dark");
        setLayout("default");
        setColors(THEME_PRESETS.dark);
    };

    return (
        <div className="space-y-3">
            {generalError && (
                <Alert variant="destructive" className="py-2.5">
                    <AlertDescription className="text-xs">{generalError}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                {/* Columna Principal */}
                <div className="lg:col-span-8 space-y-3">
                    {/* INFORMACIÓN GENERAL */}
                    <AdminCardWrapper padding="default">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 mb-3 text-zinc-700">
                            <Info className="w-3.5 h-3.5" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">
                                Información General
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="title"
                                    label="Título Principal"
                                    required
                                    tooltip="Texto principal y destacado del banner."
                                />
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={val("title", initialData?.title)}
                                    placeholder="Ej: Nueva Colección de Invierno"
                                    className={`h-8 text-xs font-medium ${err("title") ? "border-rose-500" : ""}`}
                                />
                                {err("title") && <p className="text-[10px] text-rose-600">{err("title")}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="subtitle"
                                        label="Subtítulo"
                                        tooltip="Texto secundario complementario opcional."
                                    />
                                    <Input
                                        id="subtitle"
                                        name="subtitle"
                                        defaultValue={val("subtitle", initialData?.subtitle)}
                                        placeholder="Ej: Hasta 50% de descuento"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="destUrl"
                                        label="URL de Destino"
                                        tooltip="Enlace de redirección al hacer clic en el banner."
                                    />
                                    <div className="relative">
                                        <LinkIcon className="absolute left-2.5 top-2.5 w-3 h-3 text-zinc-400" />
                                        <Input
                                            id="destUrl"
                                            name="destUrl"
                                            defaultValue={val("destUrl", initialData?.destUrl)}
                                            placeholder="/categorias/invierno"
                                            className="h-8 text-xs font-medium pl-7"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                                <input
                                    type="checkbox"
                                    id="openInNewTab"
                                    name="openInNewTab"
                                    value="true"
                                    defaultChecked={initialData?.openInNewTab ?? false}
                                    className="w-3.5 h-3.5 accent-zinc-900 rounded cursor-pointer"
                                />
                                <LabelWithTooltip
                                    htmlFor="openInNewTab"
                                    label="Abrir enlace en nueva pestaña"
                                    tooltip="Abre el destino en un tab secundario del navegador."
                                />
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <LabelWithTooltip
                                    htmlFor="description"
                                    label="Descripción"
                                    tooltip="Texto explicativo adicional dentro del banner."
                                />
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={val("description", initialData?.description)}
                                    rows={2}
                                    placeholder="Detalles sobre la campaña o lanzamiento..."
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="terms"
                                    label="Términos y condiciones"
                                    tooltip="Letra pequeña y restricciones operativas de la promoción."
                                />
                                <Textarea
                                    id="terms"
                                    name="terms"
                                    defaultValue={val("terms", initialData?.terms)}
                                    rows={2}
                                    placeholder="*Válido hasta agotar stock o vigencia estipulada..."
                                    className="text-xs"
                                />
                            </div>
                        </div>
                    </AdminCardWrapper>

                    {/* PRECIO PROMOCIONAL */}
                    <AdminCardWrapper padding="default">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 mb-3 text-zinc-700">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">
                                Precio Promocional
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="price.current"
                                        label="Precio actual"
                                        tooltip="Monto de oferta destacado en el banner."
                                    />
                                    <Input
                                        id="price.current"
                                        name="price.current"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={val("price.current", initialData?.price?.current?.toString())}
                                        placeholder="0.00"
                                        className={`h-8 text-xs font-medium ${err("price.current") ? "border-rose-500" : ""}`}
                                    />
                                    {err("price.current") && (
                                        <p className="text-[10px] text-rose-600">{err("price.current")}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="price.compare"
                                        label="Precio comparativo"
                                        tooltip="Precio tachado regular de referencia."
                                    />
                                    <Input
                                        id="price.compare"
                                        name="price.compare"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={val("price.compare", initialData?.price?.compare?.toString())}
                                        placeholder="0.00"
                                        className={`h-8 text-xs font-medium ${err("price.compare") ? "border-rose-500" : ""}`}
                                    />
                                    {err("price.compare") && (
                                        <p className="text-[10px] text-rose-600">{err("price.compare")}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="price.label"
                                        label="Etiqueta"
                                        tooltip="Texto previo al importe numérico (ej. Desde)."
                                    />
                                    <Input
                                        id="price.label"
                                        name="price.label"
                                        defaultValue={val("price.label", initialData?.price?.label)}
                                        placeholder="Ej: Desde"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="price.suffix"
                                        label="Sufijo"
                                        tooltip="Texto posterior al precio (ej. / mes)."
                                    />
                                    <Input
                                        id="price.suffix"
                                        name="price.suffix"
                                        defaultValue={val("price.suffix", initialData?.price?.suffix)}
                                        placeholder="Ej: / unidad"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </AdminCardWrapper>

                    {/* RECURSOS MULTIMEDIA */}
                    <AdminCardWrapper padding="default">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 mb-3 text-zinc-700">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">
                                Recursos Multimedia
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <input type="hidden" name="media.imageUrl" value={selectedImageUrl} />

                            <div className="space-y-2 p-2.5 border border-zinc-200/80 bg-zinc-50/50 rounded-lg">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <LabelWithTooltip
                                            htmlFor="media.imageUrl"
                                            label="Imagen seleccionada"
                                            tooltip="Dirección del archivo de imagen asignado."
                                        />
                                        <p className="text-[10.5px] text-zinc-400">
                                            Proporción panorámica recomendada: <strong>27:9</strong> (mínimo 140px de alto, ej: 1920x640 px o 2160x720 px).
                                        </p>
                                        <p className="text-[11.5px] text-zinc-600 truncate">
                                            {selectedImageUrl || "Ningún archivo vinculado"}
                                        </p>
                                    </div>

                                    <MediaLibraryDialog
                                        selectedImages={selectedImageUrl ? [selectedImageUrl] : []}
                                        globalImagesPool={availableImages}
                                        onConfirmSelection={handleConfirmSelection}
                                        onUploadSuccess={handleUploadSuccess}
                                        allowMultiple={false}
                                        triggerLabel={selectedImageUrl ? "Cambiar Imagen" : "Examinar"}
                                    />
                                </div>

                                {selectedImageUrl ? (
                                    <div className="relative w-full aspect-[27/9] min-h-[140px] rounded-md overflow-hidden border border-zinc-200 bg-zinc-900 shadow-xs">
                                        <Image
                                            src={selectedImageUrl}
                                            alt="Vista previa del banner"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9.5px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                                            27:9
                                        </span>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[27/9] min-h-[140px] border border-dashed border-zinc-200 rounded-md bg-zinc-50/70 flex flex-col items-center justify-center p-3 text-center space-y-1">
                                        <p className="text-xs text-zinc-500">Sin imagen vinculada</p>
                                        <p className="text-[10.5px] text-zinc-400">El contenedor del banner se renderizará en proporción 27:9</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="media.videoUrl"
                                        label="URL del Video (opcional)"
                                        tooltip="Dirección MP4 de fondo si aplica."
                                    />
                                    <Input
                                        id="media.videoUrl"
                                        name="media.videoUrl"
                                        defaultValue={val("media.videoUrl", initialData?.media?.videoUrl)}
                                        placeholder="https://dominio.com/video.mp4"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="media.objectFit"
                                        label="Ajuste de Imagen"
                                        tooltip="Regla CSS para escalar dentro del contenedor."
                                    />
                                    <Select
                                        name="media.objectFit"
                                        defaultValue={val("media.objectFit", initialData?.media?.objectFit ?? "cover")}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SliderObjectFitEnum.options.map((opt) => (
                                                <SelectItem key={opt} value={opt} className="text-xs uppercase">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </AdminCardWrapper>

                    {/* CONTADOR REGRESIVO */}
                    <AdminCardWrapper padding="default">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 mb-3 text-zinc-700">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">
                                Contador Regresivo (Countdown)
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="countdown.endsAt"
                                        label="Fecha Límite"
                                        tooltip="Momento en el cual el contador llega a cero."
                                    />
                                    <Input
                                        id="countdown.endsAt"
                                        name="countdown.endsAt"
                                        type="datetime-local"
                                        defaultValue={toDatetimeLocal(initialData?.countdown?.endsAt)}
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <LabelWithTooltip
                                        htmlFor="countdown.label"
                                        label="Etiqueta del Reloj"
                                        tooltip="Texto encima del contador de tiempo."
                                    />
                                    <Input
                                        id="countdown.label"
                                        name="countdown.label"
                                        defaultValue={val("countdown.label", initialData?.countdown?.label)}
                                        placeholder="Ej: La oferta finaliza en:"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                                <input
                                    type="checkbox"
                                    id="countdown.showDays"
                                    name="countdown.showDays"
                                    value="true"
                                    defaultChecked={initialData?.countdown?.showDays ?? true}
                                    className="w-3.5 h-3.5 accent-zinc-900 rounded cursor-pointer"
                                />
                                <LabelWithTooltip
                                    htmlFor="countdown.showDays"
                                    label="Incluir bloque de días"
                                    tooltip="Muestra u oculta la caja de días restantes."
                                />
                            </div>
                        </div>
                    </AdminCardWrapper>
                </div>

                {/* Columna Lateral */}
                <aside className="lg:col-span-4 space-y-3 lg:sticky lg:top-18">
                    {/* APARIENCIA Y ESTILO */}
                    <AdminCardWrapper padding="default">
                        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-2 text-zinc-700">
                                <Palette className="w-3.5 h-3.5" />
                                <h3 className="text-xs font-semibold uppercase tracking-wider">
                                    Apariencia
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={resetAppearance}
                                className="h-6 w-6 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
                                title="Restablecer tema"
                            >
                                <RotateCcw className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="design.layout"
                                    label="Distribución (Layout)"
                                    tooltip="Disposición estructural de textos e imagen."
                                />
                                <Select
                                    name="design.layout"
                                    value={layout}
                                    onValueChange={(v: SliderLayout) => setLayout(v)}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SliderLayoutEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs">
                                                {LAYOUT_LABELS[opt]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="design.theme"
                                    label="Tema de Color"
                                    tooltip="Paleta cromática preconfigurada o personalizada."
                                />
                                <Select
                                    name="design.theme"
                                    value={theme}
                                    onValueChange={(v: SliderTheme) => setTheme(v)}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SliderThemeEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs capitalize">
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 pt-1 border-t border-zinc-100">
                                {(Object.keys(colors) as Array<keyof ColorPalette>).map((key) => (
                                    <div key={key} className="space-y-1">
                                        <Label className="text-[10px] uppercase font-semibold text-zinc-500">
                                            {COLOR_LABELS[key]}
                                        </Label>
                                        <input type="hidden" name={`design.${key}`} value={colors[key]} />
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="text"
                                                value={colors[key]}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                disabled={!isCustom}
                                                maxLength={7}
                                                className="h-8 text-xs uppercase font-mono"
                                            />
                                            <div className="relative w-9 h-8 shrink-0 rounded-md border border-zinc-200/80 overflow-hidden">
                                                <input
                                                    type="color"
                                                    value={colors[key]}
                                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                                    disabled={!isCustom}
                                                    className="absolute inset-0 w-full h-full cursor-pointer scale-150 disabled:cursor-not-allowed disabled:opacity-40"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AdminCardWrapper>

                    {/* PLANIFICACIÓN Y PUBLICACIÓN */}
                    <AdminCardWrapper padding="default">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 mb-3 text-zinc-700">
                            <Calendar className="w-3.5 h-3.5" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">
                                Planificación
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="order"
                                    label="Posición en el carrusel"
                                    tooltip="Índice ordinal de visualización (menor a mayor)."
                                />
                                <Input
                                    id="order"
                                    name="order"
                                    type="number"
                                    min="0"
                                    defaultValue={initialData?.order ?? 0}
                                    className="h-8 text-xs font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="schedule.startsAt"
                                    label="Fecha de inicio"
                                    tooltip="Fecha y hora de activación automática en la tienda."
                                />
                                <Input
                                    id="schedule.startsAt"
                                    name="schedule.startsAt"
                                    type="datetime-local"
                                    defaultValue={toDatetimeLocal(initialData?.schedule?.startsAt)}
                                    className="h-8 text-xs font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="schedule.endsAt"
                                    label="Fecha de término"
                                    tooltip="Fecha y hora de expiración automática del banner."
                                />
                                <Input
                                    id="schedule.endsAt"
                                    name="schedule.endsAt"
                                    type="datetime-local"
                                    defaultValue={toDatetimeLocal(initialData?.schedule?.endsAt)}
                                    className={`h-8 text-xs font-medium ${err("schedule.endsAt") ? "border-rose-500" : ""}`}
                                />
                                {err("schedule.endsAt") && (
                                    <p className="text-[10px] text-rose-600">{err("schedule.endsAt")}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100">
                                <LabelWithTooltip
                                    htmlFor="isActive"
                                    label="Estado Activo"
                                    tooltip="Control maestro de visibilidad del banner."
                                />
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    value="true"
                                    defaultChecked={initialData?.isActive ?? true}
                                    className="w-4 h-4 accent-zinc-900 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </AdminCardWrapper>
                </aside>
            </div>
        </div>
    );
}