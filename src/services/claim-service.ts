// File: src/services/claim.service.ts

import {
    CreateClaimInput,
    CreateClaimResponseSchema,
    GetAllClaimsResponseSchema,
    GetClaimByCorrelativoResponseSchema,
    UpdateResolutionInput,
    UpdateResolutionResponseSchema,
    type Claim,
} from "@/src/schemas/claim.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// ── Helpers ────────────────────────────────────────────────────────────────────

type ServiceResult<T> =
    | { success: true;  data: T }
    | { success: false; error: string };

function extractErrorMessage(json: unknown, status: number): string {
    if (
        json !== null &&
        typeof json === "object" &&
        "message" in json &&
        typeof (json as { message: unknown }).message === "string"
    ) {
        return (json as { message: string }).message;
    }
    return `Error ${status}`;
}

async function parseResponse<T>(
    res: Response,
    parse: (json: unknown) => T
): Promise<ServiceResult<T>> {
    const json: unknown = await res.json().catch(() => null);

    if (!res.ok) {
        return { success: false, error: extractErrorMessage(json, res.status) };
    }

    try {
        return { success: true, data: parse(json) };
    } catch {
        return { success: false, error: "Respuesta inesperada del servidor." };
    }
}

// ── Métodos públicos ───────────────────────────────────────────────────────────

export async function createClaim(input: CreateClaimInput) {
    const res = await fetch(`${API_URL}/claims`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(input),
    });

    return parseResponse(res, (json) =>
        CreateClaimResponseSchema.parse(json).data
    );
}

export async function getClaimByCorrelativo(
    correlativo: string
): Promise<ServiceResult<Claim>> {
    const res = await fetch(
        `${API_URL}/claims/track/${encodeURIComponent(correlativo)}`,
        { cache: "no-store" }
    );

    return parseResponse(res, (json) =>
        GetClaimByCorrelativoResponseSchema.parse(json).data
    );
}

// ── Métodos administrativos (requieren token) ──────────────────────────────────

export async function getAllClaims(token: string): Promise<ServiceResult<Claim[]>> {
    const res = await fetch(`${API_URL}/claims`, {
        headers: { Authorization: `Bearer ${token}` },
        cache:   "no-store",
    });

    return parseResponse(res, (json) =>
        GetAllClaimsResponseSchema.parse(json).data
    );
}

export async function updateClaimResolution(
    correlativo: string,
    input: UpdateResolutionInput,
    token: string
) {
    const res = await fetch(
        `${API_URL}/claims/${encodeURIComponent(correlativo)}/resolution`,
        {
            method:  "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        }
    );

    return parseResponse(res, (json) =>
        UpdateResolutionResponseSchema.parse(json).data
    );
}