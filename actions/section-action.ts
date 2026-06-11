// File: frontend/src/modules/section/section.actions.ts

"use server"

import { revalidateTag } from "next/cache";
import { verifySession } from "@/src/auth/dal";
import { CreateSectionDTOSchema, SectionBlock } from "@/src/schemas/section.schema";

const API_URL = process.env.API_URL;

export interface FormActionState {
    ok: boolean;
    error?: string;
    fields?: Record<string, string>;
    submitted?: {
        title: string;
        type: string | undefined;
        order: number;
        isActive: boolean;
        settings: {
            bodyText: string | undefined;
            gridColumns: number;
        };
        blocks: SectionBlock[];
    };
}

function parseSectionFormData(formData: FormData): {
    title: string;
    type: string | undefined;
    order: number;
    isActive: boolean;
    settings: {
        bodyText: string | undefined;
        gridColumns: number;
    };
    blocks: SectionBlock[];
} {
    const rawBlocksString = formData.get("blocksData")?.toString();
    let rawBlocksData: SectionBlock[] = rawBlocksString ? JSON.parse(rawBlocksString) : [];

    // Limpieza e inicialización desde el Formulario: Sanitización del campo linkTo y cadenas vacías
    rawBlocksData = rawBlocksData.map(block => ({
        ...block,
        title: block.title?.trim() || undefined,
        subtitle: block.subtitle?.trim() || undefined,
        linkTo: block.linkTo?.trim() === "" ? undefined : block.linkTo?.trim(),
        productId: block.productId === "" ? undefined : block.productId,
    }));

    return {
        title: formData.get("title")?.toString() || "",
        type: formData.get("type")?.toString() || undefined,
        order: formData.get("order") ? Number(formData.get("order")) : 0,
        isActive: formData.get("isActive") === "true",
        settings: {
            bodyText: formData.get("settings.bodyText")?.toString() || undefined,
            gridColumns: formData.get("settings.gridColumns") ? Number(formData.get("settings.gridColumns")) : 4,
        },
        blocks: rawBlocksData,
    };
}

export async function createSectionAction(
    prevState: FormActionState,
    formData: FormData
): Promise<FormActionState> {
    const session = await verifySession();
    const rawData = parseSectionFormData(formData);

    const validated = CreateSectionDTOSchema.safeParse(rawData);
    if (!validated.success) {
        const fieldErrors: Record<string, string> = {};
        validated.error.errors.forEach((err) => {
            const pathKey = err.path.join(".");
            fieldErrors[pathKey] = err.message;
        });
        return {
            ok: false,
            error: "Revisa los campos marcados antes de continuar.",
            fields: fieldErrors,
            submitted: rawData,
        };
    }

    try {
        const res = await fetch(`${API_URL}/sections`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`,
            },
            body: JSON.stringify(validated.data),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({})) as { message?: string; error?: string };
            return {
                ok: false,
                error: errData.error || errData.message || "Error del servidor al guardar la sección.",
                submitted: rawData,
            };
        }

        revalidateTag("sections-storefront");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al crear sección:", error);
        return {
            ok: false,
            error: "Fallo de conexión con el servidor. Intenta nuevamente.",
            submitted: rawData,
        };
    }
}

export async function updateSectionAction(
    id: string,
    prevState: FormActionState,
    formData: FormData
): Promise<FormActionState> {
    const session = await verifySession();
    const rawData = parseSectionFormData(formData);

    const validated = CreateSectionDTOSchema.safeParse(rawData);
    if (!validated.success) {
        const fieldErrors: Record<string, string> = {};
        validated.error.errors.forEach((err) => {
            const pathKey = err.path.join(".");
            fieldErrors[pathKey] = err.message;
        });
        return {
            ok: false,
            error: "Revisa los campos marcados antes de continuar.",
            fields: fieldErrors,
            submitted: rawData,
        };
    }

    try {
        const res = await fetch(`${API_URL}/sections/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`,
            },
            body: JSON.stringify(validated.data),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({})) as { message?: string; error?: string };
            return {
                ok: false,
                error: errData.error || errData.message || "Error al actualizar la sección.",
                submitted: rawData,
            };
        }

        revalidateTag("sections-storefront");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al actualizar sección:", error);
        return {
            ok: false,
            error: "Fallo de red al intentar actualizar.",
            submitted: rawData,
        };
    }
}

export async function reorderSectionsAction(orders: { id: string; order: number }[]): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();

    try {
        const res = await fetch(`${API_URL}/sections/reorder`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            },
            body: JSON.stringify({ orders })
        });

        if (!res.ok) {
            return { ok: false, error: "No se pudo actualizar el orden posicional de las secciones." };
        }

        revalidateTag("sections-storefront");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al reordenar secciones:", error);
        return { ok: false, error: "Error de comunicación en lote." };
    }
}

export async function deleteSectionAction(id: string): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();

    try {
        const res = await fetch(`${API_URL}/sections/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            }
        });

        if (!res.ok) {
            return { ok: false, error: "La sección no pudo ser eliminada de la base de datos." };
        }

        revalidateTag("sections-storefront");
        return { ok: true };
    } catch (error) {
        console.error("Error crítico al eliminar sección:", error);
        return { ok: false, error: "Error crítico al intentar procesar la eliminación." };
    }
}