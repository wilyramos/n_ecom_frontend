// File: frontend/src/services/brands.ts
import "server-only";
import { cache } from "react";

export interface Brand {
    _id: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    logo?: string;
    isActive: boolean;
    createdAt: string;
}

export const getBrands = cache(async (): Promise<Brand[]> => {
    try {
        const res = await fetch(`${process.env.API_URL}/brands`, {
            cache: "force-cache",
        });

        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("[getBrands Error]:", error);
        return [];
    }
});

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
    try {
        const res = await fetch(`${process.env.API_URL}/brands/active`, {
            cache: "force-cache",
        });

        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("[getActiveBrands Error]:", error);
        return [];
    }
});

export const getBrandBySlug = cache(async (slug: string): Promise<Brand | null> => {
    try {
        const url = `${process.env.API_URL}/brands/slug/${slug}`;
        const res = await fetch(url, {
            cache: "force-cache",
        });

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(`[getBrandBySlug Error - ${slug}]:`, error);
        return null;
    }
});