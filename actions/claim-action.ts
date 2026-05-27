// File: frontend/src/actions/claim-action.ts
"use server";

import { ClaimService } from "@/src/services/claim-service";
import { ClaimSchema, ClaimTrackingSchema, Claim } from "@/src/schemas/claim.schema";
import { revalidateTag, revalidatePath } from "next/cache";

// Interfaz para el payload del formulario, evitando el uso de 'any'
export interface ClaimPayload {
    consumer: {
        nombres: string;
        tipoDocumento: string;
        numeroDocumento: string;
        celular: string;
        email: string;
        direccion: string;
        ciudad: string;
        region: string;
    };
    detail: {
        tipoReclamo: string;
        fechaIncidencia: string;
        detalle: string;
        pedido: string;
    };
}

export type ActionState<T = unknown> = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
    data?: T;
    payload?: ClaimPayload; // Tipado de forma estricta
};

/**
 * Action para registrar un nuevo reclamo desde el formulario público
 */
export async function createClaimAction(
    prevState: ActionState<Claim>,
    formData: FormData
): Promise<ActionState<Claim>> {
    const rawData: ClaimPayload = {
        consumer: {
            nombres: formData.get("consumer.nombres") as string,
            tipoDocumento: formData.get("consumer.tipoDocumento") as string,
            numeroDocumento: formData.get("consumer.numeroDocumento") as string,
            celular: formData.get("consumer.celular") as string,
            email: formData.get("consumer.email") as string,
            direccion: formData.get("consumer.direccion") as string,
            ciudad: formData.get("consumer.ciudad") as string,
            region: formData.get("consumer.region") as string,
        },
        detail: {
            tipoReclamo: formData.get("detail.tipoReclamo") as string,
            fechaIncidencia: formData.get("detail.fechaIncidencia") as string,
            detalle: formData.get("detail.detalle") as string,
            pedido: formData.get("detail.pedido") as string,
        }
    };

    const validated = ClaimSchema.safeParse(rawData);

    if (!validated.success) {
        const fieldErrors: Record<string, string[]> = {};

        validated.error.issues.forEach((issue) => {
            const pathKey = issue.path.join(".");
            if (!fieldErrors[pathKey]) {
                fieldErrors[pathKey] = [];
            }
            fieldErrors[pathKey].push(issue.message);
        });

        return {
            success: false,
            errors: fieldErrors,
            message: "Por favor, corrija los campos inválidos del libro de reclamaciones.",
            payload: rawData
        };
    }

    const result = await ClaimService.createPublicClaim(validated.data);

    if (!result.success) {
        return {
            success: false,
            message: result.error,
            payload: rawData
        };
    }

    revalidateTag("admin-claims");

    return {
        success: true,
        message: `Su ${validated.data.detail.tipoReclamo} ha sido registrado de forma conforme con el código correlativo: ${result.data?.correlativo}`,
        data: result.data
    };
}
/**
 * Action para consultar de manera pública el estado del reclamo
 */
export async function trackClaimAction(
    prevState: ActionState<Partial<Claim>>,
    formData: FormData
): Promise<ActionState<Partial<Claim>>> {
    const rawData = {
        correlativo: formData.get("correlativo") as string,
        numeroDocumento: formData.get("numeroDocumento") as string
    };

    const validated = ClaimTrackingSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
            message: "Campos de búsqueda incompletos o inválidos."
        };
    }

    const result = await ClaimService.trackClaim(validated.data);

    if (!result.success) {
        return { success: false, message: result.error };
    }

    return {
        success: true,
        message: "Consulta realizada exitosamente.",
        data: result.data
    };
}

/**
 * Action administrativo para emitir una resolución oficial
 */
export async function resolveClaimAction(
    id: string,
    prevState: ActionState<Claim>,
    formData: FormData
): Promise<ActionState<Claim>> {
    const rawData = {
        respuestaProveedor: formData.get("respuestaProveedor") as string,
        estado: formData.get("estado") as "En Proceso" | "Resuelto"
    };

    if (!rawData.respuestaProveedor || rawData.respuestaProveedor.trim().length < 20) {
        return {
            success: false,
            errors: { respuestaProveedor: ["La respuesta formal de la empresa debe tener un mínimo de 20 caracteres."] },
            message: "Error de validación institucional."
        };
    }

    const result = await ClaimService.resolveClaim(id, rawData);

    if (!result.success) {
        return { success: false, message: result.error };
    }

    revalidateTag(`claim-${id}`);
    revalidateTag("admin-claims");
    revalidatePath(`/admin/claims/${id}`);

    return {
        success: true,
        message: "El estado de la reclamación y la respuesta han sido actualizados y guardados en el historial de auditoría.",
        data: result.data
    };
}