// Tipos del módulo de medios (espejo de la API /api/media del backend).

export type MediaKind = "image" | "video";

export type MediaFolder =
    | "products"
    | "categories"
    | "brands"
    | "collections"
    | "sliders"
    | "sections"
    | "advertisements"
    | "general";

export interface TMedia {
    _id: string;
    kind: MediaKind;
    folder: MediaFolder;
    url: string;
    posterUrl?: string;
    format: string;
    mimeType: string;
    bytes: number;
    width?: number;
    height?: number;
    duration?: number;
    originalName: string;
    title?: string;
    alt?: string;
    createdAt?: string;
}

export interface TMediaListResponse {
    items: TMedia[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type MediaSort = "newest" | "oldest" | "name" | "size";

export type TMediaUploadStatus = "created" | "reused" | "rejected";

export interface TMediaUploadResult {
    originalName: string;
    status: TMediaUploadStatus;
    error?: string;
    media?: TMedia;
}

/** Mismos límites que el backend (media.constants.ts). Se validan antes de subir. */
export const MEDIA_CLIENT_LIMITS = {
    image: 10 * 1024 * 1024,
    video: 100 * 1024 * 1024,
    maxFilesPerRequest: 20,
} as const;

export const MEDIA_ACCEPT: Record<MediaKind, Record<string, string[]>> = {
    image: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/avif": [".avif"],
        "image/gif": [".gif"],
    },
    video: {
        "video/mp4": [".mp4", ".m4v"],
        "video/quicktime": [".mov"],
        "video/webm": [".webm"],
    },
};
