"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import {
    TAdvertisement,
    AD_LAYOUT_LABELS,
    AdLayout,
} from "@/src/schemas/advertisement.schema";
import { AdFormActionState } from "@/actions/advertisement-actions";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MediaLibraryDialog from "../products/MediaLibraryDialog";
import Image from "next/image";

interface AdvertisementFormUIProps {
    formAction: (payload: FormData) => void;
    state: AdFormActionState;
    isPending: boolean;
    initialData?: TAdvertisement;
    titleLabel: string;
    subtitleLabel: string;
    initialImagesPool?: string[];
}

const AD_LAYOUT_DESCRIPTIONS: Record<AdLayout, string> = {
    top_bar:     "Barra superior fija. Útil para cupones de descuento rápidos o avisos globales de envío gratis.",
    modal_popup: "Modal emergente visual. Requiere obligatoriamente cargar una imagen de banner publicitario.",
};

function Required() {
    return <span className="text-destructive ml-0.5">*</span>;
}

function Field({
    label,
    required,
    error,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
                {label}{required && <Required />}
            </label>
            {children}
            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
            {error && (
                <p className="flex items-center gap-1 text-xs text-destructive font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

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
    const submitted  = state.submitted;

    const [adLayout, setAdLayout] = useState<AdLayout>(
        (submitted?.layout as AdLayout) ?? initialData?.layout ?? "top_bar"
    );
    const [isActive, setIsActive] = useState<boolean>(
        submitted?.isActive !== undefined
            ? Boolean(submitted.isActive)
            : (initialData?.isActive ?? true)
    );
    const [imageUrl, setImageUrl] = useState<string>(
        submitted?.imageUrl ?? initialData?.imageUrl ?? ""
    );
    const [allImages, setAllImages] = useState<string[]>(initialImagesPool);

    const errorCountRef = useRef(0);
    const [formKey, setFormKey]     = useState(0);

    // Restaura el estado controlado cuando el servidor devuelve errores de validación
    useEffect(() => {
        if (!state.ok && state.fields) {
            errorCountRef.current += 1;
            setFormKey(errorCountRef.current);
            setAdLayout((state.submitted?.layout as AdLayout) ?? initialData?.layout ?? "top_bar");
            setIsActive(
                state.submitted?.isActive !== undefined
                    ? Boolean(state.submitted.isActive)
                    : (initialData?.isActive ?? true)
            );
            setImageUrl(state.submitted?.imageUrl ?? initialData?.imageUrl ?? "");
        }
    // state.ok y state.fields son suficientes para detectar el cambio de ronda
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.ok, state.fields]);

    // Valores derivados para campos no controlados — priorizan submitted sobre initialData
    const resolvedTitle    = submitted?.title    ?? initialData?.title    ?? "";
    const resolvedSubtitle = submitted?.subtitle ?? initialData?.subtitle ?? "";
    const resolvedLinkTo   = submitted?.linkTo   ?? initialData?.linkTo   ?? "";

    // formatDateForInput normaliza tanto strings ISO completos como instancias Date
    // al formato "YYYY-MM-DDTHH:mm" que espera datetime-local
    const resolvedStartDate = formatDateForInput(submitted?.startDate ?? initialData?.startDate);
    const resolvedEndDate   = formatDateForInput(submitted?.endDate   ?? initialData?.endDate);

    const hasErrors = !!state.fields && Object.keys(state.fields).length > 0;

    return (
        <form
            key={formKey}
            action={formAction}
            className="space-y-5 max-w-5xl mx-auto text-foreground"
        >
            {/* Campos ocultos para valores de estado controlado */}
            <input type="hidden" name="isActive" value={String(isActive)} />
            <input type="hidden" name="imageUrl" value={imageUrl} />

            {/* ── Banner global de errores ── */}
            {hasErrors && (
                <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-destructive">
                            {state.error ?? "Hay campos con errores"}
                        </p>
                        <p className="text-xs text-destructive/80 mt-0.5">
                            Revisa los campos marcados a continuación y vuelve a intentarlo.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Barra superior de acciones ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/advertisements"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors border border-border bg-background"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h2 className="text-base font-bold text-foreground">{titleLabel}</h2>
                        {subtitleLabel.trim() && (
                            <p className="text-xs text-muted-foreground">{subtitleLabel}</p>
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 font-semibold"
                >
                    <Save className="w-4 h-4" />
                    {isPending ? "Procesando..." : isEditMode ? "Guardar Cambios" : "Crear Anuncio"}
                </Button>
            </div>

            {/* ── Layout principal ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* ── Columna principal ── */}
                <div className="md:col-span-2 space-y-5">
                    <section className="bg-background border border-border rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Configuración de Campaña
                            </h3>
                        </div>

                        <Field
                            label="Título o Nombre del Aviso"
                            required
                            error={state.fields?.title}
                            hint="Texto destacado o identificador principal del anuncio visible."
                        >
                            <Input
                                name="title"
                                defaultValue={resolvedTitle}
                                placeholder="Ej: ¡20% DE DESCUENTO EN TODA LA TIENDA!"
                                className={`h-10 text-sm bg-background/50 border-border/40 rounded-sm ${
                                    state.fields?.title
                                        ? "border-destructive/60 focus-visible:ring-destructive"
                                        : ""
                                }`}
                            />
                        </Field>

                        <Field
                            label="Subtítulo / Texto Secundario"
                            error={state.fields?.subtitle}
                            hint="Descripción complementaria opcional expuesta en el componente publicitario."
                        >
                            <Input
                                name="subtitle"
                                defaultValue={resolvedSubtitle}
                                placeholder="Ej: Usa el código GOPHONE20 al finalizar tu compra"
                                className="h-10 text-sm bg-background/50 border-border/40 rounded-sm"
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field
                                label="Formato de Renderizado (Layout)"
                                required
                                error={state.fields?.layout}
                                hint={AD_LAYOUT_DESCRIPTIONS[adLayout]}
                            >
                                <select
                                    name="layout"
                                    value={adLayout}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setAdLayout(e.target.value as AdLayout)
                                    }
                                    className="w-full bg-background border border-input rounded-sm h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                                >
                                    {Object.entries(AD_LAYOUT_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field
                                label="Enlace / Ruta de Redirección"
                                error={state.fields?.linkTo}
                                hint="Dirección interna a donde apunta el clic (Ej: /shop/cases)."
                            >
                                <Input
                                    name="linkTo"
                                    defaultValue={resolvedLinkTo}
                                    placeholder="Ej: /productos/iphone-15-pro"
                                    className="h-10 text-sm bg-background/50 border-border/40 rounded-sm"
                                />
                            </Field>
                        </div>

                        <Field
                            label="Imagen Publicitaria Multimedia"
                            error={state.fields?.imageUrl}
                            required={adLayout === "modal_popup"}
                            hint="Obligatoria para ventanas emergentes, opcional para barras horizontales superiores."
                        >
                            <div className="flex flex-col gap-2">
                                {imageUrl && (
                                    <div className="relative w-full aspect-video max-w-sm rounded-md overflow-hidden border border-border bg-muted/20">
                                        <Image
                                            src={imageUrl}
                                            alt="Vista previa del banner"
                                            className="w-full h-full object-cover"
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <MediaLibraryDialog
                                    selectedImages={imageUrl ? [imageUrl] : []}
                                    globalImagesPool={allImages}
                                    allowMultiple={false}
                                    triggerLabel={imageUrl ? "Cambiar imagen publicitaria" : "Seleccionar imagen publicitaria"}
                                    triggerVariant="outline"
                                    onConfirmSelection={(urls) => setImageUrl(urls[0] ?? "")}
                                    onUploadSuccess={(newImages) =>
                                        setAllImages((prev) => [...prev, ...newImages])
                                    }
                                />
                            </div>
                        </Field>
                    </section>
                </div>

                {/* ── Columna lateral ── */}
                <div className="space-y-5">
                    <section className="bg-background border border-border rounded-xl p-5 space-y-4">
                        <div className="border-b border-border pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Control de Visibilidad y Fechas
                            </h3>
                        </div>

                        {/* Toggle de visibilidad accesible */}
                        <div
                            role="switch"
                            aria-checked={isActive}
                            tabIndex={0}
                            onClick={() => setIsActive(!isActive)}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") {
                                    e.preventDefault();
                                    setIsActive(!isActive);
                                }
                            }}
                            className={`flex items-center justify-between rounded-lg px-3.5 py-3 cursor-pointer border transition-colors select-none ${
                                isActive
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-muted/30 border-border"
                            }`}
                        >
                            <div>
                                <p className={`text-sm font-semibold ${
                                    isActive
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-muted-foreground"
                                }`}>
                                    {isActive ? "Campaña Habilitada" : "Campaña Pausada"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {isActive
                                        ? "El anuncio se procesará dinámicamente"
                                        : "Forzar apagado manual permanente"}
                                </p>
                            </div>
                            <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                                isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
                            }`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    isActive ? "translate-x-4" : "translate-x-0"
                                }`} />
                            </div>
                        </div>

                        <Field
                            label="Fecha de Inicio (Programación)"
                            error={state.fields?.startDate}
                            hint="Dejar vacío si deseas que empiece a mostrarse de forma inmediata."
                        >
                            <Input
                                type="datetime-local"
                                name="startDate"
                                defaultValue={resolvedStartDate}
                                className="h-10 text-sm bg-background/50 border-border/40 rounded-sm"
                            />
                        </Field>

                        <Field
                            label="Fecha de Expiración (Vencimiento)"
                            error={state.fields?.endDate}
                            hint="Al cumplirse el plazo, el anuncio se retirará del storefront automáticamente."
                        >
                            <Input
                                type="datetime-local"
                                name="endDate"
                                defaultValue={resolvedEndDate}
                                className="h-10 text-sm bg-background/50 border-border/40 rounded-sm"
                            />
                        </Field>
                    </section>

                    {/* ── Card: Resumen informativo (solo edición) ── */}
                    {isEditMode && initialData && (
                        <section className="bg-background border border-border rounded-xl p-5 space-y-3 shadow-2xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                                Resumen Informativo
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID Interno</span>
                                    <span className="font-mono text-foreground break-all max-w-[150px] text-right">
                                        {initialData._id}
                                    </span>
                                </div>
                                {initialData.updatedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Actualizado</span>
                                        <span className="text-foreground font-medium">
                                            {new Date(initialData.updatedAt).toLocaleDateString("es-PE", {
                                                day:    "2-digit",
                                                month:  "short",
                                                year:   "numeric",
                                                hour:   "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </form>
    );
}