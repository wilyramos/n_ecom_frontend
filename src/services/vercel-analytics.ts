// File: frontend/src/services/vercel-analytics.ts
// Lectura de Vercel Web Analytics desde el servidor (nunca desde el navegador).
// Docs: https://vercel.com/docs/analytics/web-analytics-api
// Plan Hobby: ventana de consulta máxima de 30 días.

import "server-only";

const API_BASE = "https://api.vercel.com/v1/query/web-analytics";

export type AnalyticsRange = 7 | 30;

export type AnalyticsConfig =
    | { ok: true; token: string; projectId: string; teamId?: string }
    | { ok: false; missing: string[] };

export function getAnalyticsConfig(): AnalyticsConfig {
    const token = process.env.VERCEL_TOKEN?.trim();
    const projectId = process.env.VERCEL_PROJECT_ID?.trim();
    const teamId = process.env.VERCEL_TEAM_ID?.trim() || undefined;

    const missing: string[] = [];
    if (!token) missing.push("VERCEL_TOKEN");
    if (!projectId) missing.push("VERCEL_PROJECT_ID");
    if (missing.length) return { ok: false, missing };

    return { ok: true, token: token!, projectId: projectId!, teamId };
}

export interface Overview {
    pageviews: number;
    visitors: number;
}

export interface DailyPoint {
    date: string; // ISO
    pageviews: number;
    visitors: number;
}

export interface TopRow {
    key: string;
    pageviews: number;
    visitors: number;
}

interface VercelResponse<T> {
    data: T;
}

async function query<T>(
    endpoint: "visits/count" | "visits/aggregate",
    config: Extract<AnalyticsConfig, { ok: true }>,
    range: AnalyticsRange,
    extra: { by?: string[]; limit?: number } = {}
): Promise<T> {
    const now = Date.now();
    const params = new URLSearchParams({
        projectId: config.projectId,
        since: String(now - range * 24 * 60 * 60 * 1000),
        until: String(now),
    });
    if (config.teamId) params.set("teamId", config.teamId);
    extra.by?.forEach((dimension) => params.append("by", dimension));
    if (extra.limit) params.set("limit", String(extra.limit));

    const res = await fetch(`${API_BASE}/${endpoint}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${config.token}` },
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(
            `Vercel respondió ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`
        );
    }

    const json = (await res.json()) as VercelResponse<T>;
    return json.data;
}

export async function getOverview(config: Extract<AnalyticsConfig, { ok: true }>, range: AnalyticsRange) {
    return query<Overview>("visits/count", config, range);
}

export async function getDaily(config: Extract<AnalyticsConfig, { ok: true }>, range: AnalyticsRange) {
    const rows = await query<Array<{ timestamp: string; pageviews: number; visitors: number }>>(
        "visits/aggregate",
        config,
        range,
        { by: ["day"] }
    );
    return rows.map<DailyPoint>((row) => ({
        date: row.timestamp,
        pageviews: row.pageviews,
        visitors: row.visitors,
    }));
}

/** Ranking por dimensión (página, referencia, país, dispositivo...). */
export async function getTop(
    config: Extract<AnalyticsConfig, { ok: true }>,
    range: AnalyticsRange,
    dimension: "requestPath" | "referrerHostname" | "country" | "deviceType",
    limit = 8
) {
    const rows = await query<Array<Record<string, string | number>>>(
        "visits/aggregate",
        config,
        range,
        { by: [dimension], limit }
    );
    return rows.map<TopRow>((row) => ({
        key: String(row[dimension] ?? "(sin dato)"),
        pageviews: Number(row.pageviews ?? 0),
        visitors: Number(row.visitors ?? 0),
    }));
}
