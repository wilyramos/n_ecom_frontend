"use server"

import { revalidateTag } from "next/cache";
import { verifySession } from "@/src/auth/dal";
import { CreateSectionDTOSchema, SectionBlock } from "@/src/schemas/section.schema";

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
    const rawBlocksData: SectionBlock[] = rawBlocksString ? JSON.parse(rawBlocksString) : [];

    return {
        title:    formData.get("title")?.toString() || "",
        type:     formData.get("type")?.toString() || undefined,
        order:    formData.get("order") ? Number(formData.get("order")) : 0,
        isActive: formData.get("isActive") === "true",
        settings: {
            bodyText:    formData.get("settings.bodyText")?.toString() || undefined,
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
            fieldErrors[err.path.join(".")] = err.message;
        });
        return {
            ok:        false,
            error:     "Revisa los campos marcados antes de continuar.",
            fields:    fieldErrors,
            submitted: rawData,
        };
    }

    try {
        const res = await fetch(`${process.env.API_URL}/sections`, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${session.token}`,
            },
            body: JSON.stringify(validated.data),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({ message: "" })) as { message?: string };
            return {
                ok:        false,
                error:     errData.message || "Error del servidor al guardar la sección.",
                submitted: rawData,
            };
        }

        revalidateTag("sections-storefront");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al crear sección:", error);
        return {
            ok:        false,
            error:     "Fallo de conexión con el servidor. Intenta nuevamente.",
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

    const cleanedBlocks = rawData.blocks.map(block => ({
        ...block,
        productId: (block.productId && typeof block.productId === "string") ? block.productId : undefined
    }));
    
    const processedData = {
        ...rawData,
        blocks: cleanedBlocks
    };
    // -----------------------------------------------------------

    const validated = CreateSectionDTOSchema.safeParse(processedData);
    if (!validated.success) {
        const fieldErrors: Record<string, string> = {};
        validated.error.errors.forEach((err) => {
            fieldErrors[err.path.join(".")] = err.message;
        });
        return {
            ok: false,
            error: "Revisa los campos marcados antes de continuar.",
            fields: fieldErrors,
            submitted: processedData,
        };
    }

    try {
        const res = await fetch(`${process.env.API_URL}/sections/${id}`, {
            method:  "PUT",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${session.token}`,
            },
            body: JSON.stringify(validated.data),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({ message: "" })) as { message?: string };
            return {
                ok:        false,
                error:     errData.message || "Error al actualizar la sección.",
                submitted: rawData,
            };
        }

        revalidateTag("sections-storefront");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al actualizar sección:", error);
        return {
            ok:        false,
            error:     "Fallo de red al intentar actualizar.",
            submitted: rawData,
        };
    }
}

export async function reorderSectionsAction(orders: { id: string; order: number }[]): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();

    try {
        const res = await fetch(`${process.env.API_URL}/sections/reorder`, {
            method:  "PATCH",
            headers: {
                "Content-Type":  "application/json",
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
        const res = await fetch(`${process.env.API_URL}/sections/${id}`, {
            method:  "DELETE",
            headers: {
                "Content-Type":  "application/json",
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