// File: frontend/src/actions/page-actions.ts

"use server";

import { revalidateTag } from "next/cache";
import { verifySession } from "@/src/auth/dal";
import { PageService } from "@/src/services/page-service";
import { PageFormSchema } from "@/src/schemas/page.schema";
import type { Page } from "@/src/schemas/page.schema";

export interface ActionState<T = unknown> {
    success: boolean;
    message: string;
    fields?: Record<string, string | boolean | Record<string, string> | undefined>;
    fieldErrors?: Record<string, string[]>;
    errors?: string[];
    data?: T;
}

export async function createPageAction(
    _prevState: ActionState<Page>,
    formData: FormData
): Promise<ActionState<Page>> {
    try {
        await verifySession();

        const rawFields = {
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            content: formData.get("content") as string,
            isActive: formData.get("isActive") === "true",
            seo: {
                metaTitle: formData.get("metaTitle") as string,
                metaDescription: formData.get("metaDescription") as string,
            },
        };

        const validated = PageFormSchema.safeParse(rawFields);
        if (!validated.success) {
            const fieldErrors: Record<string, string[]> = {};
            validated.error.errors.forEach((err) => {
                const path = err.path.join(".");
                if (!fieldErrors[path]) fieldErrors[path] = [];
                fieldErrors[path].push(err.message);
            });

            return {
                success: false,
                message: "Error de validación en los campos provistos.",
                fields: rawFields,
                fieldErrors,
                errors: validated.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
            };
        }

        const data = await PageService.createPage(validated.data);

        revalidateTag("admin-pages-list");
        if (data.slug) revalidateTag(`page-slug-${data.slug}`);

        return {
            success: true,
            message: "Página creada correctamente.",
            data,
        };
    } catch (error) {
        console.error("[createPageAction]", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "No se pudo completar la creación de la página.",
        };
    }
}

export async function updatePageAction(
    id: string,
    previousSlug: string | undefined,
    _prevState: ActionState<Page>,
    formData: FormData
): Promise<ActionState<Page>> {
    try {
        await verifySession();

        const rawFields = {
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            content: formData.get("content") as string,
            isActive: formData.get("isActive") === "true",
            seo: {
                metaTitle: formData.get("metaTitle") as string,
                metaDescription: formData.get("metaDescription") as string,
            },
        };

        const validated = PageFormSchema.safeParse(rawFields);
        if (!validated.success) {
            const fieldErrors: Record<string, string[]> = {};
            validated.error.errors.forEach((err) => {
                const path = err.path.join(".");
                if (!fieldErrors[path]) fieldErrors[path] = [];
                fieldErrors[path].push(err.message);
            });

            return {
                success: false,
                message: "Error de validación en las modificaciones provistas.",
                fields: rawFields,
                fieldErrors,
                errors: validated.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
            };
        }

        const data = await PageService.updatePage(id, validated.data);

        revalidateTag("admin-pages-list");
        if (previousSlug) revalidateTag(`page-slug-${previousSlug}`);
        if (data.slug) revalidateTag(`page-slug-${data.slug}`);

        return {
            success: true,
            message: "Página actualizada correctamente.",
            data,
        };
    } catch (error) {
        console.error("[updatePageAction]", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "No se pudo completar la actualización de la página.",
        };
    }
}

export async function deletePageAction(id: string, slug?: string): Promise<ActionState<string>> {
    try {
        await verifySession();
        const deletedId = await PageService.deletePage(id);

        revalidateTag("admin-pages-list");
        if (slug) revalidateTag(`page-slug-${slug}`);

        return {
            success: true,
            message: "Página eliminada permanentemente del sistema.",
            data: deletedId,
        };
    } catch (error) {
        console.error("[deletePageAction]", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "No se pudo procesar la eliminación de la página.",
        };
    }
}