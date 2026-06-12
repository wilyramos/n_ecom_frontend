// File: frontend/src/components/admin/banner/SliderForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Info, ImageIcon, Link as LinkIcon, DollarSign, Palette, RotateCcw, Calendar } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";
import {
    SliderLayoutEnum,
    SliderThemeEnum,
    SliderObjectFitEnum,
    type SliderBanner
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
    "default": "Default (Media Derecha)",
    "media-left": "Media Izquierda",
    "background-media": "Fondo con Media",
};

const THEME_PRESETS: Record<Exclude<SliderTheme, 'custom'>, ColorPalette> = {
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
    // ── ESTADOS MULTIMEDIA ────────────────────────────────────────────────────
    const [availableImages, setAvailableImages] = useState<string[]>(
        initialData?.media?.imageUrl ? [initialData.media.imageUrl] : []
    );
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
        fields?.["media.imageUrl"] || initialData?.media?.imageUrl || ""
    );

    // ── ESTADOS APARIENCIA ────────────────────────────────────────────────────
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

    // ── HELPERS FORMULARIO ────────────────────────────────────────────────────
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const toDatetimeLocal = (date?: Date | string | null) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    };

    // ── MANEJADORES MULTIMEDIA ────────────────────────────────────────────────
    const handleUploadSuccess = (newImages: string[]) => {
        setAvailableImages(prev => [...prev, ...newImages]);
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

    // ── MANEJADORES DISEÑO ────────────────────────────────────────────────────
    const handleColorChange = (key: keyof ColorPalette, value: string) => {
        if (!isCustom) return;
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const resetAppearance = () => {
        setTheme("dark");
        setLayout("default");
        setColors(THEME_PRESETS.dark);
    };

    return (
        <div className="space-y-4">
            {generalError && (
                <Alert variant="error" mode="banner">{generalError}</Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-2">
                {/* ── COLUMNA PRINCIPAL ──────────────────────────────────────── */}
                <div className="lg:col-span-3 space-y-6">

                    {/* INFORMACIÓN GENERAL */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-muted-foreground/80" />
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="title"
                                    label="Título Principal"
                                    required
                                    tooltip="Texto principal y destacado del banner."
                                />
                                <Input
                                    name="title"
                                    defaultValue={val("title", initialData?.title)}
                                    placeholder="Ej: Nueva Colección de Invierno"
                                    className={`h-10 text-xs bg-background-secondary border ${err("title") ? "border-destructive" : "border-border/40"} rounded-sm`}
                                />
                                {err("title") && <p className="text-[10px] text-destructive">{err("title")}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="subtitle"
                                        label="Subtítulo"
                                        tooltip="Texto secundario complementario opcional."
                                    />
                                    <Input
                                        name="subtitle"
                                        defaultValue={val("subtitle", initialData?.subtitle)}
                                        placeholder="Ej: Hasta 50% de descuento"
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="destUrl"
                                        label="URL de Destino"
                                        tooltip="Enlace de redirección al hacer clic en el banner."
                                    />
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            name="destUrl"
                                            defaultValue={val("destUrl", initialData?.destUrl)}
                                            placeholder="/categorias/invierno"
                                            className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="openInNewTab"
                                    name="openInNewTab"
                                    value="true"
                                    defaultChecked={initialData?.openInNewTab ?? false}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <LabelWithTooltip
                                    htmlFor="openInNewTab"
                                    label="Abrir enlace en nueva pestaña"
                                    tooltip="Si se marca, el enlace de destino se abrirá en un nuevo tab del navegador."
                                />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="description"
                                    label="Descripción"
                                    tooltip="Bloque de texto informativo adicional que aparece dentro del banner."
                                />
                                <Textarea
                                    name="description"
                                    defaultValue={val("description", initialData?.description)}
                                    rows={2}
                                    placeholder="Detalles adicionales sobre la promoción o campaña..."
                                    className="text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="terms"
                                    label="Términos y condiciones"
                                    tooltip="Restricciones legales o letra pequeña aplicable a la promoción."
                                />
                                <Textarea
                                    name="terms"
                                    defaultValue={val("terms", initialData?.terms)}
                                    rows={2}
                                    placeholder="*Oferta válida desde el 01/06 hasta el 30/06 o hasta agotar stock..."
                                    className="text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* PRECIO */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 text-green-600" />
                            <CardTitle>Precio promocional</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="price.current"
                                        label="Precio actual"
                                        tooltip="El valor de venta final configurado para el banner."
                                    />
                                    <Input
                                        name="price.current"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={val("price.current", initialData?.price?.current?.toString())}
                                        placeholder="0.00"
                                        className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("price.current") ? "border-destructive" : "border-border/40"}`}
                                    />
                                    {err("price.current") && <p className="text-[10px] text-destructive">{err("price.current")}</p>}
                                </div>
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="price.compare"
                                        label="Precio comparativo"
                                        tooltip="Precio original tachado que sirve de referencia comercial."
                                    />
                                    <Input
                                        name="price.compare"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={val("price.compare", initialData?.price?.compare?.toString())}
                                        placeholder="0.00"
                                        className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("price.compare") ? "border-destructive" : "border-border/40"}`}
                                    />
                                    {err("price.compare") && <p className="text-[10px] text-destructive">{err("price.compare")}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="price.label"
                                        label="Etiqueta"
                                        tooltip="Prefijo descriptivo para el precio (Ej: Desde, Solo hoy)."
                                    />
                                    <Input
                                        name="price.label"
                                        defaultValue={val("price.label", initialData?.price?.label)}
                                        placeholder="Ej: Solo por hoy"
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="price.suffix"
                                        label="Sufijo"
                                        tooltip="Información complementaria posterior al monto numérico (Ej: /mes, c/u)."
                                    />
                                    <Input
                                        name="price.suffix"
                                        defaultValue={val("price.suffix", initialData?.price?.suffix)}
                                        placeholder="Ej: / unidad"
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* MULTIMEDIA */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/80" />
                            <CardTitle>Multimedia</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input type="hidden" name="media.imageUrl" value={selectedImageUrl} />

                            <div className="items-end gap-3 p-3 border border-border/40 bg-background-secondary/20 rounded-sm flex justify-between">
                                <div className="flex-1 space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="media.imageUrl"
                                        label="Imagen seleccionada"
                                        tooltip="Ruta o URI absoluta del recurso de imagen vinculado al banner."
                                    />
                                    <div className="h-10 px-3 flex items-center bg-background border border-border/40 rounded-sm text-xs text-muted-foreground truncate max-w-lg">
                                        {selectedImageUrl || "Sin imagen seleccionada"}
                                    </div>
                                </div>
                                <MediaLibraryDialog
                                    selectedImages={selectedImageUrl ? [selectedImageUrl] : []}
                                    globalImagesPool={availableImages}
                                    onConfirmSelection={handleConfirmSelection}
                                    onUploadSuccess={handleUploadSuccess}
                                    allowMultiple={false}
                                    triggerLabel="Seleccionar"
                                    triggerVariant="outline"
                                    size="sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="media.videoUrl"
                                        label="URL del Video"
                                        tooltip="Dirección web opcional si el banner renderiza un reproductor multimedia."
                                    />
                                    <Input
                                        name="media.videoUrl"
                                        defaultValue={val("media.videoUrl", initialData?.media?.videoUrl)}
                                        placeholder="https://su-servidor.com/video.mp4"
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="media.objectFit"
                                        label="Ajuste de Imagen (Object Fit)"
                                        tooltip="Estrategia CSS empleada para escalar la imagen dentro de la caja contenedora."
                                    />
                                    <Select
                                        name="media.objectFit"
                                        defaultValue={val("media.objectFit", initialData?.media?.objectFit ?? "cover")}
                                    >
                                        <SelectTrigger className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border border-border rounded-sm">
                                            {SliderObjectFitEnum.options.map((opt) => (
                                                <SelectItem key={opt} value={opt} className="text-xs uppercase">{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* COUNTDOWN */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <CardTitle>Contador regresivo (Countdown)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="countdown.endsAt"
                                        label="Fecha de finalización"
                                        tooltip="Fecha límite en la que el contador llegará a cero."
                                    />
                                    <Input
                                        name="countdown.endsAt"
                                        type="datetime-local"
                                        defaultValue={toDatetimeLocal(initialData?.countdown?.endsAt)}
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <LabelWithTooltip
                                        htmlFor="countdown.label"
                                        label="Etiqueta del contador"
                                        tooltip="Texto descriptivo que se muestra arriba o al lado del reloj."
                                    />
                                    <Input
                                        name="countdown.label"
                                        defaultValue={val("countdown.label", initialData?.countdown?.label)}
                                        placeholder="Ej: La oferta termina en:"
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="countdown.showDays"
                                    name="countdown.showDays"
                                    value="true"
                                    defaultChecked={initialData?.countdown?.showDays ?? true}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <LabelWithTooltip
                                    htmlFor="countdown.showDays"
                                    label="Mostrar días en el contador"
                                    tooltip="Habilita o deshabilita la visualización del bloque de días remanentes."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── COLUMNA LATERAL (CONFIGURACIÓN SECUNDARIA) ───────────────── */}
                <aside className="space-y-6">

                    {/* APARIENCIA Y DISEÑO */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <Palette className="w-3.5 h-3.5 text-muted-foreground/80" />
                                <CardTitle className="text-sm">Apariencia</CardTitle>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={resetAppearance}>
                                <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="design.layout"
                                    label="Layout"
                                    tooltip="Estructura visual y distribución interna de los textos y archivos multimedia."
                                />
                                <Select name="design.layout" value={layout} onValueChange={(v: SliderLayout) => setLayout(v)}>
                                    <SelectTrigger className="h-9 text-xs bg-background-secondary border-border/40 rounded-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border rounded-sm">
                                        {SliderLayoutEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs">{LAYOUT_LABELS[opt]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="design.theme"
                                    label="Tema"
                                    tooltip="Esquema base de colores. Selecciona 'custom' para modificar de forma independiente."
                                />
                                <Select name="design.theme" value={theme} onValueChange={(v: SliderTheme) => setTheme(v)}>
                                    <SelectTrigger className="h-9 text-xs bg-background-secondary border-border/40 rounded-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border rounded-sm">
                                        {SliderThemeEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs capitalize">{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3 pt-2">
                                {(Object.keys(colors) as Array<keyof ColorPalette>).map((key) => (
                                    <div key={key} className="space-y-1">
                                        <Label className="text-[9px] uppercase text-muted-foreground font-semibold">
                                            {COLOR_LABELS[key]}
                                        </Label>
                                        <input type="hidden" name={`design.${key}`} value={colors[key]} />
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={colors[key]}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                disabled={!isCustom}
                                                className="h-8 text-[11px] font-mono uppercase bg-background-secondary border-border/40 rounded-sm"
                                                maxLength={7}
                                            />
                                            <div className="relative w-10 h-8 shrink-0 rounded border overflow-hidden">
                                                <input
                                                    type="color"
                                                    value={colors[key]}
                                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                                    disabled={!isCustom}
                                                    className="absolute inset-0 w-full h-full cursor-pointer scale-150 disabled:cursor-not-allowed disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CONFIGURACIÓN DE PUBLICACIÓN */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/80" />
                            <CardTitle>Planificación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="order"
                                    label="Orden de aparición"
                                    tooltip="Índice numérico para organizar la prioridad en el carrusel (menor número primero)."
                                />
                                <Input
                                    name="order"
                                    type="number"
                                    min="0"
                                    defaultValue={initialData?.order ?? 0}
                                    className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="schedule.startsAt"
                                    label="Vigente desde"
                                    tooltip="Fecha y hora automatizada para que el banner se vuelva visible en el storefront."
                                />
                                <Input
                                    name="schedule.startsAt"
                                    type="datetime-local"
                                    defaultValue={toDatetimeLocal(initialData?.schedule?.startsAt)}
                                    className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="schedule.endsAt"
                                    label="Vigente hasta"
                                    tooltip="Fecha y hora automatizada en la que el banner expira y deja de renderizarse."
                                />
                                <Input
                                    name="schedule.endsAt"
                                    type="datetime-local"
                                    defaultValue={toDatetimeLocal(initialData?.schedule?.endsAt)}
                                    className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("schedule.endsAt") ? "border-destructive" : "border-border/40"}`}
                                />
                                {err("schedule.endsAt") && (
                                    <p className="text-[10px] text-destructive">{err("schedule.endsAt")}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                <LabelWithTooltip
                                    htmlFor="isActive"
                                    label="Estado Activo"
                                    tooltip="Interruptor maestro global para habilitar o deshabilitar temporalmente el banner."
                                />
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    value="true"
                                    defaultChecked={initialData?.isActive ?? true}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}