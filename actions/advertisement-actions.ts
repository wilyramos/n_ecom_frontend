"use server";

import { revalidateTag } from "next/cache";
import { verifySession } from "@/src/auth/dal";
import {
    CreateAdDTOSchema,
    UpdateAdDTOSchema,
} from "@/src/schemas/advertisement.schema";
import { AdvertisementService } from "@/src/services/advertisement-service";

export interface AdFormActionState {
    ok: boolean;
    error?: string;
    fields?: Record<string, string>;
    submitted?: {
        title: string;
        showTitle: boolean;
        subtitle: string | undefined;
        imageUrl: string | undefined;
        linkTo: string | undefined;
        layout: string | undefined;
        isActive: boolean;
        startDate: string | null;
        endDate: string | null;
    };
}

function parseAdFormData(formData: FormData) {
    const rawTitle = formData.get("title")?.toString().trim() || "";
    const rawSubtitle = formData.get("subtitle")?.toString().trim() || "";
    const rawImageUrl = formData.get("imageUrl")?.toString().trim() || "";
    const rawLinkTo = formData.get("linkTo")?.toString().trim() || "";
    const rawLayout = formData.get("layout")?.toString().trim() || undefined;

    return {
        title: rawTitle,
        showTitle: formData.get("showTitle") === "true",
        subtitle: rawSubtitle || undefined,
        imageUrl: rawImageUrl || undefined,
        linkTo: rawLinkTo || undefined,
        layout: rawLayout,
        isActive: formData.get("isActive") === "true",
        startDate: formData.get("startDate")?.toString() || null,
        endDate: formData.get("endDate")?.toString() || null,
    };
}

export async function createAdvertisementAction(
    prevState: AdFormActionState,
    formData: FormData
): Promise<AdFormActionState> {
    const session = await verifySession();
    if (!session?.token) {
        return {
            ok: false,
            error: "No tienes autorización o tu sesión ha expirado.",
        };
    }

    const rawData = parseAdFormData(formData);
    const validated = CreateAdDTOSchema.safeParse(rawData);

    if (!validated.success) {
        const fieldErrors: Record<string, string> = {};
        validated.error.errors.forEach((err) => {
            fieldErrors[err.path.join(".")] = err.message;
        });

        return {
            ok: false,
            error: "Revisa los campos marcados antes de continuar.",
            fields: fieldErrors,
            submitted: rawData,
        };
    }

    try {
        await AdvertisementService.create(validated.data, session.token);
        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error operacional al crear el anuncio.",
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
    if (!session?.token) {
        return {
            ok: false,
            error: "No tienes autorización o tu sesión ha expirado.",
        };
    }

    const rawData = parseAdFormData(formData);
    const validated = UpdateAdDTOSchema.safeParse(rawData);

    if (!validated.success) {
        const fieldErrors: Record<string, string> = {};
        validated.error.errors.forEach((err) => {
            fieldErrors[err.path.join(".")] = err.message;
        });

        return {
            ok: false,
            error: "Revisa los campos marcados antes de continuar.",
            fields: fieldErrors,
            submitted: rawData,
        };
    }

    try {
        await AdvertisementService.update(id, validated.data, session.token);
        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error al actualizar la campaña publicitaria.",
            submitted: rawData,
        };
    }
}

export async function deleteAdvertisementAction(
    id: string
): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();
    if (!session?.token) {
        return { ok: false, error: "Sesión inválida o expirada." };
    }

    try {
        await AdvertisementService.delete(id, session.token);
        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "No fue posible eliminar el registro.",
        };
    }
}

export async function toggleAdStatusAction(
    id: string,
    currentStatus: boolean
): Promise<{ ok: boolean; error?: string }> {
    const session = await verifySession();
    if (!session?.token) {
        return { ok: false, error: "Sesión inválida o expirada." };
    }

    try {
        await AdvertisementService.update(id, { isActive: !currentStatus }, session.token);
        revalidateTag("ads-public");
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Fallo al alternar el estado del aviso.",
        };
    }
}