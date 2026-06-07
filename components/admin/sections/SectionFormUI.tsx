"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import {
    SectionResponse,
    SECTION_TYPE_LABELS,
    SectionType,
    SectionBlock,
} from "@/src/schemas/section.schema";
import { FormActionState } from "@/actions/section-action";
import { Plus, Trash2, Save, ArrowLeft, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MediaLibraryDialog from "../products/MediaLibraryDialog";
import Image from "next/image";

interface LocalBlockState {
    title: string;
    subtitle: string;
    imageUrl: string;
    linkTo: string;
    productId: string;
}

interface SectionFormUIProps {
    formAction: (payload: FormData) => void;
    state: FormActionState;
    isPending: boolean;
    initialData?: SectionResponse;
    titleLabel: string;
    subtitleLabel: string;
}

const SECTION_TYPE_DESCRIPTIONS: Record<SectionType, string> = {
    featured_collections: "Bloques de imagen con enlace. Ideal para destacar categorías o campañas visuales.",
    product_grid: "Cuadrícula de productos vinculados por ID. Requiere al menos un bloque con productId.",
    rich_text: "Contenido editorial libre. No utiliza bloques; usa el campo de cuerpo de texto.",
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

export default function SectionFormUI({
    formAction,
    state,
    isPending,
    initialData,
    titleLabel,
    subtitleLabel,
}: SectionFormUIProps) {
    const isEditMode = !!initialData;
    const submitted = state.submitted;

    const resolveBlocks = (): LocalBlockState[] => {
        const source = submitted?.blocks ?? initialData?.blocks;
        return (
            (source as SectionBlock[] | undefined)?.map((b) => ({
                title: b.title ?? "",
                subtitle: b.subtitle ?? "",
                imageUrl: b.imageUrl ?? "",
                linkTo: b.linkTo ?? "",
                productId: typeof b.productId === "object" && b.productId
                    ? b.productId._id
                    : (b.productId ?? ""),
            })) ?? []
        );
    };

    const [blocks, setBlocks] = useState<LocalBlockState[]>(resolveBlocks);
    const [sectionType, setSectionType] = useState<SectionType>(
        (submitted?.type as SectionType) ?? (initialData?.type as SectionType) ?? "product_grid"
    );
    const [isActive, setIsActive] = useState<boolean>(
        submitted?.isActive !== undefined
            ? Boolean(submitted.isActive)
            : (initialData?.isActive ?? true)
    );

    const errorCountRef = useRef(0);
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        if (state.fields && !state.ok) {
            errorCountRef.current += 1;
            setFormKey(errorCountRef.current);
            setBlocks(resolveBlocks());
            setSectionType(
                (submitted?.type as SectionType) ??
                (initialData?.type as SectionType) ??
                "product_grid"
            );
            setIsActive(
                submitted?.isActive !== undefined
                    ? Boolean(submitted.isActive)
                    : (initialData?.isActive ?? true)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const handleAddBlock = () => {
        setBlocks((prev) => [...prev, { title: "", subtitle: "", imageUrl: "", linkTo: "", productId: "" }]);
    };

    const handleRemoveBlock = (i: number) => {
        setBlocks((prev) => prev.filter((_, idx) => idx !== i));
    };

    const handleBlockChange = (i: number, field: keyof LocalBlockState, value: string) => {
        setBlocks((prev) => {
            const updated = [...prev];
            updated[i] = { ...updated[i], [field]: value };
            return updated;
        });
    };

    const resolvedTitle = (submitted?.title as string) ?? initialData?.title ?? "";
    const resolvedGridColumns = (submitted?.settings as { gridColumns?: number } | undefined)?.gridColumns
        ?? initialData?.settings?.gridColumns ?? 4;
    const resolvedBodyText = (submitted?.settings as { bodyText?: string } | undefined)?.bodyText
        ?? initialData?.settings?.bodyText ?? "";
    const resolvedOrder = (submitted?.order as number) ?? initialData?.order ?? 0;

    const hasErrors = state.fields && Object.keys(state.fields).length > 0;
    const [allImages, setAllImages] = useState<string[]>([]);
    return (
        <form
            key={formKey}
            action={formAction}
            className="space-y-5 max-w-5xl mx-auto text-foreground"
        >
            <input type="hidden" name="blocksData" value={JSON.stringify(blocks)} />
            <input type="hidden" name="isActive" value={String(isActive)} />

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
                        href="/admin/sections"
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
                    {isPending ? "Procesando..." : isEditMode ? "Guardar Cambios" : "Crear Sección"}
                </Button>
            </div>

            {/* ── Layout principal ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Columna principal */}
                <div className="md:col-span-2 space-y-5">

                    {/* Card: Identificación */}
                    <section className="bg-background border border-border rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Identificación
                            </h3>
                        </div>

                        <Field
                            label="Título Interno"
                            required
                            error={state.fields?.title}
                            hint="Nombre de referencia para el panel de administración. No se muestra en tienda."
                        >
                            <Input
                                name="title"
                                defaultValue={resolvedTitle}
                                placeholder="Ej: Categorías populares — Verano 2025"
                                className={`h-10 text-sm bg-background/50 border-border/40 rounded-sm ${state.fields?.title ? "border-destructive/60 focus-visible:ring-destructive" : ""}`}
                            />
                        </Field>

                        {/* Slug: solo lectura en edición, informativo en creación */}
                        <div className="flex items-start gap-2.5 bg-muted/30 border border-border rounded-lg px-3.5 py-3">
                            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="text-xs text-muted-foreground leading-relaxed">
                                {isEditMode
                                    ? <p>El slug <span className="font-mono font-semibold text-foreground">{initialData?.slug}</span> es inmutable tras la creación.</p>
                                    : <p>El slug identificador se genera automáticamente en el servidor desde el título (kebab-case). No es necesario ingresarlo.</p>
                                }
                            </div>
                        </div>
                    </section>

                    {/* Card: Configuración estructural */}
                    <section className="bg-background border border-border rounded-xl p-5 space-y-4">
                        <div className="border-b border-border pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Configuración Estructural
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field
                                label="Tipo de Sección"
                                required
                                error={state.fields?.type}
                                hint={SECTION_TYPE_DESCRIPTIONS[sectionType]}
                            >
                                {isEditMode && (
                                    <input type="hidden" name="type" value={sectionType} />
                                )}
                                <select
                                    name={isEditMode ? undefined : "type"}
                                    value={sectionType}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setSectionType(e.target.value as SectionType)
                                    }
                                    disabled={isEditMode}
                                    className="w-full bg-background border border-input rounded-sm h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60 transition-colors"
                                >
                                    {Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </Field>

                            {sectionType !== "rich_text" && (
                                <Field
                                    label="Columnas en Grilla"
                                    error={state.fields?.["settings.gridColumns"]}
                                    hint="Columnas visibles en pantallas de escritorio (1–6)."
                                >
                                    <Input
                                        type="number"
                                        name="settings.gridColumns"
                                        defaultValue={resolvedGridColumns}
                                        min={1}
                                        max={6}
                                        className="h-10 text-sm bg-background/50 border-border/40 rounded-sm"
                                    />
                                </Field>
                            )}
                        </div>

                        {sectionType === "rich_text" && (
                            <Field
                                label="Cuerpo de Texto"
                                required
                                error={state.fields?.["settings.bodyText"]}
                                hint="Acepta texto plano o HTML. Se renderizará directamente en el storefront."
                            >
                                <Textarea
                                    name="settings.bodyText"
                                    defaultValue={resolvedBodyText}
                                    rows={6}
                                    placeholder="<p>Contenido editorial o HTML...</p>"
                                    className={`text-sm bg-background/50 border-border/40 rounded-sm font-mono ${state.fields?.["settings.bodyText"] ? "border-destructive/60 focus-visible:ring-destructive" : ""}`}
                                />
                            </Field>
                        )}
                    </section>
                </div>

                {/* Columna lateral */}
                <div className="space-y-5">

                    {/* Card: Publicación */}
                    <section className="bg-background border border-border rounded-xl p-5 space-y-4">
                        <div className="border-b border-border pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Publicación
                            </h3>
                        </div>

                        {/* Toggle de visibilidad */}
                        <div
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center justify-between rounded-lg px-3.5 py-3 cursor-pointer border transition-colors ${isActive
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : "bg-muted/30 border-border"
                                }`}
                        >
                            <div>
                                <p className={`text-sm font-semibold ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                                    {isActive ? "Visible en tienda" : "Oculta al público"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {isActive ? "Se muestra en el storefront" : "No aparece en el storefront"}
                                </p>
                            </div>
                            <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${isActive ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-0"}`} />
                            </div>
                        </div>

                        <Field
                            label="Orden de Prioridad"
                            error={state.fields?.order}
                            hint="Menor número = aparece primero. Usa 0 por defecto."
                        >
                            <Input
                                type="number"
                                name="order"
                                defaultValue={resolvedOrder}
                                min={0}
                                className="h-10 text-sm bg-background/50 border-border/40 rounded-sm"
                            />
                        </Field>
                    </section>

                    {/* Card: Resumen */}
                    {isEditMode && initialData && (
                        <section className="bg-background border border-border rounded-xl p-5 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                                Resumen
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Slug</span>
                                    <span className="font-mono text-foreground">{initialData.slug}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bloques</span>
                                    <span className="font-semibold text-foreground">{blocks.length}</span>
                                </div>
                                {initialData.updatedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Actualizado</span>
                                        <span className="text-foreground">
                                            {new Date(initialData.updatedAt).toLocaleDateString("es-PE", {
                                                day: "2-digit", month: "short", year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* ── Bloques de contenido ── */}
            {sectionType !== "rich_text" && (
                <section className="bg-background border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Bloques de Contenido
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {sectionType === "product_grid"
                                    ? "Cada bloque vincula un producto por su ID de MongoDB."
                                    : "Cada bloque es una tarjeta de imagen con enlace de destino."
                                }
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddBlock}
                            className="flex items-center gap-1.5 border border-border text-xs h-8 rounded-sm font-semibold bg-muted/40 hover:bg-muted/80"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Añadir bloque
                        </Button>
                    </div>

                    {blocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 border border-dashed border-border rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground/60">
                                Sin bloques aún.
                            </p>
                            <button
                                type="button"
                                onClick={handleAddBlock}
                                className="text-xs text-primary underline underline-offset-2 hover:no-underline"
                            >
                                Añadir el primer bloque
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {blocks.map((block, index) => (
                                <div
                                    key={index}
                                    className="border border-border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-colors"
                                >
                                    {/* Cabecera del bloque */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Bloque #{index + 1}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveBlock(index)}
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>

                                    {/* Campos del bloque en grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">

                                        {/* Textos */}
                                        <div className="sm:col-span-3 flex flex-col gap-2">
                                            <Input
                                                value={block.title}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleBlockChange(index, "title", e.target.value)}
                                                placeholder="Título del bloque"
                                                className="h-9 text-xs bg-background border-border/40 rounded-sm"
                                            />
                                            <Input
                                                value={block.subtitle}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleBlockChange(index, "subtitle", e.target.value)}
                                                placeholder="Subtítulo o descripción corta"
                                                className="h-9 text-xs bg-background border-border/40 rounded-sm"
                                            />
                                        </div>

                                        {/* Imagen */}
                                        <div className="sm:col-span-3">
                                            <div className="flex flex-col gap-2">
                                                {block.imageUrl && (
                                                    <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border">
                                                        <Image
                                                            src={block.imageUrl}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            fill
                                                            unoptimized
                                                        />
                                                    </div>
                                                )}
                                                <MediaLibraryDialog
                                                    selectedImages={block.imageUrl ? [block.imageUrl] : []}
                                                    globalImagesPool={allImages}
                                                    allowMultiple={false}
                                                    triggerLabel={block.imageUrl ? "Cambiar imagen" : "Seleccionar imagen"}
                                                    triggerVariant="outline"
                                                    onConfirmSelection={(urls) => handleBlockChange(index, "imageUrl", urls[0] ?? "")}
                                                    onUploadSuccess={(newImages) => setAllImages(prev => [...prev, ...newImages])}
                                                />
                                            </div>
                                        </div>

                                        {/* Enlace */}
                                        <div className="sm:col-span-3 flex flex-col gap-1">
                                            <Input
                                                value={block.linkTo}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleBlockChange(index, "linkTo", e.target.value)}
                                                placeholder="Destino — /shop/categoria"
                                                className="h-9 text-xs bg-background border-border/40 rounded-sm"
                                            />
                                            {sectionType === "product_grid" && (
                                                <Input
                                                    value={block.productId}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleBlockChange(index, "productId", e.target.value)}
                                                    placeholder="ObjectId del producto"
                                                    className="h-9 text-xs bg-background border-border/40 rounded-sm font-mono"
                                                />
                                            )}
                                        </div>

                                        {/* productId para featured_collections (opcional) */}
                                        {sectionType === "featured_collections" && (
                                            <div className="sm:col-span-3">
                                                <Input
                                                    value={block.productId}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleBlockChange(index, "productId", e.target.value)}
                                                    placeholder="ID producto (opcional)"
                                                    className="h-9 text-xs bg-background border-border/40 rounded-sm font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Contador */}
                    {blocks.length > 0 && (
                        <p className="text-right text-xs text-muted-foreground">
                            {blocks.length} bloque{blocks.length !== 1 ? "s" : ""} configurado{blocks.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </section>
            )}
        </form>
    );
}