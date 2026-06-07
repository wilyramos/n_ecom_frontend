"use server";

import { revalidateTag } from "next/cache";
import { verifySession } from "@/src/auth/dal";
import { CreateAdDTOSchema, UpdateAdDTOSchema } from "@/src/schemas/advertisement.schema";

export interface AdFormActionState {
    ok: boolean;
    error?: string;
    fields?: Record<string, string>;
    submitted?: {
        title: string;
        subtitle: string | undefined;
        imageUrl: string | undefined;
        linkTo: string | undefined;
        layout: string | undefined;
        isActive: boolean;
        order: number;
        startDate: string | null;
        endDate: string | null;
    };
}

function parseAdFormData(formData: FormData) {
    return {
        title:     formData.get("title")?.toString() || "",
        subtitle:  formData.get("subtitle")?.toString() || undefined,
        imageUrl:  formData.get("imageUrl")?.toString() || undefined,
        linkTo:    formData.get("linkTo")?.toString() || undefined,
        layout:    formData.get("layout")?.toString() || undefined,
        isActive:  formData.get("isActive") === "true",
        order:     formData.get("order") ? Number(formData.get("order")) : 0,
        startDate: formData.get("startDate")?.toString() || null,
        endDate:   formData.get("endDate")?.toString() || null,
    };
}

export async function createAdvertisementAction(
    prevState: AdFormActionState,
    formData: FormData
): Promise<AdFormActionState> {
    const session = await verifySession();
    const rawData = parseAdFormData(formData);

    const validated = CreateAdDTOSchema.safeParse(rawData);
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
        const res = await fetch(`${process.env.API_URL}/advertisements`, {
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
                error:     errData.message || "Error del servidor al guardar el aviso.",
                submitted: rawData,
            };
        }

        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al crear aviso:", error);
        return {
            ok:        false,
            error:     "Fallo de conexión con el servidor. Intenta nuevamente.",
            submitted: rawData,
        };
    }
}

export async function updateAdvertisementAction(
    id: string,
    prevState: AdFormActionState,
    formData: FormData
): Promise<AdFormActionState> {
    const session = await verifySession();
    const rawData = parseAdFormData(formData);

    const validated = UpdateAdDTOSchema.safeParse(rawData);
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
        const res = await fetch(`${process.env.API_URL}/advertisements/${id}`, {
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
                error:     errData.message || "Error al actualizar el aviso.",
                submitted: rawData,
            };
        }

        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al actualizar aviso:", error);
        return {
            ok:        false,
            error:     "Fallo de red al intentar actualizar.",
            submitted: rawData,
        };
    }
}

export async function deleteAdvertisementAction(id: string): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();

    try {
        const res = await fetch(`${process.env.API_URL}/advertisements/${id}`, {
            method:  "DELETE",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${session.token}`
            }
        });

        if (!res.ok) {
            return { ok: false, error: "El aviso no pudo ser eliminado de la base de datos." };
        }

        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        console.error("Error crítico al eliminar aviso:", error);
        return { ok: false, error: "Error crítico al intentar procesar la eliminación." };
    }
}

export async function toggleAdStatusAction(id: string, currentStatus: boolean): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();

    try {
        const res = await fetch(`${process.env.API_URL}/advertisements/${id}`, {
            method:  "PUT",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${session.token}`
            },
            body: JSON.stringify({ isActive: !currentStatus })
        });

        if (!res.ok) {
            return { ok: false, error: "No se pudo cambiar el estado operacional del aviso." };
        }

        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        console.error("Error de red al cambiar estado del aviso:", error);
        return { ok: false, error: "Fallo de conexión." };
    }
}