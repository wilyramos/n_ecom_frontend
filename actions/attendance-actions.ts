// File: frontend/src/modules/attendance/attendance.actions.ts

"use server";

import { revalidateTag } from "next/cache";
import { verifySession } from "@/src/auth/dal";
import { AttendanceService } from "@/src/services/attendance.service";
import type { Attendance } from "@/src/schemas/attendance.schema";

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface AttendanceActionResult {
    ok: boolean;
    data?: Attendance;
    error?: string;
}

// ─── HELPER ───────────────────────────────────────────────────────────────────

function toErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

// ─── ACTIONS ──────────────────────────────────────────────────────────────────

export async function checkInAction(): Promise<AttendanceActionResult> {
    try {
        await verifySession();

        const data = await AttendanceService.checkIn();
        revalidateTag("my-attendance-history");

        return { ok: true, data };
    } catch (error) {
        console.error("[checkInAction]", error);
        return {
            ok: false,
            error: toErrorMessage(error, "No se pudo completar el marcaje de ingreso."),
        };
    }
}

export async function checkOutAction(): Promise<AttendanceActionResult> {
    try {
        await verifySession();

        const data = await AttendanceService.checkOut();
        revalidateTag("my-attendance-history");

        return { ok: true, data };
    } catch (error) {
        console.error("[checkOutAction]", error);
        return {
            ok: false,
            error: toErrorMessage(error, "No se pudo completar el marcaje de egreso."),
        };
    }
}