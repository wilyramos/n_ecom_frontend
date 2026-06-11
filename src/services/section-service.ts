// File: frontend/src/modules/section/section.service.ts

import {
    SectionListResponseSchema,
    SectionPaginatedApiResponseSchema,
    SectionSingleResponseSchema,
    SectionResponse,
    SectionPaginatedApiResponse
} from "@/src/schemas/section.schema";
import { getTokenOptional } from "@/src/auth/dal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Obtiene las secciones activas ordenadas para el Storefront público.
 */
export async function getActiveSections(): Promise<SectionResponse[]> {
    const res = await fetch(`${API_URL}/sections`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { tags: ['sections-storefront'] }
    });

    if (!res.ok) throw new Error('Error al cargar las secciones del escaparate');

    const json = await res.json();
    const validation = SectionListResponseSchema.safeParse(json);

    if (!validation.success) {
        console.error("❌ ZOD ERROR (getActiveSections):", JSON.stringify(validation.error.format(), null, 2));
        throw new Error('Estructura de datos inválida de la API pública');
    }

    return validation.data;
}

/**
 * Obtiene el listado paginado de secciones para el Panel de Administración.
 */
export async function getAdminSections(page: number = 1, limit: number = 10): Promise<SectionPaginatedApiResponse> {
    const token = await getTokenOptional();

    const res = await fetch(`${API_URL}/sections/admin?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store'
    });

    if (!res.ok) throw new Error('Error al cargar las secciones administrativas');

    const json = await res.json();
    const validation = SectionPaginatedApiResponseSchema.safeParse(json);

    if (!validation.success) {
        console.error("❌ ZOD ERROR (getAdminSections):", JSON.stringify(validation.error.format(), null, 2));
        throw new Error('Estructura de datos inválida de la API administrativa');
    }

    return validation.data;
}

/**
 * Obtiene el detalle de una sección por su ID único para edición en el CMS.
 */
export async function getSectionById(id: string): Promise<SectionResponse> {
    const token = await getTokenOptional();

    const res = await fetch(`${API_URL}/sections/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store'
    });

    if (!res.ok) throw new Error('No se pudo encontrar la sección solicitada');

    const json = await res.json();
    const validation = SectionSingleResponseSchema.safeParse(json);

    if (!validation.success) {
        console.error("❌ ZOD ERROR (getSectionById):", JSON.stringify(validation.error.format(), null, 2));
        throw new Error('Error de consistencia en el detalle de la sección');
    }

    return validation.data;
}