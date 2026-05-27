// File: src/actions/claim.actions.ts
//
// Server Actions de Next.js 15.
// Las acciones admin usan verifySession (redirige si no hay sesión).
// Las acciones públicas no requieren autenticación.

"use server";

import { revalidatePath } from "next/cache";

import { verifySession }     from "@/src/auth/dal";
import { getClaimByCorrelativo } from "@/src/services/claim-service";
import {
    CreateClaimSchema,
    UpdateResolutionSchema,
    type Claim,
} from "@/src/schemas/claim.schema";
import {
    createClaim,
    getAllClaims,
    updateClaimResolution,
} from "@/src/services/claim-service";

// ── Tipo de retorno compartido ─────────────────────────────────────────────────

export type ActionResult<T = void> =
    | { success: true;  data: T;      error?: never; fieldErrors?: never }
    | { success: false; error: string; data?: never; fieldErrors?: Record<string, string[]> };

// ── Acción pública: Registrar reclamo ─────────────────────────────────────────

/**
 * Compatbile con useActionState:
 *   const [state, action, isPending] = useActionState(submitClaimAction, null);
 */
export async function submitClaimAction(
    _prevState: ActionResult<{ correlativo: string; createdAt: string }> | null,
    formData: FormData
): Promise<ActionResult<{ correlativo: string; createdAt: string }>> {

    const raw    = Object.fromEntries(formData.entries());
    const parsed = CreateClaimSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            success:     false,
            error:       "Por favor corrige los errores del formulario.",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const result = await createClaim(parsed.data);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    return {
        success: true,
        data: {
            correlativo: result.data.correlativo,
            createdAt:   result.data.createdAt,
        },
    };
}

// ── Acción pública: Consultar reclamo por correlativo ─────────────────────────

export async function trackClaimAction(
    _prevState: ActionResult<Claim> | null,
    formData: FormData
): Promise<ActionResult<Claim>> {

    const correlativo = formData.get("correlativo")?.toString().trim().toUpperCase() ?? "";

    if (!/^R-\d{4}-\d{5}$/.test(correlativo)) {
        return {
            success: false,
            error:   "Formato inválido. Usa el formato R-YYYY-XXXXX (ej: R-2026-00001).",
        };
    }

    const result = await getClaimByCorrelativo(correlativo);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
}

// ── Acción admin: Obtener todos los reclamos ──────────────────────────────────

/**
 * verifySession redirige automáticamente a /auth/login si no hay sesión activa,
 * por lo que no es necesario manejar el caso de token nulo manualmente.
 */
export async function fetchAllClaimsAction(): Promise<ActionResult<Claim[]>> {
    const { token } = await verifySession();

    const result = await getAllClaims(token);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
}

// ── Acción admin: Actualizar resolución ───────────────────────────────────────

/**
 * Uso con bind para pasar el correlativo:
 *   const action = updateResolutionAction.bind(null, correlativo);
 *   const [state, dispatch, isPending] = useActionState(action, null);
 */
export async function updateResolutionAction(
    correlativo: string,
    _prevState:  ActionResult<{ estado: string; fechaRespuesta?: string }> | null,
    formData:    FormData
): Promise<ActionResult<{ estado: string; fechaRespuesta?: string }>> {

    const { token } = await verifySession();

    const raw    = Object.fromEntries(formData.entries());
    const parsed = UpdateResolutionSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            success:     false,
            error:       "Datos inválidos.",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const result = await updateClaimResolution(correlativo, parsed.data, token);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    revalidatePath("/admin/reclamos");
    revalidatePath(`/reclamos/track/${correlativo}`);

    return {
        success: true,
        data: {
            estado:         result.data.estado,
            fechaRespuesta: result.data.fechaRespuesta,
        },
    };
}