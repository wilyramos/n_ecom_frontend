"use client";

// Campo de formulario de medios: muestra la selección, permite quitar elementos y
// serializa las URLs como inputs ocultos (`name`) para que la Server Action las lea con getAll().

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "./MediaPicker";
import { MediaThumb } from "./MediaPicker";
import type { MediaFolder, MediaKind } from "../types";

export interface MediaPickerFieldProps {
    /** Nombre de los inputs ocultos. Ej: "videos[]" para leer con formData.getAll("videos[]"). */
    name: string;
    kind: MediaKind;
    folder: MediaFolder;
    max: number;
    value: string[];
    onChange: (urls: string[]) => void;
    label?: string;
    helpText?: string;
    emptyText?: string;
    /**
     * Para campos de selección simple (ej. "logo", "image"): emite un input vacío cuando
     * no hay selección, así el servidor distingue "quitar" de "no enviado".
     */
    emitEmpty?: boolean;
}

export function MediaPickerField({
    name,
    kind,
    folder,
    max,
    value,
    onChange,
    label,
    helpText,
    emptyText,
    emitEmpty = false,
}: MediaPickerFieldProps) {
    const remove = (url: string) => onChange(value.filter((u) => u !== url));
    const kindLabel = kind === "video" ? "video" : "imagen";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <div>
                    {label && <p className="text-xs font-semibold text-zinc-700">{label}</p>}
                    <p className="text-[11px] text-zinc-500">
                        {value.length} / {max} {kindLabel}
                        {max > 1 ? "s" : ""}
                        {helpText ? ` · ${helpText}` : ""}
                    </p>
                </div>
                <MediaPicker
                    kind={kind}
                    folder={folder}
                    max={max}
                    value={value}
                    onChange={onChange}
                    trigger={
                        <Button type="button" variant="outline" size="sm">
                            {value.length === 0 ? "Seleccionar" : "Administrar"}
                        </Button>
                    }
                />
            </div>

            {value.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/60 p-4 text-center text-xs text-zinc-500">
                    {emptyText ?? `Sin ${kind === "video" ? "videos" : "imágenes"} asociados`}
                </p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {value.map((url) => (
                        <div key={url} className="group relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-white">
                            <MediaThumb item={{ kind, url, posterUrl: undefined, originalName: url }} />
                            <button
                                type="button"
                                onClick={() => remove(url)}
                                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                                aria-label="Quitar"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {value.map((url) => (
                <input key={url} type="hidden" name={name} value={url} />
            ))}
            {emitEmpty && value.length === 0 && <input type="hidden" name={name} value="" />}
        </div>
    );
}
