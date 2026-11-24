"use client";

// Cliente de la API de medios. Solo se usa desde componentes de cliente del admin.

import { getClientToken } from "@/actions/get-token-action";
import type {
    MediaFolder,
    MediaKind,
    MediaSort,
    TMedia,
    TMediaListResponse,
    TMediaUploadResult,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function authHeaders(): Promise<Record<string, string>> {
    let token: string | undefined;
    try {
        token = await getClientToken();
    } catch {
        // Fallo de la Server Action: suele ser una página abierta con una versión anterior
        // de la app (tras un rebuild o reinicio del servidor de desarrollo).
        throw new Error(
            "No se pudo verificar tu sesión. Recarga la página (Ctrl+F5) y vuelve a intentarlo."
        );
    }
    if (!token) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
    return { Authorization: `Bearer ${token}` };
}

async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const json = await res.json();
        if (Array.isArray(json?.errors) && json.errors.length) return json.errors[0];
        if (typeof json?.message === "string" && json.message) return json.message;
    } catch {
        // respuesta sin JSON
    }
    return fallback;
}

export interface ListMediaParams {
    kind?: MediaKind;
    folder?: MediaFolder;
    q?: string;
    sort?: MediaSort;
    page?: number;
    limit?: number;
}

export async function listMedia(params: ListMediaParams): Promise<TMediaListResponse> {
    const query = new URLSearchParams();
    if (params.kind) query.set("kind", params.kind);
    if (params.folder) query.set("folder", params.folder);
    if (params.q) query.set("q", params.q);
    if (params.sort) query.set("sort", params.sort);
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 24));

    const res = await fetch(`${API_URL}/media?${query.toString()}`, {
        headers: await authHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error(await readError(res, "No se pudo cargar la biblioteca."));
    return res.json();
}

/**
 * Sube uno o varios archivos. El backend deduplica por contenido: si un archivo
 * ya existe, devuelve el medio existente con estado "reused" (no se vuelve a subir).
 */
export async function uploadMedia(files: File[], folder: MediaFolder): Promise<TMediaUploadResult[]> {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    body.append("folder", folder);

    const res = await fetch(`${API_URL}/media`, {
        method: "POST",
        headers: await authHeaders(), // sin Content-Type: el navegador añade el boundary
        body,
    });

    if (!res.ok && res.status !== 422) {
        throw new Error(await readError(res, "Error al subir los archivos."));
    }
    const json = await res.json();
    return json.results as TMediaUploadResult[];
}

export async function deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/media/${id}`, {
        method: "DELETE",
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(await readError(res, "No se pudo eliminar el medio."));
}

export type { TMedia };
