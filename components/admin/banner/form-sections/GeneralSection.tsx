"use client";

import { useState } from "react";
import { Info, ImageIcon, Link as LinkIcon } from "lucide-react";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SliderObjectFitEnum, type SliderBanner } from "@/src/schemas/slider.schema";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";

interface SectionProps {
    initialData?:  SliderBanner;
    fields?:       Record<string, string>;
    fieldErrors?:  Record<string, string[]>;
}

export default function GeneralSection({ initialData, fields, fieldErrors }: SectionProps) {
    const [availableImages, setAvailableImages] = useState<string[]>(
        initialData?.media?.imageUrl ? [initialData.media.imageUrl] : []
    );
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
        fields?.["media.imageUrl"] || initialData?.media?.imageUrl || ""
    );

    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

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

    return (
        <div className="space-y-6">
            {/* ── Información General ───────────────────────────────────── */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">

                    {/* Nombre interno */}
                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="name"
                            label="Nombre interno"
                            tooltip="Identificador del banner en el panel de administración."
                        />
                        <Input
                            name="name"
                            defaultValue={val("name", initialData?.name)}
                            placeholder="Ej: Hero Verano 2025"
                            className={`h-10 text-xs bg-background-secondary border ${err("name") ? "border-destructive" : "border-border/40"} rounded-sm`}
                        />
                        {err("name") && <p className="text-[10px] text-destructive">{err("name")}</p>}
                    </div>

                    {/* Tags */}
                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="tags"
                            label="Tags"
                            tooltip="Etiquetas separadas por coma para filtrar en el admin."
                        />
                        <Input
                            name="tags"
                            defaultValue={val("tags", initialData?.tags?.join(", "))}
                            placeholder="verano, promo, hero"
                            className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>

                    {/* Título / Subtítulo */}
                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="title" label="Título Principal" tooltip="Texto principal del banner." />
                        <Input
                            name="title"
                            defaultValue={val("title", initialData?.title)}
                            className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="subtitle" label="Subtítulo" tooltip="Texto secundario opcional." />
                            <Input
                                name="subtitle"
                                defaultValue={val("subtitle", initialData?.subtitle)}
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="destUrl" label="URL de Destino" tooltip="Enlace al hacer clic. Opcional." />
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    name="destUrl"
                                    defaultValue={val("destUrl", initialData?.destUrl)}
                                    placeholder="/productos/slug..."
                                    className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Abrir en nueva pestaña */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="openInNewTab"
                            value="true"
                            defaultChecked={initialData?.openInNewTab ?? false}
                            className="w-4 h-4 accent-blue-600"
                        />
                        <Label className="text-xs">Abrir enlace en nueva pestaña</Label>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="description" label="Descripción" tooltip="Texto descriptivo opcional." />
                        <Textarea
                            name="description"
                            defaultValue={val("description", initialData?.description)}
                            rows={2}
                            className="text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>

                    {/* Términos y condiciones */}
                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="terms" label="Términos y condiciones" tooltip="Letra pequeña / T&C." />
                        <Textarea
                            name="terms"
                            defaultValue={val("terms", initialData?.terms)}
                            rows={2}
                            placeholder="*Oferta válida hasta agotar stock..."
                            className="text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ── Multimedia ────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <CardTitle>Multimedia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input type="hidden" name="media.imageUrl" value={selectedImageUrl} />

                    {/* Selector de imagen */}
                    <div className="items-end gap-3 p-3 border border-border/40 bg-background-secondary/20 rounded-sm flex justify-between">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs font-bold text-foreground">URL Imagen</Label>
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

                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="media.altText" label="Texto Alternativo (Alt)" tooltip="Descripción para accesibilidad." />
                        <Input
                            name="media.altText"
                            defaultValue={val("media.altText", initialData?.media?.altText)}
                            className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="media.videoUrl" label="URL Video" tooltip="URL para video opcional." />
                            <Input
                                name="media.videoUrl"
                                defaultValue={val("media.videoUrl", initialData?.media?.videoUrl)}
                                placeholder="https://..."
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="media.videoPoster" label="Poster del Video" tooltip="Miniatura para el video." />
                            <Input
                                name="media.videoPoster"
                                defaultValue={val("media.videoPoster", initialData?.media?.videoPoster)}
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-foreground">Object Fit</Label>
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
                </CardContent>
            </Card>
        </div>
    );
}