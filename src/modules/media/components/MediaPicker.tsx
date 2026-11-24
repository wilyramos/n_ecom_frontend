"use client";

// Selector reutilizable de medios: biblioteca paginada (búsqueda, orden, carpeta, tamaño de
// página) + subida. Controlado por `value` / `onChange` y devuelve URLs.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Film,
    Loader2,
    Search,
    UploadCloud,
    X,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { listMedia, uploadMedia } from "../media.client";
import {
    MEDIA_ACCEPT,
    MEDIA_CLIENT_LIMITS,
    type MediaFolder,
    type MediaKind,
    type MediaSort,
    type TMedia,
} from "../types";

export interface MediaPickerProps {
    kind: MediaKind;
    /** Carpeta por defecto para subir. El filtro de la biblioteca puede cambiarla. */
    folder: MediaFolder;
    /** Número máximo de elementos seleccionables. 1 = selección simple. */
    max: number;
    value: string[];
    onChange: (urls: string[]) => void;
    trigger?: ReactNode;
    title?: string;
    disabled?: boolean;
}

const PAGE_SIZES = [24, 48, 96] as const;

const FOLDER_OPTIONS: { value: MediaFolder | ""; label: string }[] = [
    { value: "", label: "Todas las carpetas" },
    { value: "products", label: "Productos" },
    { value: "categories", label: "Categorías" },
    { value: "brands", label: "Marcas" },
    { value: "collections", label: "Colecciones" },
    { value: "sliders", label: "Sliders" },
    { value: "sections", label: "Secciones" },
    { value: "advertisements", label: "Anuncios" },
    { value: "general", label: "General" },
];

const SORT_OPTIONS: { value: MediaSort; label: string }[] = [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "name", label: "Nombre (A-Z)" },
    { value: "size", label: "Tamaño (mayor)" },
];

const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Números de página con elipsis: 1 … 4 5 [6] 7 8 … 20 */
export function pageWindow(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push("…");
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push("…");
    pages.push(total);
    return pages;
}

export function MediaPicker({
    kind,
    folder,
    max,
    value,
    onChange,
    trigger,
    title,
    disabled = false,
}: MediaPickerProps) {
    const kindLabel = kind === "video" ? "videos" : "imágenes";
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<"library" | "upload">("library");

    // Filtros de la biblioteca
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sort, setSort] = useState<MediaSort>("newest");
    const [libraryFolder, setLibraryFolder] = useState<MediaFolder | "">("");
    const [pageSize, setPageSize] = useState<number>(24);
    const [page, setPage] = useState(1);

    // Datos
    const [items, setItems] = useState<TMedia[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string[]>(value);

    // Control de respuestas obsoletas: solo se muestra la última petición.
    const requestId = useRef(0);

    // Al abrir: selección actual y biblioteca desde la primera página.
    useEffect(() => {
        if (open) {
            setSelected(value);
            setView("library");
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Búsqueda con retardo: evita una petición por tecla.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchPage = useCallback(async () => {
        const id = ++requestId.current;
        setLoading(true);
        setLoadError(null);
        try {
            const data = await listMedia({
                kind,
                folder: libraryFolder || undefined,
                q: debouncedSearch || undefined,
                sort,
                page,
                limit: pageSize,
            });
            if (id !== requestId.current) return; // respuesta obsoleta
            setItems(data.items);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (error) {
            if (id !== requestId.current) return;
            const message = error instanceof Error ? error.message : "No se pudo cargar la biblioteca.";
            setLoadError(message);
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, [kind, libraryFolder, debouncedSearch, sort, page, pageSize]);

    useEffect(() => {
        if (!open || view !== "library") return;
        fetchPage();
    }, [open, view, fetchPage]);

    const changeFilter = <T,>(setter: (v: T) => void) => (v: T) => {
        setter(v);
        setPage(1);
    };

    const toggle = (url: string) => {
        if (selected.includes(url)) {
            setSelected(selected.filter((u) => u !== url));
            return;
        }
        if (max === 1) {
            setSelected([url]);
            return;
        }
        if (selected.length >= max) {
            toast.error(`Puedes seleccionar hasta ${max} ${kindLabel}.`);
            return;
        }
        setSelected([...selected, url]);
    };

    const addUrlsToSelection = (urls: string[]) => {
        setSelected((prev) => {
            const next = [...prev];
            for (const url of urls) {
                if (next.includes(url)) continue;
                if (max === 1) return [url];
                if (next.length >= max) break;
                next.push(url);
            }
            return next;
        });
    };

    const onDrop = useCallback(
        async (accepted: File[]) => {
            if (accepted.length === 0) return;
            setUploading(true);
            try {
                const results = await uploadMedia(accepted, folder);
                const ok = results.filter((r) => r.status !== "rejected" && r.media);
                addUrlsToSelection(ok.map((r) => r.media!.url));

                const created = results.filter((r) => r.status === "created").length;
                const reused = results.filter((r) => r.status === "reused").length;
                if (created) toast.success(`${created} archivo(s) subido(s).`);
                if (reused) toast.info(`${reused} ya estaba(n) en la biblioteca y se reutilizó(aron).`);
                results
                    .filter((r) => r.status === "rejected")
                    .forEach((r) => toast.error(`${r.originalName}: ${r.error ?? "no válido"}`));

                // Vuelve a la biblioteca mostrando lo recién subido.
                setView("library");
                setSearch("");
                setDebouncedSearch("");
                setSort("newest");
                setPage(1);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al subir los archivos.");
            } finally {
                setUploading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [folder, max]
    );

    const onDropRejected = useCallback(
        (rejections: FileRejection[]) => {
            rejections.forEach(({ file, errors }) => {
                const code = errors[0]?.code;
                if (code === "file-too-large") {
                    const limit = kind === "video" ? MEDIA_CLIENT_LIMITS.video : MEDIA_CLIENT_LIMITS.image;
                    toast.error(`"${file.name}" supera ${formatBytes(limit)}.`);
                } else if (code === "file-invalid-type") {
                    toast.error(`"${file.name}" no es un formato permitido.`);
                } else {
                    toast.error(`"${file.name}": ${errors[0]?.message ?? "archivo no válido"}`);
                }
            });
        },
        [kind]
    );

    const dropzone = useDropzone({
        onDrop,
        onDropRejected,
        accept: MEDIA_ACCEPT[kind],
        maxSize: kind === "video" ? MEDIA_CLIENT_LIMITS.video : MEDIA_CLIENT_LIMITS.image,
        maxFiles: MEDIA_CLIENT_LIMITS.maxFilesPerRequest,
        multiple: max !== 1,
        disabled: uploading,
    });

    const confirm = () => {
        onChange(selected);
        setOpen(false);
    };

    const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const lastItem = Math.min(page * pageSize, total);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={disabled}>
                {trigger ?? <Button type="button" variant="outline" size="sm">Seleccionar {kindLabel}</Button>}
            </DialogTrigger>

            <DialogContent className="flex h-[90vh] w-[96vw] max-w-6xl flex-col gap-3 p-4 sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>{title ?? `Biblioteca de ${kindLabel}`}</DialogTitle>
                    <DialogDescription>
                        Selecciona {max === 1 ? `una ${kind === "video" ? "video" : "imagen"}` : `hasta ${max} ${kindLabel}`}.
                        Los archivos ya existentes se reutilizan sin duplicarse.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-2 border-b pb-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={view === "library" ? "default" : "ghost"}
                        onClick={() => setView("library")}
                    >
                        Biblioteca{total > 0 && view === "library" ? ` (${total})` : ""}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={view === "upload" ? "default" : "ghost"}
                        onClick={() => setView("upload")}
                    >
                        <UploadCloud className="mr-1 h-3.5 w-3.5" /> Subir nuevo
                    </Button>
                </div>

                {view === "library" ? (
                    <>
                        {/* Barra de filtros */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative min-w-[220px] flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre, título o texto alternativo"
                                    className="pl-8 pr-8"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-2 top-2.5 text-zinc-400 hover:text-zinc-700"
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <NativeSelect
                                value={libraryFolder}
                                onChange={(e) => changeFilter(setLibraryFolder)(e.target.value as MediaFolder | "")}
                                className="w-44"
                                aria-label="Carpeta"
                            >
                                {FOLDER_OPTIONS.map((o) => (
                                    <option key={o.value || "all"} value={o.value}>{o.label}</option>
                                ))}
                            </NativeSelect>
                            <NativeSelect
                                value={sort}
                                onChange={(e) => changeFilter(setSort)(e.target.value as MediaSort)}
                                className="w-40"
                                aria-label="Ordenar"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </NativeSelect>
                            <NativeSelect
                                value={pageSize}
                                onChange={(e) => changeFilter(setPageSize)(Number(e.target.value))}
                                className="w-28"
                                aria-label="Elementos por página"
                            >
                                {PAGE_SIZES.map((n) => (
                                    <option key={n} value={n}>{n} por pág.</option>
                                ))}
                            </NativeSelect>
                        </div>

                        {/* Cuadrícula */}
                        <div className="relative min-h-0 flex-1 overflow-y-auto rounded-lg border border-zinc-100 bg-zinc-50/40 p-2">
                            {loading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                                </div>
                            )}

                            {loadError ? (
                                <div className="flex flex-col items-center gap-2 py-16 text-center">
                                    <p className="text-sm text-rose-600">{loadError}</p>
                                    <Button type="button" variant="outline" size="sm" onClick={() => fetchPage()}>
                                        Reintentar
                                    </Button>
                                </div>
                            ) : items.length === 0 && !loading ? (
                                <p className="py-16 text-center text-sm text-zinc-500">
                                    {debouncedSearch || libraryFolder
                                        ? "No hay resultados con esos filtros."
                                        : `Aún no hay ${kindLabel} en la biblioteca. Sube una en “Subir nuevo”.`}
                                </p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                                    {items.map((item) => {
                                        const isSelected = selected.includes(item.url);
                                        const order = selected.indexOf(item.url) + 1;
                                        return (
                                            <button
                                                key={item._id}
                                                type="button"
                                                onClick={() => toggle(item.url)}
                                                className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white text-left transition cursor-pointer ${
                                                    isSelected
                                                        ? "border-indigo-500 ring-2 ring-indigo-300"
                                                        : "border-zinc-200 hover:border-zinc-400"
                                                }`}
                                                title={`${item.title || item.originalName} · ${formatBytes(item.bytes)}`}
                                            >
                                                <div className="relative aspect-square w-full bg-zinc-50">
                                                    <MediaThumb item={item} />
                                                    {item.kind === "video" && (
                                                        <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                                                            <Film className="h-3 w-3" />
                                                            {item.duration ? `${Math.round(item.duration)}s` : "Video"}
                                                        </span>
                                                    )}
                                                    {isSelected && (
                                                        <span className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                            {max > 1 ? order : <CheckCircle2 className="h-3 w-3" />}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="truncate px-1.5 py-1 text-[11px] text-zinc-700">
                                                    {item.title || item.originalName}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Paginación */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs text-zinc-500">
                                {total === 0 ? "Sin resultados" : `Mostrando ${firstItem}–${lastItem} de ${total}`}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1 || loading}
                                    onClick={() => setPage(page - 1)}
                                    aria-label="Página anterior"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {pageWindow(page, totalPages).map((p, i) =>
                                    p === "…" ? (
                                        <span key={`gap-${i}`} className="px-1 text-xs text-zinc-400">…</span>
                                    ) : (
                                        <Button
                                            key={p}
                                            type="button"
                                            size="sm"
                                            variant={p === page ? "default" : "ghost"}
                                            disabled={loading}
                                            onClick={() => setPage(p)}
                                            className="min-w-8"
                                        >
                                            {p}
                                        </Button>
                                    )
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages || loading}
                                    onClick={() => setPage(page + 1)}
                                    aria-label="Página siguiente"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        {...dropzone.getRootProps()}
                        className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition ${
                            dropzone.isDragActive ? "border-indigo-500 bg-indigo-50" : "border-zinc-300 bg-zinc-50"
                        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
                    >
                        <input {...dropzone.getInputProps()} />
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                        ) : (
                            <UploadCloud className="h-8 w-8 text-zinc-500" />
                        )}
                        <p className="text-sm font-medium text-zinc-700">
                            {uploading ? "Subiendo…" : `Arrastra ${kindLabel} aquí o haz clic para elegir`}
                        </p>
                        <p className="text-xs text-zinc-500">
                            {kind === "video"
                                ? "MP4, MOV o WEBM · máx. 100 MB"
                                : "JPG, PNG, WEBP, AVIF o GIF · máx. 10 MB"}
                            {max !== 1 && ` · hasta ${MEDIA_CLIENT_LIMITS.maxFilesPerRequest} archivos`}
                        </p>
                    </div>
                )}

                <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
                    <span className="text-xs text-zinc-500">
                        {selected.length} de {max} seleccionado(s)
                    </span>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={confirm} disabled={uploading}>
                            Usar selección
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** Miniatura de imagen o de video (usa el fotograma de portada si existe). */
export function MediaThumb({ item }: { item: Pick<TMedia, "kind" | "url" | "posterUrl" | "title" | "originalName"> }) {
    if (item.kind === "video" && !item.posterUrl) {
        return <video src={item.url} muted preload="metadata" className="h-full w-full object-cover" />;
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={item.kind === "video" ? item.posterUrl : item.url}
            alt={item.title || item.originalName}
            loading="lazy"
            className="h-full w-full object-cover"
        />
    );
}
