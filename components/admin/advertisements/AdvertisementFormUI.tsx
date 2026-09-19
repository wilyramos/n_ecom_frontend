// File: frontend/components/admin/advertisements/AdvertisementFormUI.tsx
"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";

import {
    TAdvertisement,
    AD_LAYOUT_LABELS,
    AdLayout,
} from "@/src/schemas/advertisement.schema";
import { AdFormActionState } from "@/actions/advertisement-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaLibraryDialog from "../products/MediaLibraryDialog";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";

interface AdvertisementFormUIProps {
    formAction: (payload: FormData) => void;
    state: AdFormActionState;
    isPending: boolean;
    initialData?: TAdvertisement;
    titleLabel: string;
    subtitleLabel?: string;
    initialImagesPool?: string[];
}

type AdvertisementSubmittedState = Partial<TAdvertisement> & {
    showTitle?: boolean | string;
};

const AD_LAYOUT_DESCRIPTIONS: Record<AdLayout, string> = {
    top_bar: "Barra superior fija. Ideal para avisos breves, cupones o promociones de envío.",
    modal_popup: "Modal emergente visual (proporción 4:5 vertical). Requiere cargar una imagen de banner obligatoria.",
};

const formatDateForInput = (dateInput: unknown): string => {
    if (!dateInput) return "";
    const d = new Date(dateInput as string | Date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
};

export default function AdvertisementFormUI({
    formAction,
    state,
    isPending,
    initialData,
    titleLabel,
    subtitleLabel,
    initialImagesPool = [],
}: AdvertisementFormUIProps) {
    const isEditMode = !!initialData;
    const submitted = state.submitted as AdvertisementSubmittedState | undefined;

    const [adLayout, setAdLayout] = useState<AdLayout>(
        (submitted?.layout as AdLayout) ?? initialData?.layout ?? "top_bar"
    );
    const [isActive, setIsActive] = useState<boolean>(
        submitted?.isActive !== undefined
            ? Boolean(submitted.isActive)
            : (initialData?.isActive ?? true)
    );
    const [showTitle, setShowTitle] = useState<boolean>(
        submitted?.showTitle !== undefined
            ? Boolean(submitted.showTitle)
            : (initialData?.showTitle ?? true)
    );
    const [imageUrl, setImageUrl] = useState<string>(
        submitted?.imageUrl ?? initialData?.imageUrl ?? ""
    );
    const [allImages, setAllImages] = useState<string[]>(initialImagesPool);

    const errorCountRef = useRef(0);
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        if (!state.ok && state.fields) {
            errorCountRef.current += 1;
            setFormKey(errorCountRef.current);
            setAdLayout((submitted?.layout as AdLayout) ?? initialData?.layout ?? "top_bar");
            setIsActive(
                submitted?.isActive !== undefined
                    ? Boolean(submitted.isActive)
                    : (initialData?.isActive ?? true)
            );
            setShowTitle(
                submitted?.showTitle !== undefined
                    ? Boolean(submitted.showTitle)
                    : (initialData?.showTitle ?? true)
            );
            setImageUrl(submitted?.imageUrl ?? initialData?.imageUrl ?? "");
        }
    }, [state.ok, state.fields, submitted, initialData]);

    const resolvedTitle = submitted?.title ?? initialData?.title ?? "";
    const resolvedSubtitle = submitted?.subtitle ?? initialData?.subtitle ?? "";
    const resolvedLinkTo = submitted?.linkTo ?? initialData?.linkTo ?? "";
    const resolvedStartDate = formatDateForInput(submitted?.startDate ?? initialData?.startDate);
    const resolvedEndDate = formatDateForInput(submitted?.endDate ?? initialData?.endDate);

    const hasErrors = !!state.fields && Object.keys(state.fields).length > 0;

    return (
        <form
            key={formKey}
            action={formAction}
            className="w-full space-y-4 pb-20"
            noValidate
        >
            <input type="hidden" name="isActive" value={String(isActive)} />
            <input type="hidden" name="showTitle" value={String(showTitle)} />
            <input type="hidden" name="imageUrl" value={imageUrl} />

            {/* Barra de cabecera con botón de retorno */}
            <AdminActionBar
                leftContent={
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900">{titleLabel}</span>
                        {subtitleLabel && <span className="text-[11px] text-zinc-500">{subtitleLabel}</span>}
                    </div>
                }
            >
                <Link
                    href="/admin/advertisements"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Volver al listado</span>
                </Link>
            </AdminActionBar>

            {hasErrors && (
                <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-rose-800">
                            {state.error ?? "Hay campos con errores"}
                        </p>
                        <p className="text-[11px] text-rose-600 mt-0.5">
                            Revisa los campos indicados e inténtalo nuevamente.
                        </p>
                    </div>
                </div>
            )}

            {/* Grid de Contenido */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                {/* Columna Principal */}
                <div className="lg:col-span-8 space-y-3">
                    <AdminCardWrapper padding="default">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                            Contenido del Anuncio
                        </h3>

                        <div className="space-y-3">
                            {/* Título y Checkbox de Visibilidad */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="title" className="text-xs font-semibold text-zinc-700">
                                        Título o Nombre Interno <span className="text-zinc-400 font-normal">(Opcional)</span>
                                    </Label>
                                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={showTitle}
                                            onChange={(e) => setShowTitle(e.target.checked)}
                                            className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                                        />
                                        <span className="text-[11.5px] font-medium text-zinc-600">
                                            Mostrar título en el banner
                                        </span>
                                    </label>
                                </div>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={resolvedTitle}
                                    placeholder="Ej: 20% DE DESCUENTO EN TODA LA TIENDA"
                                    className="h-8 text-xs font-medium"
                                />
                                <p className="text-[10.5px] text-zinc-400">
                                    {showTitle
                                        ? "El texto se mostrará como encabezado en la tienda."
                                        : "El texto solo se usará como referencia interna en el panel."}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="subtitle" className="text-xs font-semibold text-zinc-700">
                                    Subtítulo / Texto Secundario
                                </Label>
                                <Input
                                    id="subtitle"
                                    name="subtitle"
                                    defaultValue={resolvedSubtitle}
                                    placeholder="Ej: Usa el cupón VERANO20 al pagar"
                                    className="h-8 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="layout" className="text-xs font-semibold text-zinc-700">
                                        Formato (Layout) <span className="text-rose-600">*</span>
                                    </Label>
                                    <select
                                        id="layout"
                                        name="layout"
                                        value={adLayout}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            setAdLayout(e.target.value as AdLayout)
                                        }
                                        className="w-full bg-white border border-zinc-200 rounded-md h-8 px-2.5 text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-400 cursor-pointer"
                                    >
                                        {Object.entries(AD_LAYOUT_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[10.5px] text-zinc-400">{AD_LAYOUT_DESCRIPTIONS[adLayout]}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="linkTo" className="text-xs font-semibold text-zinc-700">
                                        Ruta de Redirección (URL)
                                    </Label>
                                    <Input
                                        id="linkTo"
                                        name="linkTo"
                                        defaultValue={resolvedLinkTo}
                                        placeholder="Ej: /productos/ofertas"
                                        className="h-8 text-xs font-medium"
                                    />
                                </div>
                            </div>

                            {/* Imagen Publicitaria */}
                            <div className="space-y-2 pt-2 border-t border-zinc-100">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-semibold text-zinc-700">
                                            Imagen Publicitaria {adLayout === "modal_popup" && <span className="text-rose-600">*</span>}
                                        </Label>
                                        <p className="text-[10.5px] text-zinc-400">
                                            {adLayout === "modal_popup"
                                                ? "El modal presentará la imagen en proporción vertical 4:5 (ej: 1080x1350 px)."
                                                : "Visualización en proporción 4:5."}
                                        </p>
                                    </div>
                                    <MediaLibraryDialog
                                        selectedImages={imageUrl ? [imageUrl] : []}
                                        globalImagesPool={allImages}
                                        allowMultiple={false}
                                        triggerLabel={imageUrl ? "Cambiar Imagen" : "Subir / Seleccionar Imagen"}
                                        onConfirmSelection={(urls) => setImageUrl(urls[0] ?? "")}
                                        onUploadSuccess={(newImages) =>
                                            setAllImages((prev) => [...prev, ...newImages])
                                        }
                                    />
                                </div>

                                {imageUrl ? (
                                    <div className="relative w-full max-w-[240px] aspect-[4/5] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shadow-xs">
                                        <Image
                                            src={imageUrl}
                                            alt="Preview del anuncio (proporción 4:5)"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9.5px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                                            4:5
                                        </span>
                                    </div>
                                ) : (
                                    <div className="p-5 border border-dashed border-zinc-200 rounded-lg bg-zinc-50/50 text-center space-y-1">
                                        <p className="text-xs text-zinc-500">Sin imagen seleccionada</p>
                                        <p className="text-[10.5px] text-zinc-400">Recomendado: proporción 4:5 (ej: 800x1000 px)</p>
                                    </div>
                                )}
                                {state.fields?.imageUrl && (
                                    <p className="text-[11px] text-rose-600">{state.fields.imageUrl}</p>
                                )}
                            </div>
                        </div>
                    </AdminCardWrapper>
                </div>

                {/* Columna Lateral */}
                <aside className="lg:col-span-4 space-y-3 lg:sticky lg:top-18">
                    <AdminCardWrapper padding="default">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 pb-2.5 border-b border-zinc-100 mb-3">
                            Programación y Estado
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <p className="text-xs font-medium text-zinc-800">Campaña Habilitada</p>
                                    <p className="text-[10.5px] text-zinc-400">Control manual de encendido</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 accent-zinc-900 rounded cursor-pointer"
                                />
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                                <Label htmlFor="startDate" className="text-xs font-semibold text-zinc-700">
                                    Fecha de Inicio (Opcional)
                                </Label>
                                <Input
                                    type="datetime-local"
                                    id="startDate"
                                    name="startDate"
                                    defaultValue={resolvedStartDate}
                                    className="h-8 text-xs font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="endDate" className="text-xs font-semibold text-zinc-700">
                                    Fecha de Expiración (Opcional)
                                </Label>
                                <Input
                                    type="datetime-local"
                                    id="endDate"
                                    name="endDate"
                                    defaultValue={resolvedEndDate}
                                    className="h-8 text-xs font-medium"
                                />
                                {state.fields?.endDate && (
                                    <p className="text-[11px] text-rose-600">{state.fields.endDate}</p>
                                )}
                            </div>
                        </div>
                    </AdminCardWrapper>
                </aside>
            </div>

            {/* Barra de Guardado Inferior Fija a Todo el Ancho */}
            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white backdrop-blur-md px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all">
                <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">
                            {isEditMode ? "Modificaciones listas para guardar" : "Nueva campaña lista para registrar"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto">
                        <Link
                            href="/admin/advertisements"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>{isEditMode ? "Guardar Cambios" : "Crear Anuncio"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}