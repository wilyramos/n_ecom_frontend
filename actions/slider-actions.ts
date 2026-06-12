// File: frontend/src/actions/slider-actions.ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import {
    SliderBannerSchema,
    SliderLayoutEnum,
    SliderThemeEnum,
    SliderObjectFitEnum,
    type SliderBanner,
    type SliderBannerFormValues,
    type SliderPrice,
    type SliderDesign,
    type SliderMedia,
} from "@/src/schemas/slider.schema";
import getToken from "@/src/auth/token";

const ADMIN_BANNERS_PATH = "/admin/slider";
const BASE_URL = `${process.env.API_URL}/slider-banners`;

export type ReorderItem = { id: string; order: number };

export type ActionSuccess<T> = {
    success: true;
    data: T;
    message?: string;
};

export type ActionFailure = {
    success: false;
    message: string;
    errors?: string[];
    fieldErrors?: Record<string, string[]>;
    fields?: Record<string, string>;
};

export type ActionState<T = null> = ActionSuccess<T> | ActionFailure;

async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await getToken();
    if (!token) throw new Error("Sesión expirada o inválida.");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Error inesperado.";
}

function formString(formData: FormData, key: string): string | undefined {
    const val = formData.get(key);
    if (val === null) return undefined;
    const str = typeof val === "string" ? val.trim() : undefined;
    return str === "" ? undefined : str;
}

function formNumber(formData: FormData, key: string): number | undefined {
    const val = formData.get(key);
    if (val === null || val === "") return undefined;
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
}

function formBool(formData: FormData, key: string): boolean {
    const values = formData.getAll(key);
    if (values.length > 0) {
        return values.includes("true");
    }
    return formData.get(key) === "true";
}

function mapFormDataToBanner(formData: FormData): SliderBannerFormValues {
    // ── Price (Removido 'price.currency' ya que no existe en tu Backend Model) ──
    const priceCurrent = formNumber(formData, "price.current");
    const priceCompare = formNumber(formData, "price.compare");
    const priceLabel = formString(formData, "price.label");
    const priceSuffix = formString(formData, "price.suffix");

    const price: SliderPrice | undefined = (priceCurrent !== undefined || priceCompare !== undefined || priceLabel || priceSuffix)
        ? {
            current: priceCurrent,
            compare: priceCompare,
            label: priceLabel,
            suffix: priceSuffix,
        }
        : undefined;

    // ── Media ──────────────────────────────────────────────
    const imageUrl = formString(formData, "media.imageUrl");
    const videoUrl = formString(formData, "media.videoUrl");
    const rawObjectFit = formString(formData, "media.objectFit");

    const parsedObjectFit = SliderObjectFitEnum.safeParse(rawObjectFit);
    const objectFit = parsedObjectFit.success ? parsedObjectFit.data : "cover";

    const media: SliderMedia | undefined = (imageUrl || videoUrl)
        ? {
            imageUrl: imageUrl || undefined,
            videoUrl: videoUrl || undefined,
            objectFit,
        }
        : undefined;

    // ── Design ─────────────────────────────────────────────
    const rawLayout = formString(formData, "design.layout");
    const rawTheme = formString(formData, "design.theme");

    const parsedLayout = SliderLayoutEnum.safeParse(rawLayout);
    const parsedTheme = SliderThemeEnum.safeParse(rawTheme);

    const design: SliderDesign = {
        layout: parsedLayout.success ? parsedLayout.data : "default",
        theme: parsedTheme.success ? parsedTheme.data : "dark",
        bgColor: formString(formData, "design.bgColor"),
        accentColor: formString(formData, "design.accentColor"),
        textColor: formString(formData, "design.textColor"),
    };

    // ── Countdown ──────────────────────────────────────────
    const countdownEndsAt = formString(formData, "countdown.endsAt");
    const countdownLabel = formString(formData, "countdown.label");
    const countdown: SliderBannerFormValues["countdown"] = (countdownEndsAt || countdownLabel)
        ? {
            endsAt: countdownEndsAt ? new Date(countdownEndsAt) : undefined,
            label: countdownLabel,
            showDays: formBool(formData, "countdown.showDays"),
        }
        : undefined;

    // ── Schedule ───────────────────────────────────────────
    const scheduleStartsAt = formString(formData, "schedule.startsAt");
    const scheduleEndsAt = formString(formData, "schedule.endsAt");
    const schedule: SliderBannerFormValues["schedule"] = (scheduleStartsAt || scheduleEndsAt)
        ? {
            startsAt: scheduleStartsAt ? new Date(scheduleStartsAt) : undefined,
            endsAt: scheduleEndsAt ? new Date(scheduleEndsAt) : undefined,
        }
        : undefined;

    return {
        title: formString(formData, "title") ?? "",
        subtitle: formString(formData, "subtitle"),
        description: formString(formData, "description"),
        terms: formString(formData, "terms"),
        destUrl: formString(formData, "destUrl"),
        openInNewTab: formBool(formData, "openInNewTab"),
        isActive: formBool(formData, "isActive"),
        order: formNumber(formData, "order"),
        price,
        media,
        design,
        countdown,
        schedule,
    };
}

export async function createSliderBannerAction(
    _prev: ActionState<SliderBanner>,
    formData: FormData,
): Promise<ActionState<SliderBanner>> {
    const bannerData = mapFormDataToBanner(formData);
    const result = SliderBannerSchema.safeParse(bannerData);

    if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of result.error.issues) {
            fieldErrors[issue.path.join(".")] = [issue.message];
        }
        return {
            success: false,
            message: "Error de validación.",
            fieldErrors,
            fields: Object.fromEntries(
                Array.from(formData.entries())
                    .filter(([, v]) => typeof v === "string")
                    .map(([k, v]) => [k, v as string]),
            ),
        };
    }

    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(result.data),
        });

        const body = await res.json() as { data: SliderBanner; message?: string };
        if (!res.ok) throw new Error(body.message ?? "Error al crear el banner.");

        revalidateTag("banners-active");
        revalidatePath(ADMIN_BANNERS_PATH);
        return { success: true, data: body.data, message: "Creado con éxito." };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function updateSliderBannerAction(
    id: string,
    _prev: ActionState<SliderBanner>,
    formData: FormData,
): Promise<ActionState<SliderBanner>> {
    const bannerData = mapFormDataToBanner(formData);
    const result = SliderBannerSchema.safeParse(bannerData);

    if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of result.error.issues) {
            fieldErrors[issue.path.join(".")] = [issue.message];
        }
        return { success: false, message: "Error de validación.", fieldErrors };
    }

    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: await getAuthHeaders(),
            body: JSON.stringify(result.data),
        });

        const body = await res.json() as { data: SliderBanner; message?: string };
        if (!res.ok) throw new Error(body.message ?? "Error al actualizar el banner.");

        revalidateTag("banners-active");
        revalidateTag(`banner-${id}`);
        revalidatePath(ADMIN_BANNERS_PATH);
        return { success: true, data: body.data, message: "Actualizado correctamente." };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function toggleSliderBannerAction(id: string): Promise<ActionState<SliderBanner>> {
    try {
        const res = await fetch(`${BASE_URL}/${id}/toggle`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
        });
        const body = await res.json() as { data: SliderBanner; message?: string };
        if (!res.ok) throw new Error(body.message ?? "Error al cambiar estado.");

        revalidateTag("banners-active");
        revalidateTag(`banner-${id}`);
        return { success: true, data: body.data };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function deleteSliderBannerAction(id: string): Promise<ActionState> {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: await getAuthHeaders(),
        });

        if (res.status === 204) {
            revalidateTag("banners-active");
            revalidatePath(ADMIN_BANNERS_PATH);
            return { success: true, data: null };
        }

        const body = await res.json() as { message?: string };
        throw new Error(body.message ?? "No se pudo eliminar el banner.");
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function reorderSliderBannersAction(items: ReorderItem[]): Promise<ActionState> {
    try {
        const res = await fetch(`${BASE_URL}/reorder`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ items }),
        });

        if (!res.ok) {
            const body = await res.json() as { message?: string };
            throw new Error(body.message ?? "Error al reordenar.");
        }

        revalidateTag("banners-active");
        revalidatePath(ADMIN_BANNERS_PATH);
        return { success: true, data: null };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}