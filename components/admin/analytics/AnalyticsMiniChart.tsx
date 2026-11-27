// File: frontend/components/admin/analytics/AnalyticsMiniChart.tsx
// Resumen de tráfico de los últimos 7 días para el panel principal del admin.
// Server Component: los datos se leen en el servidor con el token de Vercel.

import Link from "next/link";
import { ArrowUpRight, Eye, Users } from "lucide-react";
import {
    getAnalyticsConfig,
    getDaily,
    getOverview,
} from "@/src/services/vercel-analytics";

const RANGE_DAYS = 7;

export default async function AnalyticsMiniChart() {
    const config = getAnalyticsConfig();

    if (!config.ok) {
        return (
            <Shell>
                <p className="text-xs text-zinc-500">
                    Analíticas sin configurar ({config.missing.join(", ")}).
                </p>
            </Shell>
        );
    }

    try {
        const [overview, daily] = await Promise.all([
            getOverview(config, RANGE_DAYS),
            getDaily(config, RANGE_DAYS),
        ]);

        const max = Math.max(...daily.map((d) => d.pageviews), 1);

        return (
            <Shell>
                <div className="grid grid-cols-2 gap-3">
                    <Stat icon={Eye} label="Vistas (7 días)" value={overview.pageviews} />
                    <Stat icon={Users} label="Visitantes (7 días)" value={overview.visitors} />
                </div>

                <div className="mt-4 flex h-24 items-end gap-1.5" role="img" aria-label="Vistas por día, últimos 7 días">
                    {daily.length === 0 ? (
                        <p className="w-full pb-8 text-center text-xs text-zinc-500">Sin visitas todavía.</p>
                    ) : (
                        daily.map((d) => {
                            // Los días sin visitas se quedan en 0; el resto tiene un mínimo para que se vea.
                            const height = d.pageviews > 0 ? Math.max((d.pageviews / max) * 100, 4) : 0;
                            // Vercel devuelve cada día como medianoche UTC: formatear en UTC evita
                            // que en hora de Perú (UTC-5) se muestre el día anterior.
                            const label = new Date(d.date).toLocaleDateString("es-PE", { weekday: "short", timeZone: "UTC" });
                            return (
                                // h-full: sin altura definida en la columna, el height % de la barra se resuelve a 0.
                                <div key={d.date} className="group flex h-full min-w-0 flex-1 flex-col items-center gap-1">
                                    <div className="relative w-full flex-1">
                                        <div
                                            className="absolute inset-x-0 bottom-0 rounded-t bg-indigo-500/80 transition group-hover:bg-indigo-600"
                                            style={{ height: `${height}%` }}
                                            title={`${d.pageviews} vistas · ${d.visitors} visitantes`}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-200" />
                                    </div>
                                    <span className="text-[9px] capitalize text-zinc-400">{label}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </Shell>
        );
    } catch {
        return (
            <Shell>
                <p className="text-xs text-zinc-500">No se pudieron cargar las analíticas ahora mismo.</p>
            </Shell>
        );
    }
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">Tráfico de la tienda</h2>
                <Link
                    href="/admin/analytics"
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                    Ver analíticas <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </div>
            {children}
        </section>
    );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
    return (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                <Icon className="h-3 w-3" /> {label}
            </div>
            <p className="mt-1 text-xl font-bold text-zinc-900">{value.toLocaleString("es-PE")}</p>
        </div>
    );
}
